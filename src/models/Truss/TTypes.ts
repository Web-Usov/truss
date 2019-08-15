import TBeam from "./TBeam";
import TForce from "./TForce";
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
    forceX?: TForce,
    forceY?: TForce,
    isStatic?: boolean
    fixation?: NodeFixation
}

export interface ITBeam extends ITEntity {
    startConnectedNode?: TNode
    endConnectedNode?: TNode
    endCoord?: ICoord
    dEndCoord?: ICoord,
    startForce?: number,
    endForce?: number
}

export interface ITForce extends ITEntity {
    value?: number
    angle?: 0 | 90
}

export interface ITruss {
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
export interface TrussCalcData {
    P?: number[][][],
    Vi?: ICoord[],
    LinkNodes?: ICoord[],
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