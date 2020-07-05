import React from 'react';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import MonthView from './month-view/MonthView';
import DayView from './day-view/DayView';

import { ICalendarEvent } from './utils/types';

export type ViewType = 'month' | 'day'; // TODO: Add agenda view & may be week view..?

interface IOwnProps<TEvent extends ICalendarEvent> {
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
  onMonthDateClick?: (date: Date) => void,
  currDate: Date,
  view: ViewType,
}
type CalendarProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function Calendar<TEvent extends ICalendarEvent>({
  events, currDate, view, onEventClick, onMonthDateClick,
}: CalendarProps<TEvent>): React.ReactElement | null {
  const onEventClickInternal = (event: ICalendarEvent) => onEventClick && onEventClick(event as TEvent);
  const onMonthDateClickInternal = (date: Date) => onMonthDateClick && onMonthDateClick(date);
  const MOBILE_MONTH_SCALING = 0.75;
  const mobileMonthViewTheme = createMuiTheme({
    spacing: 8 * MOBILE_MONTH_SCALING, // https://material-ui.com/customization/spacing/
    typography: {
      fontSize: 14 * MOBILE_MONTH_SCALING, // https://material-ui.com/customization/typography/#font-size
    },
  });

  const normalizedEvents = events.map((event) => {
    if (!event.allDay) return event;
    return {
      ...event,
      startTime: startOfDay(event.startTime),
      endTime: endOfDay(event.endTime),
    };
  });

  if (view === 'month') {
    return (
      <>
        <Hidden smDown>
          <MonthView
            events={normalizedEvents}
            currDate={currDate}
            onEventClick={onEventClickInternal}
            onMonthDateClick={onMonthDateClickInternal}
          />
        </Hidden>
        <Hidden mdUp>
          <ThemeProvider theme={mobileMonthViewTheme}>
            <MonthView
              isMobile
              events={normalizedEvents}
              currDate={currDate}
              onEventClick={onEventClickInternal}
              onMonthDateClick={onMonthDateClickInternal}
            />
          </ThemeProvider>
        </Hidden>
      </>
    );
  }
  if (view === 'day') {
    return (
      <DayView
        currDate={currDate}
        events={normalizedEvents}
        onEventClick={onEventClickInternal}
      />
    );
  }
  return null;
}

export default Calendar;
