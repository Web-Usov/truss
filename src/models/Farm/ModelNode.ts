import { IFarmEntity, ClassFarmEntity } from './ModelEntity';

export interface INode extends IFarmEntity {
    beamsID: number[]
    forcesID: number[],
}

export interface IFixedNode extends INode {
    // connectedBeam:IBeam[]
    // angle: 0 | 90 | 180 | 260
}

export class ClassNode extends ClassFarmEntity implements INode {
    beamsID: number[];
    forcesID: number[];
    constructor(props: IFarmEntity, nodeProps?: INode) {
        super(props)
        this.beamsID = nodeProps ? nodeProps.beamsID : []
        this.forcesID = nodeProps ? nodeProps.forcesID : []
    }

    connectBeam(beamID: number) {
        if (!this.beamsID.find(id => id === beamID))
            this.beamsID.push(beamID)
    }
    deleteBeam(beamID: number) {
        this.beamsID.filter(id => id !== beamID)
    }
    addForce(forceID: number) {
        if (!this.forcesID.find(id => id === forceID))
            this.forcesID.push(forceID)
    }
    deleteForce(forceID: number) {
        this.forcesID.filter(id => id !== forceID)
    }
}