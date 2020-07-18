import { createReducer, ActionType } from 'typesafe-actions';
import { ClientEvent } from '@/types';
import * as actions from './actions';

interface EditDialogState {
  open: boolean,
  event: ClientEvent | null,
}

const initialState: EditDialogState = {
  open: false,
  event: null,
};

export default createReducer<EditDialogState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeEventEditDialog, (state) => ({
    open: false,
    event: state.event, // Preserve event state to prevent UI shrink issue
  }))
  .handleAction(actions.openEventEditDialog, (_, { payload }) => ({
    open: true,
    event: payload.event,
  }));
