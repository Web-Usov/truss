import { FarmNode, NodeFixation, createNode, INode } from "./ModelNode";
import { Beam, IBeam, createBeam, instanceOfBeam } from "./ModelBeam";
import { createForce, Force } from "./ModelForce";
import { Entity } from "./ModelEntity";
import uuid from 'uuid'
import { MyMath } from "src/utils";
import { beam } from "src/static/colors";
import { FarmMath } from "./FarmMath";

const farmCalcDebug = process.env.REACT_APP_FARM_CALC_DEBUG === "true" || false

 
export interface IFarm {
    nodes: FarmNode[],
    beams: Beam[]
}
export interface ICoord {
    x: number,
    y: number
}
interface IFixedNodeCreate extends ICoord {
    fixation: NodeFixation
}
interface IStaticNodeCreate extends ICoord {
    angle: 0 | 90
    value: number
}
interface ISimpleNodeCreate extends ICoord {

}

export interface CalcData {
    P:number[][][],
    LinkNodes?:ICoord[]
}
export class Farm {
    static addNode(nodes: FarmNode[], props: INode): FarmNode | null {
        if (nodes.length > 12) return null
        const oldNode = nodes.find(item => item.x === props.x && item.y === props.y)
        if (oldNode) return null
        const id = uuid()
        if (!id) return null
        const name = (nodes.length + 1) + ""
        const node = createNode({
            ...props,
            name: props.name || name,
            id,
        })
        return node
    }
    static addBeam(beams: Beam[], props: IBeam): Beam | null {
        if (beams.length > 36) return null
        const id = uuid()
        if (!id) return null
        const beam = createBeam({
            ...props,
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
    static sortNodes(nodes: FarmNode[]) {
        return nodes.sort((a: FarmNode, b: FarmNode) => {
            if (a.y < b.y) return -1
            else if (a.y === b.y) if (a.x < b.x) return -1; else return 1
            else return 1
        }).map((node, index) => {
            return { ...node, name: index + 1 + "" }
        })
    }

    static  async calculateFarm(_nodes: FarmNode[], _beams: Beam[], props?: object) : Promise<CalcData> {
        let farmNodes: FarmNode[] = [..._nodes]
        let farmBeams: Beam[] = [..._beams]
        const farmNodesMap: Map<string, FarmNode> = new Map()
        const farmBeamsMap: Map<string, Beam> = new Map()

        const area: number = 225 //Площадь стержней
        const ModUpr: number = 72000 // Модуль упругости 

        const NodeCoord: ICoord[] = []
        const NodeV: ICoord[] = []
        const Forces: number[] = []
        const LinkNodes: ICoord[] = []
        const LinkLength: number[] = []
        const Kmest: number[][][] = [] // Матрица жесткости
        const Lambda0: ICoord[] = []
        const Lambda: number[][][] = []
        const Kobs: number[][][] = []
        const IndexV: number[][] = []
        let K: number[][] = []
        let Va: number[] = []
        let Vi: ICoord[] = []
        let Vij: number[][][] = []
        let V: number[][][] = []
        let P: number[][][] = []

        if (farmNodes.find(node => node.beamsID.length === 0 && node.isStatic)) throw new Error("Не все узлый соединены")
        try {
            let nodeVindex = 0;
            farmNodes.forEach(node => {
                farmNodesMap.set(node.id, node)
                NodeCoord.push({ x: node.x, y: node.y }) // * 10
                switch (node.fixation) {
                    case NodeFixation.X: {
                        nodeVindex++
                        NodeV.push({ x: 0, y: nodeVindex })
                        if (node.forceY) Forces.push(-node.forceY.value)

                        break;
                    }
                    case NodeFixation.Y: {
                        nodeVindex++
                        NodeV.push({ x: nodeVindex, y: 0 })
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
                        nodeVindex++
                        NodeV.push({ x: nodeVindex, y: nodeVindex + 1 })
                        nodeVindex++
                        if (node.forceX) Forces.push(-node.forceX.value)
                        else Forces.push(0)
                        if (node.forceY) Forces.push(-node.forceY.value)
                        else Forces.push(0)
                        break;
                    }
                    default: break;
                }
            })
            farmBeams.forEach((beam, i) => {
                farmBeamsMap.set(beam.id, beam)
                const nums = beam.name.split(' - ')
                LinkNodes.push({
                    x: Number(nums[0]) - 1,
                    y: Number(nums[1]) - 1
                })
                const beamLength = Farm.getBeamLength(beam)// * 10
                LinkLength.push(beamLength)
                Kmest.push(FarmMath.Kmest_i(area, ModUpr, beamLength))

                const l_i = FarmMath.Lambda_i(NodeCoord[LinkNodes[i].x], NodeCoord[LinkNodes[i].y], LinkLength[i])
                Lambda0.push(l_i)
                Lambda.push([
                    [l_i.x, l_i.y, 0, 0],
                    [0, 0, l_i.x, l_i.y]
                ])
                Kobs.push(FarmMath.Kobs_i(area, ModUpr, LinkLength[i], Lambda0[i]))
                IndexV.push(FarmMath.IndexV_i(NodeV[LinkNodes[i].x], NodeV[LinkNodes[i].y]))
            })

            const N_Link = LinkNodes.length
            const N_Nodes = NodeV.length
            const N_DOF = Math.max(...NodeV.map(({ x, y }) => Math.max(x, y)))

            K = FarmMath.K(N_DOF, IndexV, Kobs)

            Va = FarmMath.SquareRoot(K, Forces)
            Vi = FarmMath.Vi(NodeV, Va)
            Vij = FarmMath.Vij(LinkNodes, Vi)

            for (let i = 0; i < N_Link; i++) {
                V.push(FarmMath.V_i(Lambda[i], Vij[i]))
                P.push(FarmMath.P_i(Kmest[i], V[i]))
            }

            if(farmCalcDebug){
                console.log("NodeCoord, LinkNodes, NodeV", NodeCoord, LinkNodes, NodeV);
                console.log("Kobs, Kmest", Kobs, Kmest);
                console.log("Lambda0, Lambda,", Lambda0, Lambda);
                console.log("IndexV", IndexV);
                console.log("N_Link, N_Nodes, N_DOF", N_Link, N_Nodes, N_DOF);
                console.log("K, Force", K, Forces);
                console.log("Va", Va);
                console.log("Vi", Vi);
                console.log("Vij", Vij);
                console.log("V", V);
                console.log("P", P);
            }

            return {P,LinkNodes}

        } catch (e) {
            throw new Error(e)
        }


    }
}