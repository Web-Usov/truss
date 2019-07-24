import { IEntity, Entity } from './ModelEntity';
import { Force } from './ModelForce';

export interface INode extends IEntity {
    beamsID?: number[]
    forceX?:Force,
    forceY?:Force,
    isStatic?: boolean
}

export class Node extends Entity {
    beamsID: number[];
    forceX:Force | undefined
    forceY:Force | undefined
    isStatic:boolean
    
    constructor(props:INode) {
        super(props)
        this.beamsID = props.beamsID || []
        this.forceX = props.forceX
        this.forceY = props.forceY
        this.isStatic = props.isStatic || false
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
}