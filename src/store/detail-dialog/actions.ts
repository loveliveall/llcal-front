import { createAction } from 'typesafe-actions';
import { ClientEvent } from '@/types';

export const openEventDetailDialog = createAction(
  'detail-dialog/OPEN',
  (event: ClientEvent) => ({ event }),
)();

export const closeEventDetailDialog = createAction(
  'detail-dialog/CLOSE',
)();
