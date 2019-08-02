import { IEntity, Entity, createEntity } from "./ModelEntity";

export interface IBeam extends IEntity {
    length?: number
    startConnectedNodeID?: string
    endConnectedNodeID?: string
    endX?: number,
    endY?: number
}

export interface Beam extends Entity {
    length: number
    startConnectedNodeID: string | undefined
    endConnectedNodeID: string | undefined
    endX: number
    endY: number
}
export const createBeam = (props: IBeam = {}): Beam => {
    const { length, startConnectedNodeID, endConnectedNodeID, endX, endY } = props
    const entity = createEntity(props)
    const bram: Beam = {
        ...entity,
        type: "beam",
        length: length || 0,
        startConnectedNodeID: startConnectedNodeID,
        endConnectedNodeID: endConnectedNodeID,
        endX: endX || entity.x || 0,
        endY: endY || entity.y || 0,
    }
    return bram
}


export const instanceOfBeam = (object: any): object is Beam => object && object.type === 'beam';
