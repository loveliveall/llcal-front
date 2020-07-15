import { createReducer, ActionType } from 'typesafe-actions';
import { ClientEvent } from '@/types';
import * as actions from './actions';

interface DetailDialogState {
  open: boolean,
  event: ClientEvent | null,
}

const initialState: DetailDialogState = {
  open: false,
  event: null,
};

export default createReducer<DetailDialogState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeEventDetailDialog, (state) => ({
    open: false,
    event: state.event, // Preserve event state to prevent UI shrink issue
  }))
  .handleAction(actions.openEventDetailDialog, (_, { payload }) => ({
    open: true,
    event: payload.event,
  }));
