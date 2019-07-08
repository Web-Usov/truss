import { Action } from "redux";

export const SET_TITLE = 'SET_TITLE'
export const INC_COUNTER = 'INC_COUNTER'

export interface IActionFarmSetTitle extends Action {
    type: typeof SET_TITLE,
    title : string,
}

export interface IActionFarmIncCounter extends Action {
    type: typeof INC_COUNTER,
}

export type FarmActions = IActionFarmSetTitle | IActionFarmIncCounter;