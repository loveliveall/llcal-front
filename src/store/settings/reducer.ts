import { createReducer, ActionType } from 'typesafe-actions';
import * as actions from './actions';

interface SettingsState {
  dayStartHour: number,
}

const initialState: SettingsState = {
  dayStartHour: 0,
};

export default createReducer<SettingsState, ActionType<typeof actions>>(initialState)
  .handleAction(actions.setDayStartHour, (_, { payload }) => ({
    dayStartHour: payload.hour24h,
  }));
