import { FarmActions, SET_TITLE, INC_COUNTER } from "./farmTypes";

export const setTitle = (title :string) : FarmActions => {
    return {
        type:SET_TITLE,
        title
    }
}

export const incCounter = () : FarmActions => {
    return {
        type:INC_COUNTER,
    }
}
