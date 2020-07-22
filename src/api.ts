import { RRule } from 'rrule';
import endOfDay from 'date-fns/endOfDay';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';

import { ClientEvent, ServerEvent } from '@/types';
import { getTimeForClient, getTimestampForServer, getObjWithProp } from '@/utils';

import { birthdayList, eventCategoryList } from '@/commonData';

const API_ENDPOINT = 'https://llcal-back.herokuapp.com/api';

const INFINITE_END_TS = 4102444800; // 2100-01-01 00:00:00

const birthdayEvents: ServerEvent[] = birthdayList.map((birthday, idx) => {
  const dtstart = Date.UTC(2010, birthday.birthMonth - 1, birthday.birthDay);
  return {
    id: String(1000000 + idx),
    title: `${birthday.name} 생일`,
    place: '',
    description: `${birthday.name}의 생일입니다`,
    startTime: dtstart / 1000,
    duration: 1,
    endTime: INFINITE_END_TS,
    isAllDay: true,
    rrule: new RRule({
      freq: RRule.YEARLY,
      dtstart: new Date(dtstart),
    }).toString(),
    exceptionOffsets: [],
    categoryId: 10000, // Category for birthday
    voiceActorIds: [birthday.voiceActorId],
    isLoveLive: birthday.isLoveLive,
    isRepeating: true,
  };
});

export async function callGetEvents(from: Date, to: Date): Promise<ClientEvent[]> {
  const fromTs = getTimestampForServer(from);
  const toTs = getTimestampForServer(to);
  const res = await fetch(`${API_ENDPOINT}/events?from=${fromTs}&to=${toTs}`);
  const events: ServerEvent[] = await res.json();

  // Map server events to client events
  const eventsInRange = [...events, ...birthdayEvents].filter((e) => (
    e.startTime <= toTs && e.endTime >= fromTs
  )).reduce((acc, curr) => {
    const colorCode = getObjWithProp(eventCategoryList, 'id', curr.categoryId)?.colorHex ?? '#ffa400';
    const eventStart = getTimeForClient(curr.startTime);
    if (curr.rrule) {
      const rruleFrom = new Date((fromTs - curr.duration) * 1000);
      const rruleTo = new Date(toTs * 1000);
      const options = RRule.parseString(curr.rrule);
      const rr = new RRule({
        ...options,
        dtstart: new Date(curr.startTime * 1000),
      });
      const instances = rr.between(rruleFrom, rruleTo, true);
      return acc.concat(instances.filter((d) => (
        !curr.exceptionOffsets.includes((d.getTime() / 1000) - curr.startTime)
      )).map((d) => {
        const entityStart = new Date(
          d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
          d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
        );
        const entityEnd = new Date(entityStart.getTime() + curr.duration * 1000);
        return {
          id: `${curr.id}-${entityStart.getTime() / 1000}`,
          serverId: curr.id,
          title: curr.title,
          place: curr.place,
          description: curr.description,
          startTime: entityStart,
          endTime: entityEnd,
          allDay: curr.isAllDay,
          rrule: curr.rrule,
          categoryId: curr.categoryId,
          voiceActorIds: curr.voiceActorIds,
          isLoveLive: curr.isLoveLive,
          isRepeating: curr.isRepeating,
          dtstart: eventStart,
          colorCode,
        };
      }));
    }
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
    }]);
  }, [] as ClientEvent[]);
  return eventsInRange;
}

export async function tryLogin(id: string, token: string): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/login`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      cred: token,
    }),
  });
  return ret.status === 200;
}

function convertToServerInfo(start: Date, end: Date, allDay: boolean, rrule: string) {
  const startTs = getTimestampForServer(allDay ? startOfDay(start) : start);
  const endTs = getTimestampForServer(allDay ? endOfDay(end) : end);
  const duration = endTs - startTs;
  const rangeEndTs = (() => {
    if (rrule !== '') {
      const options = RRule.parseString(rrule);
      if (options.until === undefined && options.count === undefined) return INFINITE_END_TS;
      const rr = new RRule({
        ...options,
        dtstart: new Date(startTs * 1000),
      });
      const instances = rr.all();
      return instances[instances.length - 1].getTime() / 1000 + duration;
    }
    return endTs;
  })();
  return {
    startTs,
    duration,
    rangeEndTs,
  };
}

function getHeader(token: string) {
  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
}

export async function duplicateEvent(token: string, id: string, keepExceptions: boolean): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/events/duplicate`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      id,
      keepExceptions,
    }),
  });
  return ret.status === 200;
}

