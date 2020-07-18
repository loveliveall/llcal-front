import { createReducer, ActionType } from 'typesafe-actions';
import * as actions from './actions';

interface FlagState {
  refreshFlag: string, // When this changes, the event cache's are discarded
}

const initialState: FlagState = {
  refreshFlag: String(Date.now()),
};

export default createReducer<FlagState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.refreshHash, () => ({
    refreshFlag: String(Date.now()),
  }));
