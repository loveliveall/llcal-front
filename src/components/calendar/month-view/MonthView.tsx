import React from 'react';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import startOfMonth from 'date-fns/startOfMonth';

import { styled } from '@mui/material';

import { ICalendarEvent, IEventInfo } from '../utils/types';

import DateHeader from './DateHeader';
import WeekRow from './WeekRow';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  borderLeft: `1px solid ${theme.palette.divider}`,
}));

interface IOwnProps {
  isMobile: boolean,
  dayStartHour: number,
  events: IEventInfo[],
  onEventClick: (event: ICalendarEvent) => void,
  onMonthDateClick: (date: Date) => void,
  currDate: Date,
}
type MonthViewProps = IOwnProps;

const MonthView: React.FC<MonthViewProps> = ({
  isMobile, dayStartHour, events, currDate, onEventClick, onMonthDateClick,
}) => {
  React.useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [events]);

  const monthStart = startOfMonth(currDate);
  const rangeStart = subDays(monthStart, monthStart.getDay()); // inclusive, sunday means 0
  return (
    <Root>
      {/* Date Header */}
      <DateHeader />
      {/* Date Row */}
      {new Array(6).fill(null).map((_, idx) => (
        <WeekRow
          key={`${monthStart}-${idx}`} // eslint-disable-line react/no-array-index-key
          isMobile={isMobile}
          dayStartHour={dayStartHour}
          events={events}
          onEventClick={onEventClick}
          onMonthDateClick={onMonthDateClick}
          rangeStart={addDays(rangeStart, 7 * idx)}
          currDate={currDate}
        />
      ))}
    </Root>
  );
};

export default MonthView;
