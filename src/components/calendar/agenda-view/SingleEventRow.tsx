import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { DIMMED_FILTER, getTimeString } from '../utils/utils';
import { ICalendarEvent, IEventInfo } from '../utils/types';

const useStyles = makeStyles((theme: Theme) => ({
  eventInstance: {
    display: 'flex',
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    margin: theme.spacing(0.25),
    borderRadius: theme.spacing(0.5),
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'inset 0px 0px 0px 1000px rgba(0, 0, 0, 0.1)',
    },
  },
  eventCircle: {
    borderRadius: theme.spacing(1.5),
    border: `${theme.spacing(0.75)}px solid`,
  },
  circleWrapper: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.body2.fontSize,
    height: `${theme.typography.body2.lineHeight}em`,
    paddingRight: theme.spacing(3),
  },
  timeText: {
    minWidth: theme.spacing(14),
  },
}));

interface IOwnProps {
  isMobile: boolean,
  dayStartHour: number,
  event: IEventInfo,
  onEventClick: (event: ICalendarEvent) => void,
  startOfDay: Date,
  nextDayStart: Date,
}
type SingleEventRowProps = IOwnProps;

const SingleEventRow: React.FC<SingleEventRowProps> = ({
  isMobile, dayStartHour, event, onEventClick, startOfDay, nextDayStart,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const now = new Date();

  const onClick = () => onEventClick(event.orig);
  const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onEventClick(event.orig);
    }
  };
  const startTimeStr = event.startTimeV < startOfDay ? '' : getTimeString(event.orig.startTime, dayStartHour);
  const endTimeStr = (() => {
    if (event.endTimeV > nextDayStart) return ''; // Event continues to next day
    if (event.endTimeV.getTime() === nextDayStart.getTime()) return `${24 + dayStartHour}:00`; // Exceptional case to display 24:00
    return getTimeString(event.orig.endTime, dayStartHour);
  })();
  const timeString = (() => {
    if (event.orig.allDay) return '종일';
    if (startTimeStr === '' && endTimeStr === '') return '종일';
    if (startTimeStr === endTimeStr) return startTimeStr;
    return `${startTimeStr} - ${endTimeStr}`;
  })();

  const fullLength = differenceInCalendarDays(event.endTimeV, event.startTimeV) + 1;
  const currLength = differenceInCalendarDays(startOfDay, event.startTimeV) + 1;
  const eventText = `${event.orig.title}${timeString === '종일' && fullLength !== 1
    ? ` (${currLength}/${fullLength})` : ''}`;
  return (
    <div
      className={classes.eventInstance}
      role="button"
      tabIndex={0}
      style={{
        filter: event.orig.endTime <= now ? DIMMED_FILTER : undefined,
        backgroundColor: isMobile ? event.orig.colorCode : undefined,
      }}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {!isMobile && (
        <>
          <div className={classes.circleWrapper}>
            <div
              className={classes.eventCircle}
              style={{ borderColor: event.orig.colorCode }}
            />
          </div>
          <div className={classes.timeText}>
            <Typography
              component="span"
              variant="body2"
            >
              {timeString}
            </Typography>
          </div>
        </>
      )}
      <div>
        <Typography
          variant="body2"
          style={isMobile ? {
            color: theme.palette.getContrastText(event.orig.colorCode),
          } : undefined}
        >
          {eventText}
        </Typography>
        {isMobile && timeString !== '종일' && (
          <Typography
            variant="body2"
            style={{
              color: theme.palette.getContrastText(event.orig.colorCode),
            }}
          >
            {timeString}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default SingleEventRow;
