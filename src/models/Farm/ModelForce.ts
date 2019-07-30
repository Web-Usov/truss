import { IEntity, Entity, createEntity } from "./ModelEntity";

export interface IForce extends IEntity {
    value?: number,
    angle?: 0 | 90,
    nodeID?: string
}

export interface Force extends Entity {
    value: number
    angle: 0 | 90
    nodeID: string
}
export const createForce = (props: IForce = {}): Force => {
    const {  angle, nodeID, value } = props
    const entity = createEntity(props)
    const force : Force =  {
        ...entity,
        type:"force",
        angle: angle || 0,
        nodeID: nodeID || "",
        value: value || 0
    }
    return force
}
export const instanceOfForce = (object: any): object is Force => object && object.type === 'force';