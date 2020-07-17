import { createReducer, ActionType } from 'typesafe-actions';
import * as actions from './actions';

interface AuthState {
  token: string | null, // Null means not authenticated
}

const initialState: AuthState = {
  token: null,
};

export default createReducer<AuthState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.saveToken, (_, { payload }) => ({
    token: payload.token,
  }))
  .handleAction(actions.clearToken, () => ({
    token: null,
  }));
