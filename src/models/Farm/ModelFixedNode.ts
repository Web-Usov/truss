import { INode, Node } from "./ModelNode";
import { IBeam } from "./ModelBeam";

export interface IFixedNode extends INode {
    connectedBeam?:IBeam[]
    angle?: 0 | 90 | 180 | 260
}
export class FixedNode extends Node{
    constructor(props:IFixedNode){
        super(props)
    }
}

