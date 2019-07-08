import { Action } from "redux";

export const INC_COUNTER = 'INC_COUNTER'


export interface IActionFarmIncCounter extends Action {
    type: typeof INC_COUNTER,
}

export type FarmActions = IActionFarmIncCounter;