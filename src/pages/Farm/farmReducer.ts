import { SET_TITLE, FarmActions, INC_COUNTER } from "./farmTypes";

export interface IFarmState {
    title: string,
    counter: number,
}

export const defaultFarmState : IFarmState = {
    title: 'Hello, world!',
    counter: 0
}

export const farmReducer = (state: IFarmState = defaultFarmState, action: FarmActions): IFarmState => {
    switch (action.type) {
        case SET_TITLE:
            return {
                ...state,
                title: action.title
            }
        case INC_COUNTER:
            return {
                ...state,
                counter: state.counter + 1
            }
        default:
            return state;
    }
}