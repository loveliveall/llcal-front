import { createAction } from 'typesafe-actions';

export const saveToken = createAction(
  'auth/TOKEN_SAVE',
  (token: string) => ({ token }),
)();

export const clearToken = createAction(
  'auth/TOKEN_CLEAR',
)();
