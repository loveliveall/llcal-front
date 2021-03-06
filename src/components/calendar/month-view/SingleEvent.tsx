import React from 'react';
import areEqual from 'fast-deep-equal';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { useCommonStyles } from './styles';
import { ICalendarEvent } from '../utils/types';
import { DIMMED_FILTER, getTimeString } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  eventCircle: {
    display: 'inline-block',
    borderRadius: theme.spacing(1),
    border: `${theme.spacing(0.5)}px solid`,
    marginRight: theme.spacing(0.25),
  },
  textClip: {
    textOverflow: 'clip',
  },
}));

interface OwnProps {
  isMobile: boolean,
  dayStartHour: number,
  event: ICalendarEvent,
  isBlock: boolean,
  onEventClick: (event: ICalendarEvent) => void,
}
type SingleEventProps = OwnProps;

const SingleEvent: React.FC<SingleEventProps> = ({
  isMobile, dayStartHour, event, isBlock, onEventClick,
}) => {
  const classes = useStyles();
  const classesCommon = useCommonStyles();
  const theme = useTheme();
  const now = new Date();

  const eventPrefix = (!event.allDay && !isMobile) ? `${getTimeString(event.startTime, dayStartHour)} ` : '';
  const eventText = `${eventPrefix}${event.title}`;

  const onClick = () => {
    onEventClick(event);
  };
  const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onEventClick(event);
    }
  };

  return (
    <div
      className={classesCommon.eventInstance}
      role="button"
      tabIndex={0}
      style={{
        filter: event.endTime <= now ? DIMMED_FILTER : undefined,
        backgroundColor: (isBlock || isMobile) ? event.colorCode : 'transparent',
      }}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {(!isBlock && !isMobile) && (
        <div
          className={classes.eventCircle}
          style={{ borderColor: event.colorCode }}
        />
      )}
      <Typography
        className={`${classesCommon.eventText} ${isMobile && classes.textClip}`}
        variant="body2"
        style={(isBlock || isMobile) ? {
          color: theme.palette.getContrastText(event.colorCode),
        } : undefined}
      >
        {eventText}
      </Typography>
    </div>
  );
};

export default React.memo(SingleEvent, (prevProps, nextProps) => (
  areEqual(prevProps.isMobile, nextProps.isMobile)
  && areEqual(prevProps.dayStartHour, nextProps.dayStartHour)
  && areEqual(prevProps.event, nextProps.event)
  && areEqual(prevProps.isBlock, nextProps.isBlock)
));
