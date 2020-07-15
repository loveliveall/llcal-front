import { createStore, combineReducers } from 'redux';

import detailDialogReducer from './detail-dialog/reducer';

const rootReducer = combineReducers({
  detailDialog: detailDialogReducer,
});

export default createStore(rootReducer);

export type AppState = ReturnType<typeof rootReducer>;
