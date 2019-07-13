import { IEntity, Entity } from './ModelEntity';

export interface INode extends IEntity {
    beamsID?: number[]
    forcesID?: number[],
}

export class Node extends Entity {
    beamsID: number[];
    forcesID: number[];
    constructor(props:INode) {
        super(props)
        this.beamsID = props.beamsID || []
        this.forcesID = props.forcesID  || []
    }
    connectBeam(beamID: number):boolean {
        if (!this.beamsID.find(id => id === beamID)){
            this.beamsID.push(beamID)
            return true            
        }
        return false
    }
    removeBeam(beamID: number) {
        
        this.beamsID  = this.beamsID.filter(id => id !== beamID)
    }
    connectForce(forceID: number) {
        if (!this.forcesID.find(id => id === forceID))
            this.forcesID.push(forceID)
    }
    removeForce(forceID: number) {
        this.beamsID   = this.forcesID.filter(id => id !== forceID)
    }
}