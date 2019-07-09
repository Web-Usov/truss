import { combineReducers, createStore } from 'redux';
import { IFarmStore, farmReducer } from 'src/pages/Farm/farmReducer';
import { IHomeState, homeReducer } from 'src/pages/Home/homeReducer';

export interface AppState {
    farm: IFarmStore,
    home: IHomeState
}

export const mainReducer = combineReducers({
    farm : farmReducer,
    home : homeReducer  
})

export default createStore(mainReducer);
