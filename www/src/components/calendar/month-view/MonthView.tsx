import React from 'react';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import startOfMonth from 'date-fns/startOfMonth';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { ICalendarEvent } from '../utils/types';
import { WEEKDAY_SHORT_NAMES } from '../utils/utils';

import WeekRow from './WeekRow';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  headerCell: {
    flex: '1 1 0%',
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    margin: `${theme.spacing(0.25)}px 0px ${theme.spacing(0.25)}px 0px`,
  },
}));

interface IOwnProps {
  isMobile: boolean,
  events: ICalendarEvent[],
  onEventClick: (event: ICalendarEvent) => void,
  onMonthDateClick: (date: Date) => void,
  currDate: Date,
}
type MonthViewProps = IOwnProps;

const MonthView: React.FC<MonthViewProps> = ({
  isMobile, events, currDate, onEventClick, onMonthDateClick,
}) => {
  const classes = useStyles();

  React.useEffect(() => {
    // Fire initial resize event on first mount to get ref of rendered DOM
    window.dispatchEvent(new Event('resize'));
  }, []);

  const monthStart = startOfMonth(currDate);
  const rangeStart = subDays(monthStart, monthStart.getDay()); // inclusive, sunday means 0
  return (
    <div className={classes.root}>
      {/* Date Header */}
      <div className={classes.row}>
        {WEEKDAY_SHORT_NAMES.map((weekdayName) => (
          <div key={weekdayName} className={classes.headerCell}>
            <Typography
              className={classes.headerText}
              component="div"
              variant="body2"
            >
              {weekdayName}
            </Typography>
          </div>
        ))}
      </div>
      {/* Date Row */}
      {new Array(6).fill(null).map((_, idx) => (
        <WeekRow
          key={`${currDate}-${idx}`} // eslint-disable-line react/no-array-index-key
          isMobile={isMobile}
          events={events}
          onEventClick={onEventClick}
          onMonthDateClick={onMonthDateClick}
          rangeStart={addDays(rangeStart, 7 * idx)}
          currDate={currDate}
        />
      ))}
    </div>
  );
};

export default MonthView;
