import { combineReducers, createStore, applyMiddleware } from 'redux';
import { FarmReducer, FarmTypes } from 'src/pages/Farm/store';
import { homeReducer } from 'src/pages/Home/homeReducer';
import thunk, { ThunkMiddleware } from 'redux-thunk'



export const mainReducer = combineReducers({
    farm : FarmReducer.reducer,
    home : homeReducer  
})

export type AppState = ReturnType<typeof mainReducer> 
export type AppActions = FarmTypes.FarmActions 

export default createStore(mainReducer, applyMiddleware(thunk as ThunkMiddleware<AppState,AppActions>));
