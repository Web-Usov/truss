import { IEntity, Entity, createEntity } from './ModelEntity';
import { Force } from './ModelForce';

export interface INode extends IEntity {
    beamsID?: string[]
    forceX?: Force,
    forceY?: Force,
    isStatic?: boolean
    isFixed?: false | 'x' | 'y' | 'xy'
}

export interface FarmNode extends Entity {
    beamsID: string[];
    forceX: Force | undefined
    forceY: Force | undefined
    isStatic: boolean
    isFixed: false | 'x' | 'y' | 'xy'
}

export const createNode = (props: INode = {}): FarmNode => {
    const { beamsID, forceX, forceY, isStatic, isFixed } = props
    const entity = createEntity(props)
    const node: FarmNode = {
        ...entity,
        type: "node",
        beamsID: beamsID || [],
        forceX: forceX,
        forceY: forceY,
        isStatic: isStatic || false,
        isFixed: isFixed || false
    }
    return node
}
export const instanceOfNode = (object: any): object is FarmNode => object && object.type === 'node'