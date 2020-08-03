import React from 'react';
import addDays from 'date-fns/addDays';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

import SingleDateView from './SingleDateView';
import { getEventsInRange } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
  },
  innerBox: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
}));

interface IOwnProps {
  isLoading: boolean,
  isMobile: boolean,
  dayStartHour: number,
  rangeStart: Date,
  rangeEnd: Date,
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
}
type AgendaViewProps = IOwnProps;

const AgendaView: React.FC<AgendaViewProps> = ({
  isLoading, isMobile, dayStartHour, events, rangeStart, rangeEnd, onEventClick,
}) => {
  const classes = useStyles();

  const eventsInRange = getEventsInRange(events, rangeStart, rangeEnd);
  return (
    <div className={classes.root}>
      {isLoading && (
        <div className={classes.innerBox}>
          <HourglassEmptyIcon fontSize="large" color="inherit" />
          <Typography variant="h6">
            일정을 불러오는 중입니다.
          </Typography>
        </div>
      )}
      {!isLoading && (eventsInRange.length === 0 ? (
        <div className={classes.innerBox}>
          <EventAvailableIcon fontSize="large" color="inherit" />
          <Typography variant="h6">
            기간 내에 일정이 없습니다.
          </Typography>
        </div>
      ) : (
        new Array(differenceInCalendarDays(rangeEnd, rangeStart)).fill(null).map((_, idx) => {
          const targetDate = addDays(rangeStart, idx);
          return (
            <SingleDateView
              key={targetDate.getTime()}
              isMobile={isMobile}
              dayStartHour={dayStartHour}
              showFullDate
              startOfDay={targetDate}
              eventsInRange={getEventsInRange(events, targetDate, addDays(targetDate, 1))}
              onEventClick={onEventClick}
            />
          );
        })
      ))}
    </div>
  );
};

export default AgendaView;
