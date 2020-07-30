import React from 'react';
import startOfDay from 'date-fns/startOfDay';
import subHours from 'date-fns/subHours';
import endOfDay from 'date-fns/endOfDay';
import isSameMonth from 'date-fns/isSameMonth';

import { createMuiTheme, ThemeProvider, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import MonthView from './month-view/MonthView';
import DayView from './day-view/DayView';
import AgendaView from './agenda-view/AgendaView';

import { ICalendarEvent, IEventInfo } from './utils/types';

export type ViewType = 'month' | 'day' | 'agenda'; // TODO: Add week view..?

interface IOwnProps<TEvent extends ICalendarEvent> {
  isLoading?: boolean,
  dayStartHour?: number,
  events: TEvent[],
  onEventClick?: (event: TEvent) => void,
  onMonthDateClick?: (date: Date) => void,
  currDate: Date,
  view: ViewType,
}
type CalendarProps<TEvent extends ICalendarEvent> = IOwnProps<TEvent>;

function Calendar<TEvent extends ICalendarEvent>({
  isLoading, dayStartHour, events, currDate, view, onEventClick, onMonthDateClick,
}: CalendarProps<TEvent>): React.ReactElement | null {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const isLoadingInternal = !!isLoading;
  const dayStartHourInternal = dayStartHour ?? 0;
  const currDateInternal = subHours(currDate, dayStartHourInternal);
  const onEventClickInternal = (event: ICalendarEvent) => onEventClick && onEventClick(event as TEvent);
  const onMonthDateClickInternal = (date: Date) => onMonthDateClick && onMonthDateClick(date);
  const MOBILE_MONTH_SCALING = 0.75;
  const mobileMonthViewTheme = createMuiTheme({
    ...theme,
    spacing: 8 * MOBILE_MONTH_SCALING, // https://material-ui.com/customization/spacing/
    typography: {
      fontSize: 14 * MOBILE_MONTH_SCALING, // https://material-ui.com/customization/typography/#font-size
    },
  });

  const initScroll = () => {
    if (view === 'day') {
      window.scrollTo(0, 0);
    } else if (view === 'agenda') {
      const now = startOfDay(subHours(new Date(), dayStartHourInternal));
      if (isSameMonth(currDateInternal, now)) {
        // Today month. scroll to date
        const scrollTop = document.getElementById(`date-${now.getTime()}`)?.offsetTop;
        window.scroll({
          top: scrollTop === undefined ? undefined : scrollTop,
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  React.useEffect(() => {
    initScroll();
  }, [currDate, view, isLoadingInternal]);

  const normalizedEvents: IEventInfo[] = events.map((event) => ({
    orig: event,
    startTimeV: event.allDay ? startOfDay(event.startTime) : subHours(event.startTime, dayStartHourInternal),
    endTimeV: event.allDay ? endOfDay(event.endTime) : subHours(event.endTime, dayStartHourInternal),
  }));

  if (view === 'month') {
    return (
      <ThemeProvider theme={isMobile ? mobileMonthViewTheme : theme}>
        <MonthView
          isMobile={isMobile}
          dayStartHour={dayStartHourInternal}
          events={normalizedEvents}
          currDate={currDateInternal}
          onEventClick={onEventClickInternal}
          onMonthDateClick={onMonthDateClickInternal}
        />
      </ThemeProvider>
    );
  }
  if (view === 'day') {
    return (
      <DayView
        currDate={currDateInternal}
        dayStartHour={dayStartHourInternal}
        events={normalizedEvents}
        onEventClick={onEventClickInternal}
      />
    );
  }
  if (view === 'agenda') {
    return (
      <AgendaView
        isLoading={isLoadingInternal}
        isMobile={isMobile}
        dayStartHour={dayStartHourInternal}
        currDate={currDateInternal}
        events={normalizedEvents}
        onEventClick={onEventClickInternal}
      />
    );
  }
  return null;
}

export default Calendar;
