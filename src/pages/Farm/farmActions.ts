import { FarmActions, FARM_UPDATE } from "./farmTypes";
import { Farm } from "src/models/Farm";

export const update = (workSpace : Farm) : FarmActions => ({
    type:FARM_UPDATE,
    workSpace
})