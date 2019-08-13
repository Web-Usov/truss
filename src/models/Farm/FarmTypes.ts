import { NodeFixation, FarmNode } from "./ModelNode";
import { Beam } from "./ModelBeam";

export interface FarmCalcProps {
    area?: number,
    modUpr?: number,
    zKoef?: number
}
export interface FarmCalcData {
    P: number[][][],
    Vi: ICoord[],
    LinkNodes: ICoord[],
}
export interface ICoord {
    x: number,
    y: number
}
export interface IFarm {
    nodes: FarmNode[],
    beams: Beam[]
}
export interface IFixedNodeCreate extends ICoord {
    fixation: NodeFixation
}
export interface IStaticNodeCreate extends ICoord {
    angle: 0 | 90
    value: number
}
export interface ISimpleNodeCreate extends ICoord {

}