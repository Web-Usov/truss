import { FarmNode, NodeFixation, createNode } from "./ModelNode";
import { Beam } from "./ModelBeam";
import { createForce } from "./ModelForce";
import { Entity } from "./ModelEntity";

export interface IFarm {
    nodes: FarmNode[],
    beams: Beam[]
}
interface ICoord {
    x: number,
    y: number
}
interface IFixedNode extends ICoord {
    fixation: NodeFixation
}
interface IStaticNode extends ICoord {
    angle: 0 | 90
    value: number
}
interface INode extends ICoord {

}
export class Farm {
    static moveEntity(entity: Entity, x: number, y: number) {
        entity.x = x
        entity.y = y
    }
    static moveBeamEnd(beam: Beam, x: number, y: number) {
        beam.endX = x
        beam.endY = y
    }
    static createNodes(_fixedNodes: IFixedNode[], _staticNodes: IStaticNode[], _nodes: INode[]): FarmNode[] {
        const nodes: FarmNode[] = []
        let index: number = 0;
        return nodes.concat(
            _fixedNodes.map(item => {
                index++
                return createNode({ ...item, isStatic: true, name: index + "" })
            }),
            _staticNodes.map(item => {
                index++
                const _node = createNode({ ...item, isStatic: true, name: index + "" })
                if (item.angle === 0) _node.forceX = createForce({ nodeID: _node.id, value: item.value, angle: item.angle })
                else _node.forceY = createForce({ nodeID: _node.id, value: item.value, angle: item.angle })
                return _node
            }),
            _nodes.map(item => {
                index++
                return createNode({ ...item, name: index + "" })
            })
        )
    }
    static findOldBeam(node: FarmNode, beam: Beam, checkingBeam: Beam) {
        return (
            (checkingBeam.startConnectedNodeID === beam.startConnectedNodeID && checkingBeam.endConnectedNodeID === node.id) ||
            (checkingBeam.startConnectedNodeID === node.id && checkingBeam.endConnectedNodeID === beam.startConnectedNodeID) ||
            (checkingBeam.id === beam.id && checkingBeam.startConnectedNodeID === node.id)
        )
    }
}