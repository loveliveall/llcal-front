import { voiceActorList, eventCategoryList } from '@/commonData';
import { readLocalStorage } from '@/utils';

import { VACheckState, CategoryCheckState, ETCCheckState } from './types';

export const VA_KEY = 'vaFilter';
export const CATEGORY_KEY = 'catFilter';
export const ETC_KEY = 'etcFilter';

export const VA_FILTER_DEFAULT: VACheckState = {
  ...voiceActorList.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: true,
  }), {}),
  ...readLocalStorage(VA_KEY),
};

export const CATEGORY_FILTER_DEFAULT: CategoryCheckState = {
  ...eventCategoryList.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: true,
  }), {}),
  ...readLocalStorage(CATEGORY_KEY),
};

export const ETC_FILTER_DEFAULT: ETCCheckState = {
  includeRepeating: true,
  showLoveLive: true,
  showNonLoveLive: true,
  ...readLocalStorage(ETC_KEY),
};
