import { voiceActorList, eventCategoryList } from '@/commonData';

import { VACheckState, CategoryCheckState } from './types';

export const VA_FILTER_DEFAULT: VACheckState = voiceActorList.reduce((acc, curr) => ({
  ...acc,
  [curr.id]: true,
}), {});

export const CATEGORY_FILTER_DEFAULT: CategoryCheckState = eventCategoryList.reduce((acc, curr) => ({
  ...acc,
  [curr.id]: true,
}), {});
