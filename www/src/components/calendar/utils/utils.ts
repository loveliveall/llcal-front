import { ICalendarEvent } from './types';

export function getEventsInRange(events: ICalendarEvent[], rangeStart: Date, rangeEnd: Date) {
  return events.filter((event) => (
    (event.startTime < rangeEnd && rangeStart < event.endTime)
    || (event.startTime === event.endTime && rangeStart <= event.startTime && event.startTime < rangeEnd)
  ));
}

export const WEEKDAY_SHORT_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
