import React from 'react';

import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { useCommonStyles } from './styles';
import { ICalendarEvent } from '../utils/types';
import { getTimeString } from '../utils/utils';

const useStyles = makeStyles((theme) => createStyles({
  eventCircle: {
    display: 'inline-block',
    borderRadius: theme.spacing(1),
    border: `${theme.spacing(0.5)}px solid`,
    marginRight: theme.spacing(0.25),
  },
}));

interface OwnProps {
  event: ICalendarEvent,
  isBlock: boolean,
  onEventClick: (event: ICalendarEvent) => void,
}
type SingleEventProps = OwnProps;

const SingleEvent: React.FC<SingleEventProps> = ({
  event, isBlock, onEventClick,
}) => {
  const classes = useStyles();
  const classesCommon = useCommonStyles();
  const theme = useTheme();

  const eventPrefix = !event.allDay ? `${getTimeString(event.startTime)} ` : '';
  const eventText = `${eventPrefix}${event.title}`;
  return (
    <Box
      key={Math.random()}
      className={classesCommon.eventInstance}
      style={{ backgroundColor: isBlock ? event.colorCode : 'transparent' }}
      onClick={() => onEventClick(event)}
    >
      {!isBlock && (
        <div
          className={classes.eventCircle}
          style={{ borderColor: event.colorCode }}
        />
      )}
      <Typography
        className={classesCommon.eventText}
        variant="body2"
        style={isBlock ? {
          color: theme.palette.getContrastText(event.colorCode),
        } : undefined}
        noWrap
      >
        {eventText}
      </Typography>
    </Box>
  );
};

export default SingleEvent;
