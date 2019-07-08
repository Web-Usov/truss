import { combineReducers } from 'redux';
import { IFarmState, farmReducer } from '../pages/Farm/farmReducer';
import { IHomeState, homeReducer } from '../pages/Home/homeReducer';

export interface AppState {
    farm: IFarmState,
    home: IHomeState
}

export const mainReducer = combineReducers({
    farm : farmReducer,
    home : homeReducer  
})