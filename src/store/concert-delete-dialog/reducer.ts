import { createReducer, ActionType } from 'typesafe-actions';
import { ClientConcertGroup } from '@/types';
import * as actions from './actions';

interface ConcertDeleteDialogState {
  open: boolean,
  concert: ClientConcertGroup | null,
}

const initialState: ConcertDeleteDialogState = {
  open: false,
  concert: null,
};

export default createReducer<ConcertDeleteDialogState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeConcertDeleteDialog, (state) => ({
    open: false,
    concert: state.concert, // Preserve concert state to prevent UI shrink issue
  }))
  .handleAction(actions.openConcertDeleteDialog, (_, { payload }) => ({
    open: true,
    concert: payload.concert,
  }));
