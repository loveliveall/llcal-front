import React from 'react';
import { useSelector } from 'react-redux';
import endOfDay from 'date-fns/endOfDay';
import subHours from 'date-fns/subHours';
import startOfDay from 'date-fns/startOfDay';

import { ICalendarEvent } from '@/components/calendar/utils/types';
import SingleDateView from '@/components/calendar/agenda-view/SingleDateView';

import useMobileCheck from '@/hooks/useMobileCheck';

import { AppState } from '@/store';

interface IOwnProps<TEvent extends ICalendarEvent> {
  startOfDay: Date,
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
}
type SingleDateResultProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function SingleDateResult<TEvent extends ICalendarEvent>({
  startOfDay: dayStart, events, onEventClick,
}: SingleDateResultProps<TEvent>): React.ReactElement | null {
  const isMobile = useMobileCheck();
  const dayStartHour = useSelector((state: AppState) => state.settings.dayStartHour);
  const converted = events.map((e) => ({
    orig: {
      ...e,
      startTime: e.allDay ? startOfDay(e.startTime) : e.startTime,
      endTime: e.allDay ? endOfDay(e.endTime) : e.endTime,
    },
    startTimeV: e.allDay ? startOfDay(e.startTime) : subHours(e.startTime, dayStartHour),
    endTimeV: e.allDay ? endOfDay(e.endTime) : subHours(e.endTime, dayStartHour),
  }));

  const onEventClickInternal = (event: ICalendarEvent) => onEventClick && onEventClick(event as TEvent);
  return (
    <SingleDateView
      isMobile={isMobile}
      dayStartHour={dayStartHour}
      showFullDate
      startOfDay={dayStart}
      events={converted}
      onEventClick={onEventClickInternal}
    />
  );
}

export default SingleDateResult;
