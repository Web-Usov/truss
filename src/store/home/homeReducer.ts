import { SET_TITLE, HomeActions } from "./homeTypes";

export interface IHomeStore {
    title: string,
}

export const defaultHomeState : IHomeStore = {
    title: 'Hello, world!',
}

export const reducer = (state: IHomeStore = defaultHomeState, action: HomeActions): IHomeStore => {
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