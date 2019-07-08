import { SET_TITLE, HomeActions } from "./homeTypes";

export interface IHomeState {
    title: string,
}

export const defaultHomeState : IHomeState = {
    title: 'Hello, world!',
}

export const homeReducer = (state: IHomeState = defaultHomeState, action: HomeActions): IHomeState => {
    switch (action.type) {
        case SET_TITLE:
            return {
                ...state,
                title: action.title
            }
        default:
            return state;
    }
}