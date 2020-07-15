import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { ICalendarEvent } from '@/components/calendar/utils/types';
import SingleDateView from '@/components/calendar/agenda-view/SingleDateView';

interface IOwnProps<TEvent extends ICalendarEvent> {
  startOfDay: Date,
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
}
type SingleDateResultProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function SingleDateResult<TEvent extends ICalendarEvent>({
  startOfDay, events, onEventClick,
}: SingleDateResultProps<TEvent>): React.ReactElement | null {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const onEventClickInternal = (event: ICalendarEvent) => onEventClick && onEventClick(event as TEvent);
  return (
    <SingleDateView
      isMobile={isMobile}
      showFullDate
      startOfDay={startOfDay}
      events={events}
      onEventClick={onEventClickInternal}
    />
  );
}

export default SingleDateResult;
