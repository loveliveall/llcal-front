import React from 'react';
import addDays from 'date-fns/addDays';
import addMonths from 'date-fns/addMonths';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import startOfMonth from 'date-fns/startOfMonth';

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
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
  currDate: Date,
}
type AgendaViewProps = IOwnProps;

const AgendaView: React.FC<AgendaViewProps> = ({
  isLoading, isMobile, dayStartHour, events, currDate, onEventClick,
}) => {
  const classes = useStyles();

  const monthStart = startOfMonth(currDate);
  const eventsInRange = getEventsInRange(events, monthStart, addMonths(monthStart, 1));
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
        new Array(getDaysInMonth(monthStart)).fill(null).map((_, idx) => {
          const targetDate = addDays(monthStart, idx);
          return (
            <SingleDateView
              key={targetDate.getTime()}
              isMobile={isMobile}
              dayStartHour={dayStartHour}
              showFullDate={false}
              startOfDay={targetDate}
              events={events}
              onEventClick={onEventClick}
            />
          );
        })
      ))}
    </div>
  );
};

export default AgendaView;
