import { voiceActorList } from '@/commonData';

import { VACheckState } from './types';

export const VA_FILTER_DEFAULT: VACheckState = voiceActorList.reduce((acc, curr) => ({
  ...acc,
  [curr.id]: true,
}), {});
