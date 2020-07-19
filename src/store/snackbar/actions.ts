import { createAction } from 'typesafe-actions';

export const openSnackbar = createAction(
  'snackbar/Open',
  (text: string) => ({ text }),
)();

export const closeSnackbar = createAction(
  'snackbar/CLOSE',
)();
