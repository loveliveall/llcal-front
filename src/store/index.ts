import { createStore, combineReducers } from 'redux';

import authReducer from './auth/reducer';
import detailDialogReducer from './detail-dialog/reducer';
import editDialogReducer from './edit-dialog/reducer';
import flagsReducer from './flags/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  detailDialog: detailDialogReducer,
  editDialog: editDialogReducer,
  flags: flagsReducer,
});

const TOKEN_KEY = 'usertoken';

const store = createStore(rootReducer, {
  auth: {
    token: localStorage.getItem(TOKEN_KEY),
  },
});

store.subscribe(() => {
  const { token } = store.getState().auth;
  if (token !== null) localStorage.setItem(TOKEN_KEY, token);
  if (token === null) localStorage.removeItem(TOKEN_KEY);
});

export default store;

export type AppState = ReturnType<typeof rootReducer>;
