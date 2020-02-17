import React from 'react';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';
import isSameMonth from 'date-fns/isSameMonth';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { ICalendarEvent } from '../utils/types';
import { getEventsInRange } from '../utils/utils';

import WeekEventRow from './WeekEventRow';

const useStyles = makeStyles((theme) => {
  const headerMarginUnit = 0.5;
  const circleDiameter = `calc(${theme.spacing(headerMarginUnit / 2)}px + ${theme.typography.body2.lineHeight}em)`;
  return createStyles({
    row: {
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
      flex: '1 1 0%',
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    cell: {
      flex: '1 1 0%',
      borderRight: `1px solid ${theme.palette.divider}`,
      textAlign: 'center',
      zIndex: -1,
    },
    diffMonthCell: {
      backgroundColor: theme.palette.grey[300],
    },
    todayDate: {
      borderRadius: '50%',
      width: circleDiameter,
      height: circleDiameter,
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      lineHeight: circleDiameter,
      margin: `${theme.spacing(headerMarginUnit / 2)}px 0px ${theme.spacing(headerMarginUnit / 2)}px 0px`,
      fontWeight: 'bold',
    },
    otherDate: {
      margin: `${theme.spacing(headerMarginUnit)}px 0px ${theme.spacing(headerMarginUnit)}px 0px`,
      fontWeight: 'bold',
    },
    diffMonthDate: {
      color: theme.palette.grey[600],
      fontWeight: 'inherit',
    },
    eventOverlay: {
      marginTop: `calc(1px + ${theme.spacing(headerMarginUnit * 2)}px + ${theme.typography.body2.lineHeight}em)`, // Border, top/bot margin, line-height
    },
  });
});

interface IOwnProps {
  rangeStart: Date,
  events: ICalendarEvent[],
  currDate: Date,
}
type WeekRowProps = IOwnProps;

const WeekRow: React.FC<WeekRowProps> = ({
  rangeStart, events, currDate,
}) => {
  const classes = useStyles();

  const now = new Date();
  const rangeEnd = addDays(rangeStart, 7); // Exlusive
  const targetEvents = getEventsInRange(events, rangeStart, rangeEnd).map((event) => ({
    ...event,
    visibleStart: event.startTime < rangeStart ? rangeStart : event.startTime,
    visibleEnd: rangeEnd <= event.endTime ? rangeEnd : event.endTime,
  })); // TODO: Sort events.
  // 1. Multi day events - earlier startdate comes first, than follow single day events rule
  // 2. Single day events - allday comes first, than earlier starttime comes first
  return (
    <div className={classes.row}>
      {/* Cell display */}
      <Box display="flex" position="absolute" width="100%" top={0} left={0} bottom={0}>
        {new Array(7).fill(null).map((_, idx) => {
          const cellDate = addDays(rangeStart, idx);
          const isToday = isSameDay(cellDate, now);
          const isTargetMonth = isSameMonth(cellDate, currDate);
          return (
            <Box key={Math.random()} className={`${classes.cell} ${!isTargetMonth && classes.diffMonthCell}`}>
              <Box display="flex" justifyContent="center">
                <span
                  className={`${isToday ? classes.todayDate : classes.otherDate}
                   ${!isTargetMonth && classes.diffMonthDate}`}
                >
                  {cellDate.getDate()}
                </span>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box display="flex" className={classes.eventOverlay}>
        <WeekEventRow rangeStart={rangeStart} targetEvents={targetEvents} />
      </Box>
    </div>
  );
};

export default WeekRow;
