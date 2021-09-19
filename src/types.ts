import { ViewType } from '@/components/calendar';

// Refer: ICalendarEvent
export interface ClientEvent {
  id: string,
  serverId: string,
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
  link: string | null,
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
  link: string | null,
}

export interface ClientConcertGroup {
  id: string,
  title: string,
  startTime: Date,
  endTime: Date,
  mainEventIds: string[],
  subEventIds: string[],
  voiceActorIds: number[],
  isLoveLive: boolean,
}

export interface ServerConcertGroup {
  id: string,
  title: string,
  startTime: number,
  endTime: number,
  mainEventIds: string[],
  subEventIds: string[],
  voiceActorIds: number[],
  isLoveLive: boolean,
}

export interface ETCCheckState {
  includeRepeating: boolean,
  showLoveLive: boolean,
  showNonLoveLive: boolean,
}

export interface VACheckState {
  [id: number]: boolean,
}

export interface CategoryCheckState {
  [id: number]: boolean,
}

export type AppViewType = ViewType | 'dashboard' | 'concert';

export type ViewInfo = {
  showBack: boolean,
  currType: AppViewType,
};
