import startOfDay from 'date-fns/startOfDay';
import subHours from 'date-fns/subHours';
import endOfDay from 'date-fns/endOfDay';

import { ICalendarEvent, IEventInfo } from './types';

export const DIMMED_FILTER = 'opacity(0.33)';

function padWithZero(n: number, digit: number) {
  const str = n.toString();
  return `${'0'.repeat(Math.max(digit - str.length, 0))}${str}`;
}

export function getEventsInRange(events: IEventInfo[], rangeStart: Date, rangeEnd: Date): IEventInfo[] {
  // inclusive, exclusive
  return events.filter((event) => (
    (event.startTimeV < rangeEnd && rangeStart < event.endTimeV)
    || (event.startTimeV.getTime() === event.endTimeV.getTime()
        && rangeStart <= event.startTimeV && event.startTimeV < rangeEnd)
  ));
}

export function getTimeString(date: Date, dayStartHour: number): string {
  const h = date.getHours();
  const hour = h < dayStartHour ? h + 24 : h;
  return `${padWithZero(hour, 2)}:${padWithZero(date.getMinutes(), 2)}`;
}

export function normalizeEvents<TEvent extends ICalendarEvent>(events: TEvent[], dayStartHour: number): IEventInfo[] {
  return events.map((event) => ({
    orig: {
      ...event,
      startTime: event.allDay ? startOfDay(event.startTime) : event.startTime,
      endTime: event.allDay ? endOfDay(event.endTime) : event.endTime,
    },
    startTimeV: event.allDay ? startOfDay(event.startTime) : subHours(event.startTime, dayStartHour),
    endTimeV: event.allDay ? endOfDay(event.endTime) : subHours(event.endTime, dayStartHour),
  }));
}

export const WEEKDAY_SHORT_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
