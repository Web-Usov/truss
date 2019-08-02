import { Action } from "redux";

export const SET_TITLE = 'SET_TITLE'

export interface IActionHomeSetTitle extends Action {
    type: typeof SET_TITLE,
    title : string,
}

export type HomeActions = IActionHomeSetTitle ;