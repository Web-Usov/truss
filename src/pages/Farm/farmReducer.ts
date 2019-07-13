import { FarmActions, FARM_UPDATE } from "./farmTypes";
import { Farm } from "src/models/Farm";

export interface IFarmStore {
    workSpace: Farm

}

export const defaultFarmState: IFarmStore = {
    workSpace: new Farm(),
}

export const farmReducer = (state: IFarmStore = defaultFarmState, action: FarmActions): IFarmStore => {
    switch (action.type) {
        case FARM_UPDATE:{
            const newState : IFarmStore = {workSpace:new Farm(action.workSpace)}
            
            return newState

        }
        default:
            return state;
    }
}