import TNode from "./TNode";
import TBeam from "./TBeam";
import { ITNode, ITBeam } from "./TTypes";
import { NodeFixation } from "../Farm/ModelNode";
import { observable, computed, action } from "mobx";

class Truss {
    @observable private _nodes: Map<typeof TNode.prototype.id, TNode>
    @observable private _beams: Map<typeof TBeam.prototype.id, TBeam>
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

    // Actions with Beam
    @action public addBeam(props: ITBeam = {}): TBeam {
        if (this._beams.size > 36) throw new Error("Превышено число стержней")
        const beam = new TBeam(props)
        this._beams.set(beam.id, beam)
        return beam
    }

    @action public moveEndBeamWhileDraving(id: string, x: number, y: number): void {
        const beam = this._beams.get(id)
        if (!beam) throw new Error("Не найден стержень")
        if (beam.endConnectedNode) throw new Error("Стержень нельзя переместить - он привязан к узлу")
        beam.moveEndTo(x, y)
    }

    @action public connectBeamToStartNode(beamID:string,nodeID:string){
        const beam = this._beams.get(beamID)
        const node = this._nodes.get(nodeID)
        if(!beam || !node) throw new Error("Не найдены компоненты")
        beam.name = ""+node.name
        beam.connectStartNode(node)
        node.conncetBeam(beam.id)
        return beam
    }
    
    @action public connectBeamToEndNode(beamID:string,nodeID:string){
        const beam = this._beams.get(beamID)
        const node = this._nodes.get(nodeID)
        if(!beam || !node) throw new Error("Не найдены компоненты")
        for(let b of this._beams.values()){
            if(this.findOldBeamByNode(node,beam,b)) throw new Error("Нельзя присоединить")
        }
        beam.name += " - " + node.name
        beam.connectEndNode(node)
        node.conncetBeam(beam.id)
        return beam
    }

    private findOldBeamByNode(node: TNode, beam: TBeam, checkingBeam: TBeam):boolean {
        return (
            (checkingBeam.startConnectedNode === beam.startConnectedNode && checkingBeam.endConnectedNode === node) ||
            (checkingBeam.startConnectedNode === node && checkingBeam.endConnectedNode === beam.startConnectedNode) ||
            (checkingBeam === beam && checkingBeam.startConnectedNode === node)
        )
    }
}
export default new Truss()