import FarmCalc from './FarmCalc';
import { FarmNode, createNode, INode, NodeFixation } from "./ModelNode";
import { Beam, IBeam, createBeam, instanceOfBeam } from "./ModelBeam";
import { Entity } from "./ModelEntity";
import uuid from 'uuid'
import { MyMath } from "src/utils";
import { IFarm, ICoord, FarmCalcData, FarmCalcProps } from './FarmTypes';
import { consts } from 'src/static';

export class Farm {
    static addNode(nodes: FarmNode[], props: INode): FarmNode | null {
        if (nodes.length > 12) return null
        const { x, y } = props
        const oldNode = nodes.find(item => item.x === x && item.y === y)
        if (oldNode) return null
        const id = uuid()
        if (!id) return null
        const name = (nodes.length + 1) + ""
        const node = createNode({
            ...props,
            x,
            y,
            name: props.name || name,
            id,
        })
        return node
    }
    static addBeam(beams: Beam[], props: IBeam): Beam | null {
        if (beams.length > 36) return null
        let x = props.x
        let y = props.y
        if (props.x && props.y) {
            x = props.x
            y = props.y
        }
        const id = uuid()
        if (!id) return null
        const beam = createBeam({
            ...props,
            x,
            y,
            id,
        })
        return beam
    }
    static moveEntity(entity: Entity, x: number, y: number) {

        entity.x = x
        entity.y = y
        if (instanceOfBeam(entity)) {
            entity.length = this.getBeamLength(entity)
        }
    }
    static moveBeamEnd(beam: Beam, x: number, y: number) {
        beam.endX = x
        beam.endY = y
        beam.length = this.getBeamLength(beam)
    }

    static findOldBeam(node: FarmNode, beam: Beam, checkingBeam: Beam) {
        return (
            (checkingBeam.startConnectedNodeID === beam.startConnectedNodeID && checkingBeam.endConnectedNodeID === node.id) ||
            (checkingBeam.startConnectedNodeID === node.id && checkingBeam.endConnectedNodeID === beam.startConnectedNodeID) ||
            (checkingBeam.id === beam.id && checkingBeam.startConnectedNodeID === node.id)
        )
    }
    static getBeamLength(beam: Beam): number {
        return Math.round(MyMath.lengthBePoints(beam.x, beam.y, beam.endX, beam.endY) - 0.5)
    }
    static setNodesName(nodes: FarmNode[]) {
        return nodes.map((node, index) => ({ ...node, name: (index + 1) + "" }))
    }
    static setBeamsName(_beams: Beam[], nodes: FarmNode[]): Beam[] {

        const nodesMap: Map<string, FarmNode> = new Map()
        nodes.forEach(node => {
            nodesMap.set(node.id, node)
        })
        let name: string = ""

        let beams = _beams.map(beam => {
            if (!beam.startConnectedNodeID || !beam.endConnectedNodeID) return beam
            const startNode = nodesMap.get(beam.startConnectedNodeID)
            const endNode = nodesMap.get(beam.endConnectedNodeID)
            if (startNode && endNode) {
                if (startNode.name < endNode.name) name = `${startNode.name} - ${endNode.name}`
                else name = `${endNode.name} - ${startNode.name}`

                return {
                    ...beam,
                    name: name
                }
            }
            return beam
        })
            .sort((a: Beam, b: Beam) => {
                const numsA = a.name.split(' - ')
                const numA = Number(numsA[0] + numsA[1])
                const numsB = b.name.split(' - ')
                const numB = Number(numsB[0] + numsB[1])

                return numA > numB ? 1 : -1
            })
        return beams
    }
    static sortNodes(_nodes: FarmNode[]) {
        let nodes = [..._nodes]
        nodes = nodes.sort((a: FarmNode, b: FarmNode) => {
            if (a.y < b.y) return -1
            else if (a.y === b.y) if (a.x < b.x) return -1; else return 1
            else return 1
        })
        nodes = this.setNodesName(nodes)
        return nodes
    }
    static update(_nodes: FarmNode[], _beams: Beam[]): IFarm {
        let nodes = [..._nodes]
        let beams = [..._beams]
        nodes = Farm.setNodesName(nodes)
        beams = Farm.setBeamsName(beams, nodes)
        return { nodes, beams }
    }
    static normalize(_nodes: FarmNode[], _beams: Beam[]): IFarm {
        let nodes = [..._nodes]
        let beams = [..._beams]
        nodes = _nodes.filter(node => (node.beamsID.length !== 0 || node.isStatic))
        nodes = Farm.sortNodes(nodes)
        beams = Farm.setBeamsName(_beams, nodes)
        return {
            nodes,
            beams
        }
    }

