import React from 'react';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { useCommonStyles } from '../month-view/styles';
import { ICalendarEvent, IEventInfo } from '../utils/types';
import { DIMMED_FILTER } from '../utils/utils';

interface IOwnProps {
  event: IEventInfo,
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

  const onKeyUp = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.key === 'Enter') {
      onEventClick(event.orig);
    }
  };

  const fullLength = differenceInCalendarDays(event.endTimeV, event.startTimeV) + 1;
  const currLength = differenceInCalendarDays(currDate, event.startTimeV) + 1;
  const prefix = fullLength === 1 ? '' : `(${currLength}/${fullLength}) `;
  return (
    <div
      className={commonClasses.eventInstance}
      role="button"
      tabIndex={0}
      style={{
        filter: event.endTimeV <= now ? DIMMED_FILTER : undefined,
        backgroundColor: event.orig.colorCode,
      }}
      onClick={() => onEventClick(event.orig)}
      onKeyUp={onKeyUp}
    >
      <Typography
        className={commonClasses.eventText}
        variant="body2"
        style={{
          color: theme.palette.getContrastText(event.orig.colorCode),
        }}
      >
        {`${prefix}${event.orig.title}`}
      </Typography>
    </div>
  );
};

export default FullDayEvent;
