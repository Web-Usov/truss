import { FarmActions, INC_COUNTER } from "./farmTypes";

export interface IFarmStore {
    counter: number,
}

export const defaultFarmState : IFarmStore = {
    counter: 0
}

export const farmReducer = (state: IFarmStore = defaultFarmState, action: FarmActions): IFarmStore => {
    switch (action.type) {
        case INC_COUNTER:
            return {
                ...state,
                counter: state.counter + 1
            }
        default:
            return state;
    }
}