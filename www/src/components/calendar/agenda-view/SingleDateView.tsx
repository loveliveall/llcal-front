import React from 'react';
import addDays from 'date-fns/addDays';
import isSameDay from 'date-fns/isSameDay';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import SingleEventRow from './SingleEventRow';

import { getEventsInRange, WEEKDAY_SHORT_NAMES } from '../utils/utils';
import { ICalendarEvent } from '../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  row: {
    width: '100%',
  },
  content: {
    padding: theme.spacing(1),
  },
  dayTitle: {
    paddingBottom: theme.spacing(0.5),
  },
  today: {
    backgroundColor: 'lightblue',
  },
}));

interface IOwnProps {
  isMobile: boolean,
  startOfDay: Date,
  events: ICalendarEvent[],
  onEventClick: (event: ICalendarEvent) => void,
}
type SingleDateViewProps = IOwnProps;

const SingleDateView: React.FC<SingleDateViewProps> = ({
  isMobile, startOfDay, events, onEventClick,
}) => {
  const classes = useStyles();

  const now = new Date();
  const rangeEnd = addDays(startOfDay, 1);
  const visibleEvents = getEventsInRange(events, startOfDay, rangeEnd).sort((a, b) => {
    const aFullDay = a.allDay || (a.startTime <= startOfDay && rangeEnd <= a.endTime);
    const bFullDay = b.allDay || (b.startTime <= startOfDay && rangeEnd <= b.endTime);
    if (aFullDay && !bFullDay) return -1;
    if (!aFullDay && bFullDay) return 1;
    // Both have same fullday parity
    // Earlier starttime wins
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    // For fullday, longer event wins
    if (aFullDay && bFullDay) {
      if (a.endTime > b.endTime) return -1;
      if (a.endTime < b.endTime) return -1;
    }
    // For non-fullday, shorter event wins
    if (a.endTime < b.endTime) return -1;
    if (a.endTime > b.endTime) return 1;
    return 0;
  });
  if (visibleEvents.length === 0) return null;
  return (
    <div className={`${classes.row} ${isSameDay(startOfDay, now) && classes.today}`}>
      <Divider />
      <div className={classes.content}>
        <Typography variant="subtitle1" className={classes.dayTitle}>
          {`${startOfDay.getDate()}일 (${WEEKDAY_SHORT_NAMES[startOfDay.getDay()]})`}
        </Typography>
        {visibleEvents.map((event) => (
          <SingleEventRow
            key={Math.random()}
            isMobile={isMobile}
            event={event}
            onEventClick={onEventClick}
            startOfDay={startOfDay}
            nextDayStart={rangeEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default SingleDateView;
