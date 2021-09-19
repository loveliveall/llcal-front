import {
  getObjWithProp,
  getTimeForClient,
  getTimestampForServer,
} from '@/utils';
import {
  ServerConcertGroup,
  ClientConcertGroup,
  ClientEvent,
  ServerEvent,
} from '@/types';
import { eventCategoryList } from '@/commonData';

import { API_ENDPOINT } from './const';

function getHeader(token: string) {
  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
}

export async function getEventsByIds(idList: string[]): Promise<ClientEvent[]> {
  const res = await fetch(`${API_ENDPOINT}/events-by-ids?ids=${idList.join(',')}`);
  const events: ServerEvent[] = await res.json();

  // Map server events to client events, ignore repeated event
  return events.reduce((acc, curr) => {
    const colorCode = getObjWithProp(eventCategoryList, 'id', curr.categoryId)?.colorHex ?? '#ffa400';
    const eventStart = getTimeForClient(curr.startTime);
    const eventEnd = new Date(eventStart.getTime() + curr.duration * 1000);
    return acc.concat([{
      id: curr.id,
      serverId: curr.id,
      title: curr.title,
      place: curr.place,
      description: curr.description,
      startTime: eventStart,
      endTime: eventEnd,
      allDay: curr.isAllDay,
      rrule: curr.rrule,
      categoryId: curr.categoryId,
      voiceActorIds: curr.voiceActorIds,
      isLoveLive: curr.isLoveLive,
      isRepeating: curr.isRepeating,
      dtstart: eventStart,
      colorCode,
      link: curr.link,
    }]);
  }, [] as ClientEvent[]);
}

export async function getConcertGroups(from: Date, to: Date): Promise<ClientConcertGroup[]> {
  const fromTs = getTimestampForServer(from);
  const toTs = getTimestampForServer(to);
  const res = await fetch(`${API_ENDPOINT}/concert-group?from=${fromTs}&to=${toTs}`);
  const concertGroups: ServerConcertGroup[] = await res.json();

  return concertGroups.map((g) => {
    const ret: ClientConcertGroup = {
      id: g.id,
      title: g.title,
      startTime: getTimeForClient(g.startTime),
      endTime: getTimeForClient(g.endTime),
      mainEventIds: g.mainEventIds,
      subEventIds: g.subEventIds,
      voiceActorIds: g.voiceActorIds,
      isLoveLive: g.isLoveLive,
    };
    return ret;
  });
}

export async function addConcertGroup(
  token: string, title: string, mainEventIds: string[], subEventIds: string[],
): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/concert-group/new`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      title,
      mainEventIds: mainEventIds.filter((e) => e !== ''),
      subEventIds: subEventIds.filter((e) => e !== ''),
    }),
  });
  return ret.status === 200;
}

export async function editConcertGroup(
  token: string, id: string, title: string, mainEventIds: string[], subEventIds: string[],
): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/concert-group/edit`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      id,
      title,
      mainEventIds: mainEventIds.filter((e) => e !== ''),
      subEventIds: subEventIds.filter((e) => e !== ''),
    }),
  });
  return ret.status === 200;
}

export async function deleteConcertGroup(
  token: string, id: string,
): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/concert-group/delete`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      id,
    }),
  });
  return ret.status === 200;
}
