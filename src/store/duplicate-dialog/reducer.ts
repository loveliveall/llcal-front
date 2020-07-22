import { createReducer, ActionType } from 'typesafe-actions';
import { ClientEvent } from '@/types';
import * as actions from './actions';

interface DuplicateDialogState {
  open: boolean,
  event: ClientEvent | null,
}

const initialState: DuplicateDialogState = {
  open: false,
  event: null,
};

export default createReducer<DuplicateDialogState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeEventDuplicateDialog, (state) => ({
    open: false,
    event: state.event, // Preserve event state to prevent UI shrink issue
  }))
  .handleAction(actions.openEventDuplicateDialog, (_, { payload }) => ({
    open: true,
    event: payload.event,
  }));