export async function addNewEvent(
  token: string,
  title: string, place: string, description: string, start: Date, end: Date, allDay: boolean,
  rrule: string, categoryId: number, voiceActorIds: number[], isLoveLive: boolean, isRepeating: boolean,
): Promise<boolean> {
  // Convert dates for server
  const { startTs, duration, rangeEndTs } = convertToServerInfo(start, end, allDay, rrule);
  const ret = await fetch(`${API_ENDPOINT}/events/new`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      title,
      place,
      description,
      startTime: startTs,
      duration,
      endTime: rangeEndTs,
      isAllDay: allDay,
      rrule,
      categoryId,
      voiceActorIds,
      isLoveLive,
      isRepeating,
    }),
  });
  return ret.status === 200;
}

export async function editNonRepeatEvent(
  token: string,
  id: string, title: string, place: string, description: string, start: Date, end: Date, allDay: boolean,
  rrule: string, categoryId: number, voiceActorIds: number[], isLoveLive: boolean, isRepeating: boolean,
): Promise<boolean> {
  const { startTs, duration, rangeEndTs } = convertToServerInfo(start, end, allDay, rrule);
  const ret = await fetch(`${API_ENDPOINT}/event/edit`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      editRange: 'non-repeat',
      updateEvent: {
        id,
        title,
        place,
        description,
        startTime: startTs,
        duration,
        endTime: rangeEndTs,
        isAllDay: allDay,
        rrule,
        categoryId,
        voiceActorIds,
        isLoveLive,
        isRepeating,
      },
    }),
  });
  return ret.status === 200;
}

export async function editRepeatEventOnlyThis(
  token: string, origStart: Date,
  id: string, title: string, place: string, description: string, start: Date, end: Date, allDay: boolean,
  categoryId: number, voiceActorIds: number[], isLoveLive: boolean, isRepeating: boolean,
): Promise<boolean> {
  const { startTs, duration, rangeEndTs } = convertToServerInfo(start, end, allDay, '');
  const origStartTs = getTimestampForServer(origStart);
  const ret = await fetch(`${API_ENDPOINT}/event/edit`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      editRange: 'this',
      updateEvent: {
        id,
        exceptionTime: origStartTs,
      },
      newEvent: {
        title,
        place,
        description,
        startTime: startTs,
        duration,
        endTime: rangeEndTs,
        isAllDay: allDay,
        categoryId,
        voiceActorIds,
        isLoveLive,
        isRepeating,
      },
    }),
  });
  return ret.status === 200;
}

export async function editRepeatEventAfter(
  token: string, origDtStart: Date, origRRule: string, origDuration: number,
  id: string, title: string, place: string, description: string, start: Date, end: Date, allDay: boolean,
  rrule: string, categoryId: number, voiceActorIds: number[], isLoveLive: boolean, isRepeating: boolean,
): Promise<boolean> {
  // Edit rrule of original event and Add new event
  // First, calculate new rrule of original event
  // New end of original event's rrule is one day before current start (since we have at least day frequency)
  const oneDayBeforeStart = subDays(start, 1);
  const modifiedRRuleUntil = new Date(
    Date.UTC(
      oneDayBeforeStart.getFullYear(), oneDayBeforeStart.getMonth(), oneDayBeforeStart.getDate(), 23, 59, 0,
    ),
  );
  const origRRuleOpts = RRule.parseString(origRRule);
  origRRuleOpts.count = undefined;
  origRRuleOpts.until = modifiedRRuleUntil;
  const origDtStartTs = getTimestampForServer(origDtStart);
  const rr = new RRule({
    ...origRRuleOpts,
    dtstart: new Date(origDtStartTs * 1000),
  });
  const instances = rr.all();
  const modifiedRangeEndTs = instances[instances.length - 1].getTime() / 1000 + origDuration;
  const modifiedRRule = RRule.optionsToString(origRRuleOpts);
  const { startTs, duration, rangeEndTs } = convertToServerInfo(start, end, allDay, rrule);
  const ret = await fetch(`${API_ENDPOINT}/event/edit`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      editRange: 'after',
      updateEvent: {
        id,
        modifiedEndTime: modifiedRangeEndTs,
        modifiedRRule,
      },
      newEvent: {
        title,
        place,
        description,
        startTime: startTs,
        duration,
        endTime: rangeEndTs,
        isAllDay: allDay,
        rrule,
        categoryId,
        voiceActorIds,
        isLoveLive,
        isRepeating,
      },
    }),
  });
  return ret.status === 200;
}

