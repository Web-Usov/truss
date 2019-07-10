import { FarmActions, FARM_UPDATE } from "./farmTypes";
import { ClassFarm } from "src/models/Farm";

export const update = (workSpace : ClassFarm) : FarmActions => ({
    type:FARM_UPDATE,
    workSpace
})