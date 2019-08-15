import { TForce, TNode } from 'src/models/Truss';
import { IFixedNodeCreate, ISimpleNodeCreate, IStaticNodeCreate } from "./TTypes";


export class TrussFactory {
    // static firstPlacement(_nodes: TNode[], _beams: TBeam[]): IFarm {

    //     const nodes = _nodes.map(node => {
    //         const x = node.coord.x + Math.round((canvas.width / 3) / UI.cellSize) * UI.MMinCell
    //         const y = node.coord.y + Math.round((canvas.height / 3) / UI.cellSize) * UI.MMinCell
    //         return {
    //             ...node,
    //             x,
    //             y
    //         }
    //     })
    //     const beams = _beams.map(beam => {
    //         const x = beam.coord.x + Math.round((canvas.width / 3) / UI.cellSize) * UI.MMinCell
    //         const y = beam.coord.y + Math.round((canvas.height / 3) / UI.cellSize) * UI.MMinCell
    //         return {
    //             ...beam,
    //             x,
    //             y
    //         }
    //     })

    //     return { nodes, beams }
    // }
    // static parse(nodesJSON:string, beamsJSON:string):IFarm{
    //     let nodes:TNode[] = JSON.parse(nodesJSON)
    //     let beams:TBeam[] = JSON.parse(beamsJSON)

    //     nodes = nodes.map((node) => {
    //         return {
    //             ...node,
    //             newX:node.x,
    //             newY:node.y,
    //             withNewPosition:false,
    //         }
    //     })
    //     beams = beams.map((beam) => {
    //         return {
    //             ...beam,
    //             withNewPosition:false,
    //         }
    //     })

    //     return {
    //         nodes,
    //         beams
    //     }
    // }
    static createNodes(_fixedNodes: IFixedNodeCreate[] = [], _staticNodes: IStaticNodeCreate[] = [], _nodes: ISimpleNodeCreate[] = []): Map<string, TNode> {
        const nodes: Map<string, TNode> = new Map()
        let index: number = 0;

        _fixedNodes.forEach(n => {
            const _n = new TNode({
                coord: { x: n.x, y: n.y },
                isStatic: true
            })
            nodes.set(_n.id, _n)
        })
        _staticNodes.forEach(n => {
            const _n = new TNode({
                coord: { x: n.x, y: n.y },
                isStatic: true,
                forceX: n.forceX ? new TForce({ value: n.forceX, angle: 0 }) : undefined,
                forceY: n.forceY ? new TForce({ value: n.forceY, angle: 90 }) : undefined,
            })
            nodes.set(_n.id, _n)
        })
        _nodes.forEach(n => {
            const _n = new TNode({
                coord: { x: n.x, y: n.y }
            })
            nodes.set(_n.id, _n)
        })
        return nodes
    }
}

export default TrussFactory