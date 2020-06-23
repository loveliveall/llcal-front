import React from 'react';

import MonthView from './month-view/MonthView';

import { ICalendarEvent } from './utils/types';

interface IOwnProps<TEvent extends ICalendarEvent> {
  events: TEvent[],
  currDate: Date,
  view: 'month' | 'week' | 'day' | 'agenda',
}
type CalendarProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function Calendar<TEvent extends ICalendarEvent>({
  events, currDate, view,
}: CalendarProps<TEvent>): React.ReactElement | null {
  if (view === 'month') return <MonthView events={events} currDate={currDate} />;
  return null;
}

export default Calendar;
