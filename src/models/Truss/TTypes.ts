import TBeam from "./TBeam";
import TNode from "./TNode";


export interface ITEntity {
    id?: string
    coord?: ICoord
    name?: string
    dCoord?: ICoord
    withNewPosition?: boolean
}

export interface ITNode extends ITEntity {
    beamsID?: string[]
    forceX?: number
    forceY?: number,
    isStatic?: boolean,
    fixation?: NodeFixation
}

export interface ITBeam extends ITEntity {
    startConnectedNode?: TNode
    endConnectedNode?: TNode
    endCoord?: ICoord
    startForce?: number,
    endForce?: number
}


export interface ITruss {
    nodes: Map<string, TNode>
    beams: Map<string, TBeam>
}
export interface ITrussArray {
    nodes: TNode[]
    beams: TBeam[]
}

export interface ICoord {
    x: number,
    y: number
}

export enum NodeFixation {
    None = 0,
    X = 1,
    Y = 2,
    XY = 3,
    YX = XY
}

export interface TrussCalcProps {
    area?: number,
    modUpr?: number,
    zKoef?: number
}
export type TrussCalcData = {
    P: number[][][],
    Vi: ICoord[],
    LinkNodes: ICoord[],
    G: number
}

export interface IFixedNodeCreate extends ICoord {
    fixation: NodeFixation
}
export interface IStaticNodeCreate extends ICoord {
    forceX?: number
    forceY?: number
}
export interface ISimpleNodeCreate extends ICoord {

}