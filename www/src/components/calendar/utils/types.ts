export interface ICalendarEvent {
  title: string,
  allDay: boolean,
  startTime: Date,
  endTime: Date,
  colorCode: string,
}

export interface ISingleEventRenderInfo {
  event: ICalendarEvent,
  startSlotIdx: number, // -1 means do not render this event. It only holds context
  slotCount: number,
}
export type TMonthEventGrid = (ISingleEventRenderInfo | null)[][];
