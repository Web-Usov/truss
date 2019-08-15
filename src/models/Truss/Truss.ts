import { action, computed, observable } from "mobx";
import { NodeFixation } from "../Farm/ModelNode";
import TBeam from "./TBeam";
import { TrussCalc } from './TCalc';
import TNode from "./TNode";
import { ICoord, ITBeam, ITNode, TrussCalcData, TrussCalcProps } from "./TTypes";

class Truss {
    @observable private _nodes: Map<typeof TNode.prototype.id, TNode>
    @observable private _beams: Map<typeof TBeam.prototype.id, TBeam>
    @observable private _calcData: TrussCalcData = {}
    @computed public get nodes() {
        return this._nodes
    }
    @computed public get nodesArray() {
        return Array.from(this._nodes.values())
    }
    @computed public get beams() {
        return this._beams
    }
    @computed public get beamsArray() {
        return Array.from(this._beams.values())
    }
    constructor() {
        this._nodes = new Map()
        this._beams = new Map()

        this.connectBeamToStartNode = this.connectBeamToStartNode.bind(this)
    }
    // Actions with Node
    @action public addNode(props: ITNode = {}): TNode {
        if (this._nodes.size > 12) throw new Error("Превышено число узлов")
        for (let n of this._nodes.values()) {
            if (n.coord === props.coord) throw new Error("На данном месте уже стоит узел")
        }
        const name = (this._nodes.size + 1) + ""
        const node = new TNode({
            ...props,
            name
        })
        this._nodes.set(node.id, node)
        return node
    }
    @action public moveNode(id: string, x: number, y: number): void {
        const node = this._nodes.get(id)
        if (!node) throw new Error("Не найден узел")
        if (node.isStatic || node.fixation !== NodeFixation.None) throw new Error("Данный узел нельзя перемещать")
        for (let n of this._nodes.values()) {
            if (n.coord.x === x && n.coord.y === y) return
        }
        node.moveTo(x, y)
    }
    @action
    public sortNodes(): void {

        const nodes = this.nodesArray.sort((a: TNode, b: TNode) => {
            if (a.coord.y < b.coord.y) return -1
            else if (a.coord.y === b.coord.y) if (a.coord.x < b.coord.x) return -1; else return 1
            else return 1
        })
        console.log(nodes);

        nodes.forEach((n, i) => {
            n.name = (i + 1) + ""
        })
    }

    // Actions with Beam
    @action
    public addBeam(props: ITBeam = {}): TBeam {
        if (this._beams.size > 36) throw new Error("Превышено число стержней")
        const beam = new TBeam(props)
        this._beams.set(beam.id, beam)
        return beam
    }

    @action
    public moveEndBeamWhileDraving(id: string, x: number, y: number): void {
        const beam = this._beams.get(id)
        if (!beam) throw new Error("Не найден стержень")
        if (beam.endConnectedNode) throw new Error("Стержень нельзя переместить - он привязан к узлу")
        beam.moveEndTo(x, y)
    }

    @action
    public connectBeamToStartNode(nodeID: string, beamID: string) {
        const beam = this._beams.get(beamID)
        const node = this._nodes.get(nodeID)
        if (!beam || !node) throw new Error("Не найдены компоненты")
        beam.connectStartNode(node)
        node.conncetBeam(beam.id)
        return beam
    }

    @action
    public connectBeamToEndNode(nodeID: string, beamID: string) {
        const beam = this._beams.get(beamID)
        const node = this._nodes.get(nodeID)
        if (!beam || !node) throw new Error("Не найдены компоненты")
        for (let b of this._beams.values()) {
            if (this._findOldBeamByNode(node, beam, b)) throw new Error("Нельзя присоединить")
        }
        beam.connectEndNode(node)
        node.conncetBeam(beam.id)
        return beam
    }

    private _findOldBeamByNode(node: TNode, beam: TBeam, checkingBeam: TBeam): boolean {
        return (
            (checkingBeam.startConnectedNode === beam.startConnectedNode && checkingBeam.endConnectedNode === node) ||
            (checkingBeam.startConnectedNode === node && checkingBeam.endConnectedNode === beam.startConnectedNode) ||
            (checkingBeam === beam && checkingBeam.startConnectedNode === node)
        )
    }

    // Generals actions
    @action
    public async calculate(props?: TrussCalcProps) {
        const NodeCoord: ICoord[] = []
        const NodeV: ICoord[] = []
        const LinkNodes: ICoord[] = []
        const Forces: number[] = []
        const LinkLength: number[] = []

        this.sortNodes()

        const nodes = [...this.nodesArray]
        const beams = [...this.beamsArray]
        if (nodes.find(node => node.beams.length === 0 && node.isStatic)) throw new Error("Не все узлы соединены")
        let _nodeVindex = 0;
        nodes.forEach((node, i) => {
            NodeCoord.push({ ...node.coord })
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
            LinkLength.push(beam.length)
        })

        const data = await TrussCalc.init(NodeCoord, NodeV, Forces, LinkNodes, LinkLength, props)
        this._calcData = data
    }


    @action
    public delete(id: string) {
        let entity: TBeam | TNode | undefined = undefined
        if (this._beams.has(id)) entity = this._beams.get(id)
        else if (this._nodes.has(id)) entity = this._nodes.get(id)

        if (entity instanceof TNode) {
            if (entity.isStatic) throw new Error("Нельзя удалить этот узел")
            const beamsOfNode = this.beamsArray.filter(item => (entity instanceof TNode && entity.beams.includes(item.id)))
            beamsOfNode.forEach(beam => {
                if (entity instanceof TNode) {
                    let _node: TNode | undefined
                    if (!beam.startConnectedNode || !beam.endConnectedNode) throw new Error()
                    if (beam.startConnectedNode.id === entity.id)
                        _node = this._nodes.get(beam.endConnectedNode.id)
                    else _node = this._nodes.get(beam.startConnectedNode.id)
                    if (_node) _node.removeBeam(beam.id)
                    this._beams.delete(beam.id)
                }
            })
            this._nodes.delete(entity.id)
            // TODO: FARM_UPDATE
            return true
        } else if (entity instanceof TBeam) {
            [entity.startConnectedNode, entity.endConnectedNode].forEach(node => {
                node && entity && node.removeBeam(entity.id)
            })
            this._beams.delete(entity.id)
        }
    }

    @action
    public setNodes(nodes: typeof Truss.prototype.nodes) {
        this._nodes = new Map(nodes)
        this.sortNodes()
    }
}
export default new Truss()