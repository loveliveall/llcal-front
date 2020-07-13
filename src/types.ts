export interface EventCache {
  serverEvents: {
    [id: string]: ServerEvent,
  },
  monthIDs: {
    [yearMonth: string]: string[],
  },
}

// Refer: ICalendarEvent
export interface ClientEvent {
  id: string,
  title: string,
  place: string,
  description: string,
  startTime: Date,
  endTime: Date,
  allDay: boolean,
  rrule: string,
  categoryId: number,
  voiceActorIds: number[],
  isLoveLive: boolean,
  isRepeating: boolean,
  dtstart: Date,
  colorCode: string,
}

export interface ServerEvent {
  id: string,
  title: string,
  place: string,
  description: string,
  startTime: number,
  duration: number,
  endTime: number,
  isAllDay: boolean,
  rrule: string,
  exceptionOffsets: number[],
  categoryId: number,
  voiceActorIds: number[],
  isLoveLive: boolean,
  isRepeating: boolean,
}

export interface VACheckState {
  [id: number]: boolean,
}
