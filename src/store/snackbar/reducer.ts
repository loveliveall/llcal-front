import { createReducer, ActionType } from 'typesafe-actions';
import * as actions from './actions';

interface SnackbarState {
  open: boolean,
  text: string,
}

const initialState: SnackbarState = {
  open: false,
  text: '',
};

export default createReducer<SnackbarState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.closeSnackbar, (state) => ({
    open: false,
    text: state.text, // Preserve event state to prevent UI shrink issue
  }))
  .handleAction(actions.openSnackbar, (_, { payload }) => ({
    open: true,
    text: payload.text,
  }));
