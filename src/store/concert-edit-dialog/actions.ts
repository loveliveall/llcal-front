import { createAction } from 'typesafe-actions';
import { ClientConcertGroup } from '@/types';

export const openConcertEditDialog = createAction(
  'concert-edit-dialog/OPEN',
  (concert: ClientConcertGroup | null) => ({ concert }),
)();

export const closeConcertEditDialog = createAction(
  'concert-edit-dialog/CLOSE',
)();
