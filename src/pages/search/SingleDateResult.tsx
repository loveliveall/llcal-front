import React from 'react';
import areEqual from 'fast-deep-equal';

import { ICalendarEvent, IEventInfo } from '@/components/calendar/utils/types';
import SingleDateView from '@/components/calendar/agenda-view/SingleDateView';

import useMobileCheck from '@/hooks/useMobileCheck';

interface IOwnProps<TEvent extends ICalendarEvent> {
  dayStartHour: number,
  startOfDay: Date,
  eventsInRange: IEventInfo[],
  onEventClick?: (event: TEvent) => void,
}
type SingleDateResultProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function SingleDateResult<TEvent extends ICalendarEvent>({
  dayStartHour, startOfDay: dayStart, eventsInRange, onEventClick,
}: SingleDateResultProps<TEvent>): React.ReactElement | null {
  const isMobile = useMobileCheck();

  const onEventClickInternal = (event: ICalendarEvent) => onEventClick && onEventClick(event as TEvent);
  return (
    <SingleDateView
      isMobile={isMobile}
      dayStartHour={dayStartHour}
      showFullDate
      startOfDay={dayStart}
      eventsInRange={eventsInRange}
      onEventClick={onEventClickInternal}
    />
  );
}

export default React.memo(SingleDateResult, (prevProps, nextProps) => (
  areEqual(prevProps.dayStartHour, nextProps.dayStartHour)
  && areEqual(prevProps.startOfDay, nextProps.startOfDay)
  && areEqual(prevProps.eventsInRange, nextProps.eventsInRange)
)) as typeof SingleDateResult;
