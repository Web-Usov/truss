import { FarmActions, INC_COUNTER } from "./farmTypes";


export const incCounter = () : FarmActions => {
    return {
        type:INC_COUNTER,
    }
}
