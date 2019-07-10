import { Action } from "redux";
import { ClassFarm } from "src/models/Farm";

export const FARM_UPDATE = 'FARM_UPDATE'

export interface IActionFarmUpdate extends Action {
    type: typeof FARM_UPDATE,
    workSpace:ClassFarm
}

export type FarmActions = IActionFarmUpdate;