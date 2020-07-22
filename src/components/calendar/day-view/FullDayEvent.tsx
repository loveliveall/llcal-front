import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { useCommonStyles } from '../month-view/styles';
import { ICalendarEvent } from '../utils/types';
import { DIMMED_FILTER } from '../utils/utils';

interface IOwnProps {
  event: ICalendarEvent,
  currDate: Date,
  onEventClick: (event: ICalendarEvent) => void,
}
type FullDayEventProps = IOwnProps;

const FullDayEvent: React.FC<FullDayEventProps> = ({
  event, currDate, onEventClick,
}) => {
  const commonClasses = useCommonStyles();
  const theme = useTheme();
  const now = new Date();

  const fullLength = differenceInCalendarDays(event.endTime, event.startTime) + 1;
  const currLength = differenceInCalendarDays(currDate, event.startTime) + 1;
  const prefix = fullLength === 1 ? '' : `(${currLength}/${fullLength}) `;
  return (
    <Box
      className={commonClasses.eventInstance}
      style={{
        filter: event.endTime <= now ? DIMMED_FILTER : undefined,
        backgroundColor: event.colorCode,
      }}
      onClick={() => onEventClick(event)}
    >
      <Typography
        className={commonClasses.eventText}
        variant="body2"
        style={{
          color: theme.palette.getContrastText(event.colorCode),
        }}
      >
        {`${prefix}${event.title}`}
      </Typography>
    </Box>
  );
};

export default FullDayEvent;
