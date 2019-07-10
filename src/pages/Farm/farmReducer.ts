import { FarmActions, FARM_UPDATE } from "./farmTypes";
import { ClassFarm } from "src/models/Farm";

export interface IFarmStore {
    workSpace: ClassFarm

}

export const defaultFarmState: IFarmStore = {
    workSpace: new ClassFarm(),
}

export const farmReducer = (state: IFarmStore = defaultFarmState, action: FarmActions): IFarmStore => {
    switch (action.type) {
        case FARM_UPDATE:{
            const newState : IFarmStore = {workSpace:new ClassFarm(action.workSpace)}
            
            return newState

        }
        default:
            return state;
    }
}