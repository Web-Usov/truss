import { TNode, TBeam } from 'src/models/Truss';
import { IFixedNodeCreate, ISimpleNodeCreate, IStaticNodeCreate, ITruss, ITNode, ITBeam } from "./TTypes";
import { canvas, UI } from 'src/static/const';


export class TrussFactory {
    static firstPlacement(_nodes: TNode[], _beams: TBeam[]) {
        _nodes.map(node => {
            const x = node.coord.x + Math.round((canvas.width / 3) / UI.cellSize) * UI.MMinCell
            const y = node.coord.y + Math.round((canvas.height / 3) / UI.cellSize) * UI.MMinCell
            node.moveTo(x, y)
        })
    }
    static async parse(nodesJSON: string, beamsJSON: string): Promise<ITruss> {
        const nodes: ITNode[] = await JSON.parse(nodesJSON)
        const beams: ITBeam[] = await JSON.parse(beamsJSON)

        const nodesMap: Map<string, TNode> = new Map()
        const beamsMap: Map<string, TBeam> = new Map()

        await nodes.forEach((n) => {
            n.dCoord = { x: 0, y: 0 }
            const node = new TNode(n)
            nodesMap.set(node.id, node)
        })
        await beams.forEach(b => {
            b.startForce = 0
            b.endForce = 0
            const beam: TBeam = new TBeam(b)
            if (b.startConnectedNode && b.endConnectedNode) {
                beam.connectStartNode(nodesMap.get(b.startConnectedNode.id) as TNode)
                beam.connectEndNode(nodesMap.get(b.endConnectedNode.id) as TNode)
            }
            beamsMap.set(beam.id, beam)
        })
        return { nodes: nodesMap, beams: beamsMap }

    }
    static toString(truss: ITruss) {
        const nodes = Array.from(truss.nodes.values())
        const beams = Array.from(truss.beams.values())

        const nodesJSON = JSON.stringify(nodes).replace(/_/g, '')
        const beamsJSON = JSON.stringify(beams).replace(/_/g, '')

        return { nodesJSON, beamsJSON }
    }
    static createNodes(
        _fixedNodes: IFixedNodeCreate[] = [],
        _staticNodes: IStaticNodeCreate[] = [],
        _nodes: ISimpleNodeCreate[] = []
    ): Map<string, TNode> {
        const nodes: Map<string, TNode> = new Map()

        _fixedNodes.forEach(n => {
            const _n = new TNode({
                coord: { x: n.x, y: n.y },
                isStatic: true,
                fixation: n.fixation
            })
            nodes.set(_n.id, _n)
        })
        _staticNodes.forEach(n => {
            const _n = new TNode({
                coord: { x: n.x, y: n.y },
                isStatic: true,
                forceX: n.forceX || 0,
                forceY: n.forceY || 0,
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