import { createAction } from 'typesafe-actions';
import { ClientEvent } from '@/types';

export const openEventDeleteDialog = createAction(
  'delete-dialog/OPEN',
  (event: ClientEvent) => ({ event }),
)();

export const closeEventDeleteDialog = createAction(
  'delete-dialog/CLOSE',
)();
