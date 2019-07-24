import { IEntity, Entity } from "./ModelEntity";

export interface IForce extends IEntity {
    value?: number,
    angle?: 0 | 90,
    nodeID?: number
}

export class Force extends Entity {
    value: number
    angle: 0 | 90
    nodeID: number
    constructor(props: IForce) {
        super(props)
        const { value = 0 , angle = 0, nodeID = 0} = props
        this.value = value
        this.angle = angle
        this.nodeID = nodeID
    }
}