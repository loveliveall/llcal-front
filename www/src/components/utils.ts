import { voiceActorList } from '@/commonData';

import { VACheckState } from './types';

export function isGroupChecked(checkState: VACheckState, groupId: number): boolean {
  return voiceActorList.filter((va) => va.groupId === groupId).some((va) => checkState[va.id]);
}

export function isGroupIndeterminate(checkState: VACheckState, groupId: number): boolean {
  const targetVA = voiceActorList.filter((va) => va.groupId === groupId);
  return !targetVA.every((va) => checkState[va.id] === checkState[targetVA[0].id]);
}
