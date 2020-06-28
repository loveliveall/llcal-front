import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import MonthView from './month-view/MonthView';

import { ICalendarEvent } from './utils/types';

interface IOwnProps<TEvent extends ICalendarEvent> {
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
  onMonthDateClick?: (date: Date) => void,
  currDate: Date,
  view: 'month' | 'week' | 'day' | 'agenda',
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

  if (view === 'month') {
    return (
      <>
        <Hidden smDown>
          <MonthView
            events={events}
            currDate={currDate}
            onEventClick={onEventClickInternal}
            onMonthDateClick={onMonthDateClickInternal}
          />
        </Hidden>
        <Hidden mdUp>
          <ThemeProvider theme={mobileMonthViewTheme}>
            <MonthView
              isMobile
              events={events}
              currDate={currDate}
              onEventClick={onEventClickInternal}
              onMonthDateClick={onMonthDateClickInternal}
            />
          </ThemeProvider>
        </Hidden>
      </>
    );
  }
  return null;
}

export default Calendar;
