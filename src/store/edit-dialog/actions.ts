import { createAction } from 'typesafe-actions';
import { ClientEvent } from '@/types';

export const openEventEditDialog = createAction(
  'edit-dialog/OPEN',
  (event: ClientEvent | null) => ({ event }),
)();

export const closeEventEditDialog = createAction(
  'edit-dialog/CLOSE',
)();
