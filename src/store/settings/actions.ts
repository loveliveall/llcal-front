import { createAction } from 'typesafe-actions';

export const setDayStartHour = createAction(
  'settings/DAY_START_HOUR_SET',
  (hour24h: number) => ({ hour24h }),
)();
