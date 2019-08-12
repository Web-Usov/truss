import { canvasWidth, MMinCell } from './../../static/const';
import { FarmNode, NodeFixation, createNode, INode } from "./ModelNode";
import { Beam, IBeam, createBeam, instanceOfBeam } from "./ModelBeam";
import { createForce } from "./ModelForce";
import { Entity } from "./ModelEntity";
import uuid from 'uuid'
import { MyMath } from "src/utils";
import { consts } from 'src/static';




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
    P: number[][][],
    Vi: ICoord[],
    LinkNodes: ICoord[],
}
export class Farm {
    static addNode(nodes: FarmNode[], props: INode): FarmNode | null {
        if (nodes.length > 12) return null
        const {x, y} = props
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
}
export interface FarmCalcProps {
    area?: number,
    modUpr?: number,
    zKoef?: number
}
export class FarmCalc {

    private static farmCalcDebug = process.env.REACT_APP_FARM_CALC_DEBUG === "true" || true
    static async init(_nodes: FarmNode[], _beams: Beam[], props: FarmCalcProps = {}): Promise<CalcData> {
        let farmNodes: FarmNode[] = [..._nodes]
        let farmBeams: Beam[] = [..._beams]
        const farmNodesMap: Map<string, FarmNode> = new Map()
        const farmBeamsMap: Map<string, Beam> = new Map()

        const area: number = props.area || 225 //Площадь стержней
        const ModUpr: number = props.modUpr || 72000 // Модуль упругости 
        const zKoef = props.zKoef || 1

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
                NodeCoord.push({ x: node.x * zKoef, y: node.y * zKoef }) // Z koef
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
                const beamLength = Farm.getBeamLength(beam) * zKoef// Z koef
                LinkLength.push(beamLength)
                Kmest.push(this.Kmest_i(area, ModUpr, beamLength))

                const l_i = this.Lambda_i(NodeCoord[LinkNodes[i].x], NodeCoord[LinkNodes[i].y], LinkLength[i])
                Lambda0.push(l_i)
                Lambda.push([
                    [l_i.x, l_i.y, 0, 0],
                    [0, 0, l_i.x, l_i.y]
                ])
                Kobs.push(this.Kobs_i(area, ModUpr, LinkLength[i], Lambda0[i]))
                IndexV.push(this.IndexV_i(NodeV[LinkNodes[i].x], NodeV[LinkNodes[i].y]))
            })

            const N_Link = LinkNodes.length
            const N_Nodes = NodeV.length
            const N_DOF = Math.max(...NodeV.map(({ x, y }) => Math.max(x, y)))

            K = this.K(N_DOF, IndexV, Kobs)

            Va = this.SquareRoot(K, Forces)
            Vi = this.Vi(NodeV, Va)
            Vij = this.Vij(LinkNodes, Vi)

            for (let i = 0; i < N_Link; i++) {
                V.push(this.V_i(Lambda[i], Vij[i]))
                P.push(this.P_i(Kmest[i], V[i]))
            }