    static async calculate(nodes: FarmNode[], beams: Beam[], props?: FarmCalcProps): Promise<FarmCalcData> {
        const NodeCoord: ICoord[] = []
        const NodeV: ICoord[] = []
        const LinkNodes: ICoord[] = []
        const Forces: number[] = []
        const LinkLength: number[] = []
        const _NodeMap: Map<string, FarmNode> = new Map()

        if (nodes.find(node => node.beamsID.length === 0 && node.isStatic)) throw new Error("Не все узлы соединены")
        let _nodeVindex = 0;
        nodes.forEach((node, i) => {
            NodeCoord.push({ x: node.x, y: node.y })
            _NodeMap.set(node.id, node)
            switch (node.fixation) {
                case NodeFixation.X: {
                    _nodeVindex++
                    NodeV.push({ x: 0, y: _nodeVindex })
                    if (node.forceY) Forces.push(-node.forceY.value)

                    break;
                }
                case NodeFixation.Y: {
                    _nodeVindex++
                    NodeV.push({ x: _nodeVindex, y: 0 })
                    if (node.forceX) Forces.push(-node.forceX.value)
                    else Forces.push(0)
                    break;
                }
                case NodeFixation.YX:
                case NodeFixation.XY: {
                    NodeV.push({ x: 0, y: 0 })
                    break;
                }
                case NodeFixation.None: {
                    _nodeVindex++
                    NodeV.push({ x: _nodeVindex, y: _nodeVindex + 1 })
                    _nodeVindex++
                    if (node.forceX) Forces.push(-node.forceX.value)
                    else Forces.push(0)
                    if (node.forceY) Forces.push(-node.forceY.value)
                    else Forces.push(0)
                    break;
                }
                default: break;
            }
        })
        beams.forEach((beam, i) => {
            const nums = beam.name.split(' - ')
            LinkNodes.push({
                x: Number(nums[0]) - 1,
                y: Number(nums[1]) - 1
            })
            LinkLength.push(Farm.getBeamLength(beam))
        })

        const data = await FarmCalc.init(NodeCoord, NodeV, Forces, LinkNodes, LinkLength, props)
        return data
    }

    static correctAfterCalc(nodes: FarmNode[], beams:Beam[], {Vi,P}:FarmCalcData) : IFarm{
        const bufNodeMap: Map<string, FarmNode> = new Map()
        let _nodes = nodes.map((item, i) => {
            const node = {
                ...item,
                newX: Math.round(item.x + (Vi[i].x * consts.UI.koefOfNewPos)),
                newY: Math.round(item.y - (Vi[i].y * consts.UI.koefOfNewPos)),
                withNewPosition: true
            }
            bufNodeMap.set(node.id,node)
            return node
        })
        let _beams = beams.map((beam, i) => {
            const startNode = (bufNodeMap.get(beam.startConnectedNodeID) as FarmNode)
            const endNode = (bufNodeMap.get(beam.endConnectedNodeID) as FarmNode)
            return {
                ...beam,
                newX: startNode.newX,
                newY: startNode.newY,
                newEndX: endNode.newX,
                newEndY: endNode.newY,
                startForce:Math.round(P[i][0][0]),
                endForce:Math.round(P[i][1][0]),
                withNewPosition: true
            }
        })

        return {
            nodes:_nodes,
            beams:_beams
        }
        
    }
}

export default Farm