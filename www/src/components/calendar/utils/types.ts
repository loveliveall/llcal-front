export interface ICalendarEvent {
  title: string,
  allDay: boolean,
  startTime: Date,
  endTime: Date,
  colorCode: string,
  [key: string]: any,
}
