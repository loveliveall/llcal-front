import { createAction } from 'typesafe-actions';
import { ClientConcertGroup } from '@/types';

export const openConcertDeleteDialog = createAction(
  'concert-delete-dialog/OPEN',
  (concert: ClientConcertGroup) => ({ concert }),
)();

export const closeConcertDeleteDialog = createAction(
  'concert-delete-dialog/CLOSE',
)();