export async function editRepeatEventAll(
  token: string, origStart: Date, origDtStart: Date,
  id: string, title: string, place: string, description: string, start: Date, end: Date, allDay: boolean,
  rrule: string, categoryId: number, voiceActorIds: number[], isLoveLive: boolean, isRepeating: boolean,
): Promise<boolean> {
  const startOffset = start.getTime() - origStart.getTime();
  const newDtStart = new Date(origDtStart.getTime() + startOffset);
  const newDtStartTs = getTimestampForServer(newDtStart);
  const duration = (end.getTime() - start.getTime()) / 1000;
  const rangeEndTs = (() => {
    if (rrule !== '') {
      const options = RRule.parseString(rrule);
      if (options.until === undefined && options.count === undefined) return INFINITE_END_TS;
      const rr = new RRule({
        ...options,
        dtstart: new Date(newDtStartTs * 1000),
      });
      const instances = rr.all();
      return instances[instances.length - 1].getTime() / 1000 + duration;
    }
    return getTimestampForServer(end); // This case will not happen, but for defensive coding & satisfy eslint
  })();
  const ret = await fetch(`${API_ENDPOINT}/event/edit`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      editRange: 'all',
      updateEvent: {
        id,
        title,
        place,
        description,
        startTime: newDtStartTs,
        duration,
        endTime: rangeEndTs,
        isAllDay: allDay,
        rrule,
        categoryId,
        voiceActorIds,
        isLoveLive,
        isRepeating,
      },
    }),
  });
  return ret.status === 200;
}

export async function deleteEventAll(
  token: string, id: string,
): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/event/delete`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      deleteRange: 'all',
      deleteEvent: {
        id,
      },
    }),
  });
  return ret.status === 200;
}

export async function deleteEventOnlyThis(
  token: string, id: string, deleteOffset: number,
): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/event/delete`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      deleteRange: 'this',
      updateEvent: {
        id,
        exceptionOffset: deleteOffset,
      },
    }),
  });
  return ret.status === 200;
}

export async function deleteEventAfter(
  token: string, id: string, targetStart: Date, targetRRule: string, targetDtStart: Date, targetDuration: number,
): Promise<boolean> {
  // Edit rrule of original event
  // New end of original event's rrule is one day before current start (since we have at least day frequency)
  const oneDayBeforeStart = subDays(targetStart, 1);
  const modifiedRRuleUntil = new Date(
    Date.UTC(
      oneDayBeforeStart.getFullYear(), oneDayBeforeStart.getMonth(), oneDayBeforeStart.getDate(), 23, 59, 0,
    ),
  );
  const targetRRuleOpts = RRule.parseString(targetRRule);
  targetRRuleOpts.count = undefined;
  targetRRuleOpts.until = modifiedRRuleUntil;
  const targetDtStartTs = getTimestampForServer(targetDtStart);
  const rr = new RRule({
    ...targetRRuleOpts,
    dtstart: new Date(targetDtStartTs * 1000),
  });
  const instances = rr.all();
  const modifiedRangeEndTs = instances[instances.length - 1].getTime() / 1000 + targetDuration;
  const modifiedRRule = RRule.optionsToString(targetRRuleOpts);
  const ret = await fetch(`${API_ENDPOINT}/event/delete`, {
    method: 'POST',
    cache: 'no-cache',
    headers: getHeader(token),
    body: JSON.stringify({
      deleteRange: 'after',
      updateEvent: {
        id,
        endTime: modifiedRangeEndTs,
        rrule: modifiedRRule,
      },
    }),
  });
  return ret.status === 200;
}

export async function sendReport(report: string): Promise<boolean> {
  const ret = await fetch(`${API_ENDPOINT}/report`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: report,
    }),
  });
  return ret.status === 200;
}
