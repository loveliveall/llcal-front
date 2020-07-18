import React from 'react';

import { ICalendarEvent } from '@/components/calendar/utils/types';
import SingleDateView from '@/components/calendar/agenda-view/SingleDateView';

import useMobileCheck from '@/hooks/useMobileCheck';

interface IOwnProps<TEvent extends ICalendarEvent> {
  startOfDay: Date,
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
}
type SingleDateResultProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function SingleDateResult<TEvent extends ICalendarEvent>({
  startOfDay, events, onEventClick,
}: SingleDateResultProps<TEvent>): React.ReactElement | null {
  const isMobile = useMobileCheck();

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
