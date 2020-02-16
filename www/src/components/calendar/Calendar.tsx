import React from 'react';

import MonthView from './month-view/MonthView';

import { ICalendarEvent } from './utils/types';

interface IOwnProps {
  events: ICalendarEvent[],
  currDate: Date,
  view: 'month' | 'week' | 'day' | 'agenda',
}
type CalendarProps = IOwnProps;

const Calendar: React.FC<CalendarProps> = ({
  events, currDate, view,
}) => {
  if (view === 'month') return <MonthView events={events} currDate={currDate} />;
  return null;
};

export default Calendar;
