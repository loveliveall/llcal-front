import { createReducer, ActionType } from 'typesafe-actions';
import { ClientEvent } from '@/types';
import * as actions from './actions';

interface DeleteDialogState {
  open: boolean,
  event: ClientEvent | null,
}

const initialState: DeleteDialogState = {
  open: false,
  event: null,
};

export default createReducer<DeleteDialogState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeEventDeleteDialog, (state) => ({
    open: false,
    event: state.event, // Preserve event state to prevent UI shrink issue
  }))
  .handleAction(actions.openEventDeleteDialog, (_, { payload }) => ({
    open: true,
    event: payload.event,
  }));
