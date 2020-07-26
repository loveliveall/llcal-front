export interface ICalendarEvent {
  id: string,
  title: string,
  allDay: boolean,
  startTime: Date,
  endTime: Date,
  colorCode: string,
}

export interface IEventInfo {
  orig: ICalendarEvent,
  // start / end time with day start hour offset applied
  startTimeV: Date,
  endTimeV: Date,
}

export interface ISingleEventRenderInfo {
  event: ICalendarEvent,
  startSlotIdx: number, // -1 means do not render this event. It only holds context
  slotCount: number,
  isBlock: boolean,
}
export type TMonthEventGrid = (ISingleEventRenderInfo | null)[][];
