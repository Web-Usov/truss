import { INode, ClassNode, IFixedNode } from "./ModelNode";
import { IFarmEntity } from "./ModelEntity";




export interface IBeam extends IFarmEntity {
    length: number
    startConnectedNodeID: number
    endConnectedNodeID: number
}

export interface IForce extends IFarmEntity {
    value: number,
    angle: 0 | 90,
    nodeID: number
}

export interface IFarm {
    fixedNodes: IFixedNode[]
    forces: IForce[]
    nodes: INode[]
    beams: IBeam[]

    addNode(x: number, y: number, angle: number, name?: string): void

    getNode(nodeID: number): INode
    getBeam(beamID: number): IBeam
    getForce(forceID: number): IForce

    getForcesOnNode(nodeID: number): IForce[]
    getBeamsOnNode(nodeID: number): IBeam[]
    getNodesOnBeam(beamID: number): INode[]
}







export class ClassFarm implements IFarm {
    fixedNodes: IFixedNode[];
    forces: IForce[];
    nodes: ClassNode[];
    beams: IBeam[];
    constructor() {
        this.nodes = []
        this.fixedNodes = []
        this.forces = []
        this.beams = []
    }
    addNode(x: number, y: number, angle: number, name: string = "") {
        const node = new ClassNode({
            x,
            y,
            angle,
            name
        })
        this.nodes.push(node)
    }
    deleteNode(nodeID:number){
        this.nodes.filter(node => node.id !== nodeID)
    }

    getNode(nodeID: number) {
        const node = this.nodes.find(node => node.id === nodeID)
        if (!node) throw Error(`Не найден узел с ID ${nodeID}`)
        return node
    }
    getBeam(beamID: number) {
        const beam = this.beams.find(beam => beam.id === beamID)
        if (!beam) throw Error(`Не найден луч с ID ${beamID}`)
        return beam
    }
    getForce(forceID: number) {
        const force = this.forces.find(force => force.id === forceID)
        if (!force) throw Error(`Не найдена сила с ID ${forceID}`)
        return force
    }


    getForcesOnNode(nodeID: number): IForce[] {
        const forces: IForce[] = this.forces.filter(force => force.nodeID === nodeID)
        return forces
    }
    getBeamsOnNode(nodeID: number): IBeam[] {
        const node = this.getNode(nodeID)

        const beams: IBeam[] = this.beams.filter(beam => node.beamsID.find(beamID => beamID === beam.id) !== undefined)
        return beams
    };
    getNodesOnBeam(beamID: number): INode[] {
        const beam = this.getBeam(beamID)
        const { startConnectedNodeID, endConnectedNodeID } = beam

        const nodeStart = this.getNode(startConnectedNodeID)
        const nodeEnd = this.getNode(endConnectedNodeID)

        return [nodeStart, nodeEnd]
    }
}

export {
    ClassNode
}