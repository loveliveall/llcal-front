import { RRule } from 'rrule';
import getDaysInMonth from 'date-fns/getDaysInMonth';
import subDays from 'date-fns/subDays';
import { voiceActorList } from '@/commonData';

import {
  ClientEvent,
  VACheckState,
  CategoryCheckState,
  ETCCheckState,
} from './types';

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

type Obj = { [key in string | number]: any };

export function readLocalStorage(key: string): Obj {
  try {
    const val = localStorage.getItem(key);
    if (val === null) return {};
    return JSON.parse(val);
  } catch (e) {
    return {};
  }
}

export function saveLocalStorage(key: string, value: Obj): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export function filterEvents(
  events: ClientEvent[], vaFilter: VACheckState, categoryFilter: CategoryCheckState,
  etcFilter: ETCCheckState,
): ClientEvent[] {
  return events.filter((ev) => (
    ev.voiceActorIds.some((id) => vaFilter[id]) // VA Filter
    && categoryFilter[ev.categoryId] // Category Filter
    && (etcFilter.includeRepeating || !ev.isRepeating) // Repeating filter
    && ( // isLoveLive filter
      (ev.isLoveLive && etcFilter.showLoveLive)
      || (!ev.isLoveLive && etcFilter.showNonLoveLive)
    )
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
  // * RRULE with format FREQ=MONTHLY;INTERVAL=n;BYDAY=SU;BYMONTHDAY=2,3,4,5,6,7,8 will also be supported (2021.01.02.)
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
      if (params.BYDAY) {
        const byday = params.BYDAY;
        if (params.BYMONTHDAY) {
          // Case of FREQ=MONTHLY;INTERVAL=n;BYDAY=SU;BYMONTHDAY=2,3,4,5,6,7,8
          const weekday = byday as Weekday;
          const monthdays = params.BYMONTHDAY.split(',').map(Number).sort((a, b) => a - b);
          const monthdayStr = (() => {
            // Compressing consecutive numbers to shorter string
            const negative = [];
            const positive = [];
            let str = '';
            let from = monthdays[0];
            let to = from;
            for (let i = 1; i < monthdays.length; i += 1) {
              if (monthdays[i] === to + 1) {
                to = monthdays[i];
              } else {
                if (from < 0) str += '뒤에서 ';
                if (from === to) str += `${Math.abs(from)}일`;
                else str += `${Math.abs(from)}-${Math.abs(to)}일`;

                if (from < 0) negative.push(str);
                else positive.push(str);

                str = '';
                from = monthdays[i];
                to = from;
              }
            }
            if (from < 0) str += '뒤에서 ';
            if (from === to) str += `${Math.abs(from)}일`;
            else str += `${Math.abs(from)}-${Math.abs(to)}일`;

            if (from < 0) negative.push(str);
            else positive.push(str);
            return [...positive, ...negative].join(', ');
          })();
          korStr = `${prefix} ${monthdayStr} 중 ${WEEKDAY_TO_KOR[weekday]}요일`;
        } else {
          // Case of FREQ=MONTHLY;INTERVAL=n;BYDAY=4MO
          const weekday = byday.slice(-2) as Weekday;
          const weeknum = Number(byday.slice(0, byday.length - 2));
          const ordinality = (() => {
            if (weeknum > 0) return `${weeknum}번째`;
            if (weeknum === -1) return '마지막';
            return `끝에서 ${Math.abs(weeknum)}번째`;
          })();
          korStr = `${prefix} ${ordinality} ${WEEKDAY_TO_KOR[weekday]}요일`;
        }
      } else if (params.BYMONTHDAY) {
        korStr = `${prefix} ${params.BYMONTHDAY}일`;
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

export function getNth(date: Date, positive: boolean): number {
  const daysInMonth = getDaysInMonth(date);
  const datePart = date.getDate();
  return positive
    ? Math.floor((datePart - 1) / 7) + 1 // 1-7: 1st, 8-14: 2nd, ...
    : -(Math.floor((daysInMonth - datePart) / 7) + 1); // -1 to -7: -1st, -8 to -14: -2nd, ...
}

const isMidnight = (date: Date) => date.getHours() === 0 && date.getMinutes() === 0;

export function getDateRangeStr(startTime: Date, endTime: Date, allDay: boolean): string {
  const startDateStr = getDateString(startTime);
  const endDateStr = getDateString(subDays(endTime, isMidnight(endTime) ? 1 : 0)); // End at 00:00 means end at previous date's 24:00
  if (allDay) {
    if (startDateStr === endDateStr) return startDateStr;
    return `${startDateStr} - ${endDateStr}`;
  }
  const startTimeStr = `${`0${startTime.getHours()}`.slice(-2)}:${`0${startTime.getMinutes()}`.slice(-2)}`;
  const endTimeStr = isMidnight(endTime) ? '24:00' : (
    `${`0${endTime.getHours()}`.slice(-2)}:${`0${endTime.getMinutes()}`.slice(-2)}`
  );
  if (startTime.getTime() === endTime.getTime()) {
    return `${startDateStr} ${startTimeStr}`;
  }
  if (startDateStr === endDateStr) {
    return `${startDateStr} ${startTimeStr} - ${endTimeStr}`;
  }
  return `${startDateStr} ${startTimeStr} - ${endDateStr} ${endTimeStr}`;
}
