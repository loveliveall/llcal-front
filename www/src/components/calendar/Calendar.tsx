import React from 'react';

import MonthView from './month-view/MonthView';

import { ICalendarEvent } from './utils/types';

interface IOwnProps<TEvent extends ICalendarEvent> {
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
  currDate: Date,
  view: 'month' | 'week' | 'day' | 'agenda',
}
type CalendarProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function Calendar<TEvent extends ICalendarEvent>({
  events, currDate, view, onEventClick,
}: CalendarProps<TEvent>): React.ReactElement | null {
  const onEventClickInternal = (event: ICalendarEvent) => onEventClick && onEventClick(event as TEvent);

  if (view === 'month') {
    return (
      <MonthView
        events={events}
        currDate={currDate}
        onEventClick={onEventClickInternal}
      />
    );
  }
  return null;
}

export default Calendar;
