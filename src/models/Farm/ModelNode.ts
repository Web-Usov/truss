import { IEntity, Entity, createEntity } from './ModelEntity';
import { Force } from './ModelForce';

export enum NodeFixation {
    None = 0,
    X = 1,
    Y = 2,
    XY = 3,
    YX = XY

}
export interface INode extends IEntity {
    beamsID?: string[]
    forceX?: Force,
    forceY?: Force,
    isStatic?: boolean
    fixation?: NodeFixation
}

export interface FarmNode extends Entity {
    beamsID: string[];
    forceX: Force | undefined
    forceY: Force | undefined
    isStatic: boolean
    fixation: NodeFixation
}

export const createNode = (props: INode = {}): FarmNode => {
    const { beamsID, forceX, forceY, isStatic, fixation: isFixed } = props
    const entity = createEntity(props)
    const node: FarmNode = {
        ...entity,
        type: "node",
        beamsID: beamsID || [],
        forceX: forceX,
        forceY: forceY,
        isStatic: isStatic || false,
        fixation: isFixed || NodeFixation.None
    }
    return node
}
export const instanceOfNode = (object: any): object is FarmNode => object && object.type === 'node'