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
        this.value = props.value || 0
        this.angle = props.angle || 0
        this.nodeID = props.nodeID || 0
    }
}