import { createAction } from 'typesafe-actions';
import { ClientEvent } from '@/types';

export const openEventDuplicateDialog = createAction(
  'duplicate-dialog/OPEN',
  (event: ClientEvent) => ({ event }),
)();

export const closeEventDuplicateDialog = createAction(
  'duplicate-dialog/CLOSE',
)();
