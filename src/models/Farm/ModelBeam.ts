import { IEntity, Entity, createEntity } from "./ModelEntity";

export interface IBeam extends IEntity {
    length?: number
    startConnectedNodeID?: string
    endConnectedNodeID?: string
    endX?: number,
    endY?: number,
    newEndX?:number,
    newEndY?:number,
    startForce?:number,
    endForce?:number
}

export interface Beam extends Entity {
    length: number
    startConnectedNodeID: string 
    endConnectedNodeID: string 
    endX: number
    endY: number
    newEndX:number,
    newEndY:number,
    startForce:number,
    endForce:number
}
export const createBeam = (props: IBeam = {}): Beam => {
    const { length, startConnectedNodeID, endConnectedNodeID, endX, endY,newEndX,newEndY,startForce, endForce } = props
    const entity = createEntity(props)
    const bram: Beam = {
        ...entity,
        type: "beam",
        length: length || 0,
        startConnectedNodeID: startConnectedNodeID || "",
        endConnectedNodeID: endConnectedNodeID || "",
        endX: endX || entity.x || 0,
        endY: endY || entity.y || 0,
        newEndX: newEndX || endX || entity.x || 0,
        newEndY: newEndY || endY || entity.y || 0,
        startForce:startForce || 0,
        endForce:endForce || 0,
    }
    return bram
}


export const instanceOfBeam = (object: any): object is Beam => object && object.type === 'beam';
