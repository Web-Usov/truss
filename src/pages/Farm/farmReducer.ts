import { FarmActions, INC_COUNTER } from "./farmTypes";

export interface IFarmState {
    counter: number,
}

export const defaultFarmState : IFarmState = {
    counter: 0
}

export const farmReducer = (state: IFarmState = defaultFarmState, action: FarmActions): IFarmState => {
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