import React from 'react';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import startOfMonth from 'date-fns/startOfMonth';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { ICalendarEvent } from '../utils/types';
import { WEEKDAY_SHORT_NAMES } from '../utils/utils';

import WeekRow from './WeekRow';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    height: '100%',
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  row: {
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  headerCell: {
    flex: '1 1 0%',
    borderRight: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    margin: `${theme.spacing(0.25)}px 0px ${theme.spacing(0.25)}px 0px`,
  },
}));

interface IOwnProps {
  events: ICalendarEvent[],
  onEventClick: (event: ICalendarEvent) => void,
  currDate: Date,
}
type MonthViewProps = IOwnProps;

const MonthView: React.FC<MonthViewProps> = ({
  events, currDate, onEventClick,
}) => {
  const classes = useStyles();

  React.useEffect(() => {
    // Fire initial resize event on first mount to get ref of rendered DOM
    window.dispatchEvent(new Event('resize'));
  }, []);

  const monthStart = startOfMonth(currDate);
  const rangeStart = subDays(monthStart, monthStart.getDay()); // inclusive, sunday means 0
  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      {/* Date Header */}
      <Box display="flex" flexDirection="row" className={classes.row}>
        {WEEKDAY_SHORT_NAMES.map((weekdayName) => (
          <Box key={Math.random()} className={classes.headerCell}>
            <div className={classes.headerText}>{weekdayName}</div>
          </Box>
        ))}
      </Box>
      {/* Date Row */}
      {new Array(6).fill(null).map((_, idx) => (
        <WeekRow
          key={Math.random()}
          events={events}
          onEventClick={onEventClick}
          rangeStart={addDays(rangeStart, 7 * idx)}
          currDate={currDate}
        />
      ))}
    </Box>
  );
};

export default MonthView;
