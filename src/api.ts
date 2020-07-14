import { RRule } from 'rrule';

import { ClientEvent, ServerEvent } from '@/types';
import { getTimeForClient, getTimestampForServer, getObjWithProp } from '@/utils';

import { birthdayList, eventCategoryList } from '@/commonData';

const API_ENDPOINT = 'https://llcal-back.herokuapp.com/api';

const birthdayEvents: ServerEvent[] = birthdayList.map((birthday, idx) => {
  const dtstart = Date.UTC(2010, birthday.birthMonth - 1, birthday.birthDay);
  return {
    id: String(1000000 + idx),
    title: `${birthday.name} 생일`,
    place: '',
    description: `${birthday.name}의 생일입니다`,
    startTime: dtstart / 1000,
    duration: 1,
    endTime: 4102444800, // 2100-01-01 00:00:00
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
