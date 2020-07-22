import { ICalendarEvent } from './types';

export const DIMMED_FILTER = 'opacity(0.33)';

function padWithZero(n: number, digit: number) {
  const str = n.toString();
  return `${'0'.repeat(Math.max(digit - str.length, 0))}${str}`;
}

export function getEventsInRange(events: ICalendarEvent[], rangeStart: Date, rangeEnd: Date): ICalendarEvent[] {
  // inclusive, exclusive
  return events.filter((event) => (
    (event.startTime < rangeEnd && rangeStart < event.endTime)
    || (event.startTime.getTime() === event.endTime.getTime()
        && rangeStart <= event.startTime && event.startTime < rangeEnd)
  ));
}

export function getTimeString(date: Date): string {
  return `${padWithZero(date.getHours(), 2)}:${padWithZero(date.getMinutes(), 2)}`;
}

export const WEEKDAY_SHORT_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
