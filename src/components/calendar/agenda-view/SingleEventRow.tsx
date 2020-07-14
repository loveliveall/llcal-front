import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { getTimeString } from '../utils/utils';
import { ICalendarEvent } from '../utils/types';

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
  event: ICalendarEvent,
  onEventClick: (event: ICalendarEvent) => void,
  startOfDay: Date,
  nextDayStart: Date,
}
type SingleEventRowProps = IOwnProps;

const SingleEventRow: React.FC<SingleEventRowProps> = ({
  isMobile, event, onEventClick, startOfDay, nextDayStart,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const onClick = () => onEventClick(event);
  const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onEventClick(event);
    }
  };
  const startTimeStr = event.startTime < startOfDay ? '' : getTimeString(event.startTime);
  const endTimeStr = (() => {
    if (event.endTime > nextDayStart) return ''; // Event continues to next day
    if (event.endTime.getTime() === nextDayStart.getTime()) return '24:00'; // Exceptional case to display 24:00
    return getTimeString(event.endTime);
  })();
  const timeString = (() => {
    if (event.allDay) return '종일';
    if (startTimeStr === '' && endTimeStr === '') return '종일';
    if (startTimeStr === endTimeStr) return startTimeStr;
    return `${startTimeStr} - ${endTimeStr}`;
  })();

  const fullLength = differenceInCalendarDays(event.endTime, event.startTime) + 1;
  const currLength = differenceInCalendarDays(startOfDay, event.startTime) + 1;
  const eventText = `${event.title}${timeString === '종일' && fullLength !== 1 ? ` (${currLength}/${fullLength})` : ''}`;
  return (
    <div
      className={classes.eventInstance}
      role="button"
      tabIndex={0}
      style={isMobile ? {
        backgroundColor: event.colorCode,
      } : undefined}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {!isMobile && (
        <>
          <div className={classes.circleWrapper}>
            <div
              className={classes.eventCircle}
              style={{ borderColor: event.colorCode }}
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
            color: theme.palette.getContrastText(event.colorCode),
          } : undefined}
        >
          {eventText}
        </Typography>
        {isMobile && timeString !== '종일' && (
          <Typography
            variant="body2"
            style={{
              color: theme.palette.getContrastText(event.colorCode),
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
