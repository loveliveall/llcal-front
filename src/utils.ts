import { RRule } from 'rrule';
import { voiceActorList } from '@/commonData';

import { VACheckState, ClientEvent } from './types';

export function isGroupChecked(checkState: VACheckState, groupId: number): boolean {
  return voiceActorList.filter((va) => va.groupId === groupId).some((va) => checkState[va.id]);
}

export function isGroupIndeterminate(checkState: VACheckState, groupId: number): boolean {
  const targetVA = voiceActorList.filter((va) => va.groupId === groupId);
  return !targetVA.every((va) => checkState[va.id] === checkState[targetVA[0].id]);
}

export function isAllChecked(checkState: VACheckState): boolean {
  return voiceActorList.some((va) => checkState[va.id]);
}

export function isAllIndeterminate(checkState: VACheckState): boolean {
  return !voiceActorList.every((va) => checkState[va.id] === checkState[voiceActorList[0].id]);
}

export function filterEvents(events: ClientEvent[], vaFilter: VACheckState): ClientEvent[] {
  return events.filter((ev) => (
    ev.voiceActorIds.some((id) => vaFilter[id])
  ));
}

export function getDateString(targetDate: Date): string {
  const year = `000${targetDate.getFullYear()}`.slice(-4);
  const month = `0${targetDate.getMonth() + 1}`.slice(-2);
  const date = `0${targetDate.getDate()}`.slice(-2);
  return `${year}.${month}.${date}.`;
}

export function getObjWithProp<T, K extends keyof T>(objList: T[], key: K, value: T[K]): T | undefined {
  return objList.find((elem) => elem[key] === value);
}

export function getTimestampForServer(date: Date): number {
  return Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date.getHours(), date.getMinutes(), 0,
  ) / 1000;
}

export function getTimeForClient(timestamp: number): Date {
  const date = new Date(timestamp * 1000);
  return new Date(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), 0,
  );
}

type Weekday = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
const WEEKDAY_TO_KOR = {
  SU: '일', MO: '월', TU: '화', WE: '수', TH: '목', FR: '금', SA: '토',
};
const WEEKDAY_TO_NUM = {
  SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6,
};

export function rruleToText(start: Date, rrule: string): string {
  // This function can only parse the RRule supported in Google Calendar
  // i.e., (FREQ=YEARLY;INTERVAL=n / FREQ=MONTHLY;INTERVAL=n;BYMONTHDAY=22
  // FREQ=MONTHLY;INTERVAL=n;BYDAY=4MO / FREQ=WEEKLY;INTERVAL=n;BYDAY=MO,WE
  // FREQ=DAILY;INTERVAL=n) with UNTIL=DATE or COUNT=n
  // `start` from local, `rrule` from server, which means,
  // `start` value could be used as-is, and UTC value of `rrule` should be used.
  const match = /^RRULE:(.*)$/m.exec(rrule);
  let korStr = '';
  if (match) {
    // Setting base string
    const params = match[1].split(';').reduce((acc, curr) => {
      const pair = curr.split('=');
      acc[pair[0]] = pair[1]; // eslint-disable-line prefer-destructuring
      return acc;
    }, {} as { [key: string]: string, });
    const interval = Number(params.INTERVAL);
    const isMultiInterval = interval && interval !== 1;

    if (params.FREQ === 'YEARLY') {
      const dateStr = `${start.getMonth() + 1}월 ${start.getDate()}일`;
      const prefix = isMultiInterval ? `${interval}년마다` : '매년';
      korStr = `${prefix} ${dateStr}`;
    } else if (params.FREQ === 'MONTHLY') {
      const prefix = isMultiInterval ? `${interval}월마다` : '매월';
      if (params.BYMONTHDAY) {
        korStr = `${prefix} ${params.BYMONTHDAY}일`;
      } else if (params.BYDAY) {
        const byday = params.BYDAY;
        const weekday = byday.slice(-2) as Weekday;
        const weeknum = Number(byday.slice(0, byday.length - 2));
        korStr = `${prefix} ${weeknum}번째 ${WEEKDAY_TO_KOR[weekday]}요일`;
      }
    } else if (params.FREQ === 'WEEKLY') {
      const prefix = isMultiInterval ? `${interval}주마다` : '매주';
      const sortedDayList = params.BYDAY.split(',').sort(
        (a, b) => WEEKDAY_TO_NUM[a as Weekday] - WEEKDAY_TO_NUM[b as Weekday],
      ) as Weekday[];
      // Handle special weekday combination cases
      const weekdaysStr = sortedDayList.toString();
      if (weekdaysStr === ['MO', 'TU', 'WE', 'TH', 'FR'].toString()) {
        korStr = `${prefix} 주중`;
      } else if (weekdaysStr === ['SU', 'SA'].toString()) {
        korStr = `${prefix} 주말`;
      } else if (weekdaysStr === ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].toString()) {
        korStr = `${prefix} 모든 요일`;
      } else {
        // Fallback
        korStr = `${prefix} ${sortedDayList.map((v) => WEEKDAY_TO_KOR[v]).join(', ')}요일`;
      }
    } else if (params.FREQ === 'DAILY') {
      korStr = isMultiInterval ? `${interval}일마다` : '매일';
    }

    // Add ending condition text
    if (params.COUNT) {
      korStr += `, ${params.COUNT}회 반복`;
    } else if (params.UNTIL) {
      const { until } = RRule.parseString(rrule);
      if (until !== null && until !== undefined) {
        const untilStr = `${until.getUTCFullYear()}년 ${until.getUTCMonth() + 1}월 ${until.getUTCDate()}일`;
        korStr += `, 종료일: ${untilStr}`;
      }
    }
  }
  return korStr;
}
