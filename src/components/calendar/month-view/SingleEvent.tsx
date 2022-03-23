import React from 'react';
import areEqual from 'fast-deep-equal';

import { styled, useTheme } from '@mui/material/styles';

import { EventInstanceDiv, EventTextTypo } from './styles';
import { ICalendarEvent } from '../utils/types';
import { DIMMED_FILTER, getTimeString } from '../utils/utils';

const EventCircle = styled('div')(({ theme }) => ({
  display: 'inline-block',
  borderRadius: theme.spacing(1),
  border: `${theme.spacing(0.5)} solid`,
  marginRight: theme.spacing(0.25),
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
    <EventInstanceDiv
      role="button"
      tabIndex={0}
      sx={{
        filter: event.endTime <= now ? DIMMED_FILTER : undefined,
        backgroundColor: (isBlock || isMobile) ? event.colorCode : 'transparent',
      }}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      {(!isBlock && !isMobile) && (
        <EventCircle
          sx={{ borderColor: event.colorCode }}
        />
      )}
      <EventTextTypo
        variant="body2"
        sx={{
          ...(isMobile && {
            textOverflow: 'clip',
          }),
          ...((isBlock || isMobile) && {
            color: theme.palette.getContrastText(event.colorCode),
          }),
        }}
      >
        {eventText}
      </EventTextTypo>
    </EventInstanceDiv>
  );
};

export default React.memo(SingleEvent, (prevProps, nextProps) => (
  areEqual(prevProps.isMobile, nextProps.isMobile)
  && areEqual(prevProps.dayStartHour, nextProps.dayStartHour)
  && areEqual(prevProps.event, nextProps.event)
  && areEqual(prevProps.isBlock, nextProps.isBlock)
));
