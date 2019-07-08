import { combineReducers } from 'redux';
import { IFarmState, farmReducer } from '../pages/Farm/farmReducer';

export interface AppState {
    farm: IFarmState
}

export const mainReducer = combineReducers({
    farm : farmReducer
})