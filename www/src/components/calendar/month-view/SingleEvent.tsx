import React from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { useCommonStyles } from './styles';
import { ICalendarEvent } from '../utils/types';
import { getTimeString } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
  eventCircle: {
    display: 'inline-block',
    borderRadius: theme.spacing(1),
    border: `${theme.spacing(0.5)}px solid`,
    marginRight: theme.spacing(0.25),
  },
}));

interface OwnProps {
  isMobile: boolean,
  event: ICalendarEvent,
  isBlock: boolean,
  onEventClick: (event: ICalendarEvent) => void,
}
type SingleEventProps = OwnProps;

const SingleEvent: React.FC<SingleEventProps> = ({
  isMobile, event, isBlock, onEventClick,
}) => {
  const classes = useStyles();
  const classesCommon = useCommonStyles();
  const theme = useTheme();

  const eventPrefix = (!event.allDay && !isMobile) ? `${getTimeString(event.startTime)} ` : '';
  const eventText = `${eventPrefix}${event.title}`;
  return (
    <Box
      key={Math.random()}
      className={classesCommon.eventInstance}
      style={{ backgroundColor: (isBlock || isMobile) ? event.colorCode : 'transparent' }}
      onClick={() => onEventClick(event)}
    >
      {(!isBlock && !isMobile) && (
        <div
          className={classes.eventCircle}
          style={{ borderColor: event.colorCode }}
        />
      )}
      <Typography
        className={classesCommon.eventText}
        variant="body2"
        style={(isBlock || isMobile) ? {
          color: theme.palette.getContrastText(event.colorCode),
        } : undefined}
      >
        {eventText}
      </Typography>
    </Box>
  );
};

export default SingleEvent;
