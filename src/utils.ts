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
