import { createStore, combineReducers } from 'redux';

import authReducer from './auth/reducer';
import deleteDialogReducer from './delete-dialog/reducer';
import detailDialogReducer from './detail-dialog/reducer';
import duplicateDialogReducer from './duplicate-dialog/reducer';
import editDialogReducer from './edit-dialog/reducer';
import concertEditDialogReducer from './concert-edit-dialog/reducer';
import concertDeleteDialogReducer from './concert-delete-dialog/reducer';
import flagsReducer from './flags/reducer';
import settingsReducer from './settings/reducer';
import snackbarReducer from './snackbar/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  deleteDialog: deleteDialogReducer,
  detailDialog: detailDialogReducer,
  duplicateDialog: duplicateDialogReducer,
  editDialog: editDialogReducer,
  concertEditDialog: concertEditDialogReducer,
  concertDeleteDialog: concertDeleteDialogReducer,
  flags: flagsReducer,
  settings: settingsReducer,
  snackbar: snackbarReducer,
});

const TOKEN_KEY = 'usertoken';
export const DAY_START_HOUR_KEY = 'dayStartHour';

const store = createStore(rootReducer, {
  auth: {
    token: localStorage.getItem(TOKEN_KEY),
  },
  settings: {
    dayStartHour: Number(localStorage.getItem(DAY_START_HOUR_KEY) ?? 0),
  },
});

store.subscribe(() => {
  const { token } = store.getState().auth;
  if (token !== null) localStorage.setItem(TOKEN_KEY, token);
  if (token === null) localStorage.removeItem(TOKEN_KEY);
});

export default store;

export type AppState = ReturnType<typeof rootReducer>;
