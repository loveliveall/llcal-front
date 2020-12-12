import { createReducer, ActionType } from 'typesafe-actions';
import { ClientConcertGroup } from '@/types';
import * as actions from './actions';

interface ConcertEditDialogState {
  open: boolean,
  concert: ClientConcertGroup | null,
}

const initialState: ConcertEditDialogState = {
  open: false,
  concert: null,
};

export default createReducer<ConcertEditDialogState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeConcertEditDialog, (state) => ({
    open: false,
    concert: state.concert, // Preserve concert state to prevent UI shrink issue
  }))
  .handleAction(actions.openConcertEditDialog, (_, { payload }) => ({
    open: true,
    concert: payload.concert,
  }));
