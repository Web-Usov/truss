import { FarmNode, createNode } from "./ModelNode";
import { createForce } from "./ModelForce";
import { consts } from "src/static";
import { Beam } from "./ModelBeam";
import { IFarm, IFixedNodeCreate, IStaticNodeCreate, ISimpleNodeCreate } from "./FarmTypes";

export class FarmFactory {
    static firstPlacement(_nodes: FarmNode[], _beams: Beam[]) : IFarm {

        const nodes = _nodes.map(node => {
            const x = node.x + Math.round((consts.canvasWidth / 3) / consts.UI_cellSize) * consts.MMinCell
            const y = node.y + Math.round((consts.canvasHeight / 3) / consts.UI_cellSize) * consts.MMinCell
            return {
                ...node,
                x,
                y
            }
        })
        const beams = _beams.map(beam => {
            const x = beam.x + Math.round((consts.canvasWidth / 3) / consts.UI_cellSize) * consts.MMinCell
            const y = beam.y + Math.round((consts.canvasHeight / 3) / consts.UI_cellSize) * consts.MMinCell
            return {
                ...beam,
                x,
                y
            }
        })

        return {nodes , beams}
    }
    static createNodes(_fixedNodes: IFixedNodeCreate[], _staticNodes: IStaticNodeCreate[], _nodes: ISimpleNodeCreate[]): FarmNode[] {
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
}