            if (this.farmCalcDebug) {
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

            return { P, LinkNodes, Vi }

        } catch (e) {
            throw new Error(e)
        }
    }

    static Kmest_i(area: number, modUpr: number, length_i: number) {
        const mnoz = (area * modUpr) / length_i
        const result = []
        result.push([mnoz, -mnoz])
        result.push([-mnoz, mnoz])
        return result
    }
    static Lambda_i(nodeCoordOfX: ICoord, nodeCoordOfY: ICoord, length_i: number): ICoord {
        const l_x = (nodeCoordOfY.x - nodeCoordOfX.x) / length_i
        const l_y = (nodeCoordOfY.y - nodeCoordOfX.y) / -length_i
        return { x: l_x, y: l_y }
    }
    static Kobs_i(area: number, modUpr: number, length_i: number, l_i: ICoord) {
        const mnoz = (area * modUpr) / length_i
        const LTxL: ICoord[] = [{ x: l_i.x * l_i.x, y: l_i.x * l_i.y }, { x: l_i.x * l_i.y, y: l_i.y * l_i.y }]
        const _LTxL: ICoord[] = [{ x: -l_i.x * l_i.x, y: -l_i.x * l_i.y }, { x: -l_i.x * l_i.y, y: -l_i.y * l_i.y }]
        const augmnet1 = []
        const augment2 = []
        for (let i = 0; i < 2; i++) {
            augmnet1.push({ x1: LTxL[i].x, y1: LTxL[i].y, x2: _LTxL[i].x, y2: _LTxL[i].y })
            augment2.push({ x1: _LTxL[i].x, y1: _LTxL[i].y, x2: LTxL[i].x, y2: LTxL[i].y })
        }
        const stack: { x1: number, y1: number, x2: number, y2: number }[] = Array.prototype.concat(augmnet1, augment2)
        const result = stack.map(({ x1, y1, x2, y2 }) => ([
            x1 * mnoz,
            y1 * mnoz,
            x2 * mnoz,
            y2 * mnoz
        ]))
        return result

    }
    static IndexV_i(nodeV1: ICoord, nodeV2: ICoord): number[] {
        return [
            nodeV1.x,
            nodeV1.y,
            nodeV2.x,
            nodeV2.y
        ]
    }
    static K(n_dof: number, indexV: number[][], k_obs: number[][][]) {
        const K: number[][] = []

        for (let t = 0; t < n_dof; t++) {
            const row: number[] = []
            for (let r = 0; r < n_dof; r++) {
                row.push(0)
            }
            K.push(row)
        }

        for (let e = 0; e < indexV.length; e++) {
            for (let i = 0; i < 4; i++) {
                const A = indexV[e][i]
                if (A !== 0)
                    for (let j = 0; j < 4; j++) {
                        const B = indexV[e][j]
                        if (B !== 0)
                            K[B - 1][A - 1] = K[B - 1][A - 1] + k_obs[e][i][j]
                    }

            }
        }
        return K
    }
    static SquareRoot(_a: number[][], _b: number[]) {
        if (_a.length !== _b.length) {
            throw Error("SquareRoot - Массивы должны быть одинаковой длины")
        }

        const n = _b.length
        const a: number[][] = []
        const b: number[] = []
        const x: number[] = []
        const d: number[] = []
        const s: number[][] = []
        const y: number[] = []

        for (let i = 0; i < n + 1; i++) {
            const row: number[] = []
            for (let r = 0; r < n; r++) {
                row.push(0)
            }
            s.push(row)
            a.push(row)
            b.push(0)
            x.push(0)
            d.push(0)
            y.push(0)
        }

        for (let j = 1; j <= n; j++) {
            for (let r = 0; r <= n; r++) {
                a[j][r] = _a[j - 1][r - 1]
            }
            b[j] = _b[j - 1]
        }

        d[1] = MyMath.signum(a[1][1]);
        s[1][1] = Math.sqrt(Math.abs(a[1][1]));
        for (let j = 2; j <= n; j++) {
            s[1][j] = a[1][j] / (s[1][1] * d[1]);
        }

        for (let i = 2; i <= n; i++) {
            let sum = 0;
            for (let k = 1; k <= i - 1; k++) {
                sum += s[k][i] * s[k][i] * d[k];
            }
            d[i] = MyMath.signum(a[i][i] - sum);
            s[i][i] = Math.sqrt(Math.abs(a[i][i] - sum));

            const l = 1 / (s[i][i] * d[i]);
            for (let j = i + 1; j <= n; j++) {
                let SDSsum = 0;
                for (let k = 1; k <= i - 1; k++) {
                    SDSsum += s[k][i] * d[k] * s[k][j];
                }
                s[i][j] = l * (a[i][j] - SDSsum);
            }
        }

        y[1] = b[1] / (s[1][1] * d[1]);

        for (let i = 2; i <= n; i++) {
            let sum = 0;

            for (let j = 1; j <= i - 1; j++) {
                sum += s[j][i] * d[j] * y[j];
            }

            y[i] = (b[i] - sum) / (s[i][i] * d[i]);
        }

        x[n] = y[n] / s[n][n];

        for (let i = n - 1; i >= 1; i--) {
            let sum = 0;

            for (let k = i + 1; k <= n; k++) {
                sum += s[i][k] * x[k];
            }

            x[i] = (y[i] - sum) / s[i][i];
        }

        const result: number[] = []
        x.forEach((item, i) => {
            if (i !== 0) result.push(item)
        })

        return result
    }

    static Vi(nodeV: ICoord[], Va: number[]) {
        const vi: ICoord[] = []
        for (let e = 0; e < nodeV.length; e++) {
            const q: ICoord = { ...nodeV[e] }
            q.x = q.x === 0 ? 0 : Va[q.x - 1]
            q.y = q.y === 0 ? 0 : Va[q.y - 1]
            vi.push(q)
        }
        return vi
    }
    static Vij(linkNodes: ICoord[], vi: ICoord[]) {
        const vij: number[][][] = []
        for (let e = 0; e < linkNodes.length; e++) {
            const n_start = linkNodes[e].x
            const n_ends = linkNodes[e].y

            vij.push([
                [vi[n_start].x],
                [vi[n_start].y],
                [vi[n_ends].x],
                [vi[n_ends].y],
            ])
        }
        return vij
    }
    static V_i(l: number[][], vij: number[][]) {
        const v: number[][] = MyMath.multMatrxiV2(l, vij)
        return v
    }
    static P_i(k: number[][], v: number[][]) {
        const p: number[][] = MyMath.multMatrxiV2(k, v)
        return p
    }
}

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