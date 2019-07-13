import { Action } from "redux";
import { Farm } from "src/models/Farm";

export const FARM_UPDATE = 'FARM_UPDATE'

export interface IActionFarmUpdate extends Action {
    type: typeof FARM_UPDATE,
    workSpace:Farm
}

export type FarmActions = IActionFarmUpdate;