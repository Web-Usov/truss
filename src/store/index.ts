import { combineReducers, createStore, applyMiddleware } from 'redux';
import { FarmReducer, FarmTypes } from './farm';
import { HomeReducer, HomeTypes } from './home';
import thunk, { ThunkMiddleware } from 'redux-thunk'



export const mainReducer = combineReducers({
    farm : FarmReducer.reducer,
    home : HomeReducer.reducer
})

export type AppState = ReturnType<typeof mainReducer> 
export type AppActions = FarmTypes.FarmActions | HomeTypes.HomeActions

export default createStore(mainReducer, applyMiddleware(thunk as ThunkMiddleware<AppState,AppActions>));
