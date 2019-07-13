import { FixedNode } from "./ModelFixedNode";
import { Force } from "./ModelForce";
import { Node } from "./ModelNode";
import { Beam } from "./ModelBeam";




export interface IFarm {
    fixedNodes?: Map<number, FixedNode>
    forces?: Map<number, Force>
    nodes?: Map<number, Node>
    beams?: Map<number, Beam>
}



export class Farm implements IFarm {
    fixedNodes: Map<number, FixedNode>
    forces: Map<number, Force>
    nodes: Map<number, Node>
    beams: Map<number, Beam>
    time: number
    constructor(_farm?: Farm) {
        this.nodes = _farm ? _farm.nodes : new Map()
        this.fixedNodes = _farm ? _farm.fixedNodes : new Map()
        this.forces = _farm ? _farm.forces : new Map()
        this.beams = _farm ? _farm.beams : new Map()
        this.time = Date.now()

    }
    addNode(x: number, y: number, angle: number, name: string = ""): void {
        const node = new Node({
            x,
            y,
            angle,
            name
        })
        this.nodes.set(node.id, node)
    }
    addBeam(x:number, y:number):Beam{
        const beam = new Beam({
            x,
            y
        })
        this.beams.set(beam.id, beam)
        return beam
    }
    deleteNode(nodeID: number): void {
        this.nodes.delete(nodeID)
    }
    deleteBeam(beamID: number): void {
        this.beams.delete(beamID)
    }

    getNode(nodeID: number): Node {
        const node = this.nodes.get(nodeID)
        if (!node) throw Error(`Не найден узел с ID ${nodeID}`)
        return node
    }
    getBeam(beamID: number): Beam {
        const beam = this.beams.get(beamID)
        if (!beam) throw Error(`Не найден луч с ID ${beamID}`)
        return beam
    }
    getForce(forceID: number): Force {
        const force = this.forces.get(forceID)
        if (!force) throw Error(`Не найдена сила с ID ${forceID}`)
        return force
    }
    
    getNodes():Node[]{
        const nodes:Node[] = [];
        for(let node of this.nodes.values()){
            nodes.push(node)
        }
        return nodes
    }
    getBeams():Beam[]{
        const beams :Beam[] = [];
        for(let beam of this.beams.values()){
            beams.push(beam)
        }
        return beams
    }

    getForcesOnNode(nodeID: number): Force[] {
        const forces: Force[] = this.getNode(nodeID).forcesID.map(forceID => this.getForce(forceID))
        return forces
    }
    getBeamsOnNode(nodeID: number): Beam[] {
        const beams: Beam[] = this.getNode(nodeID).beamsID.map(beamID => this.getBeam(beamID))
        return beams
    };
    getNodesOnBeam(beamID: number): Node[] {
        const beam = this.getBeam(beamID)
        const { startConnectedNodeID, endConnectedNodeID } = beam

        const nodeStart = this.getNode(startConnectedNodeID)
        const nodeEnd = this.getNode(endConnectedNodeID)

        return [nodeStart, nodeEnd]
    }

    moveNodeTo(nodeID:number, x:number, y:number):void{
        const node = this.getNode(nodeID)
        node.x = x
        node.y = y
        node.beamsID.forEach(beamID => {
            const beam = this.getBeam(beamID)
            if(beam.startConnectedNodeID === nodeID){
                beam.moveStartPoint(x,y)
            }else if(beam.endConnectedNodeID === nodeID){
                beam.moveEndPoint(x,y)
            }
        })
    }
}