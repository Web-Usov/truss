import { IEntity, Entity } from "./ModelEntity";

export interface IBeam extends IEntity {
    length?: number
    startConnectedNodeID?: number
    endConnectedNodeID?: number
    newAngle?:number
}

export class Beam extends Entity {
    length: number
    startConnectedNodeID: number
    endConnectedNodeID: number
    newAngle:number
    constructor(props: IBeam) {
        super(props)
        this.length = props.length || 0
        this.startConnectedNodeID = props.startConnectedNodeID || 0
        this.endConnectedNodeID = props.endConnectedNodeID || 0
        this.newAngle = this.angle
    }

    connectNode(nodeID: number, place: 'start' | 'end'): void {
        place === 'start' ?
            this.startConnectedNodeID = nodeID :
            this.endConnectedNodeID = nodeID
    }
    removeNode(place: 'start' | 'end'): void {
        place === 'start' ?
        this.startConnectedNodeID = 0 :
        this.endConnectedNodeID = 0
    }
}