import { FixedNode } from "./ModelFixedNode";
import { Force } from "./ModelForce";
import { Node } from "./ModelNode";
import { Beam } from "./ModelBeam";
import { Entity } from "./ModelEntity";




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
    addNode(x: number, y: number, angle: number, name: string = ""): boolean {
        const oldNode = this.getNodes().find(item => item.x === x && item.y === y)
        if(oldNode) return false
        const node = new Node({
            x,
            y,
            angle,
            name
        })
        this.nodes.set(node.id, node)
        return true
    }
    addBeam(x: number, y: number): Beam {
        const beam = new Beam({
            x,
            y
        })
        this.beams.set(beam.id, beam)
        return beam
    }
    private deleteNode(nodeID: number): void {
        this.nodes.delete(nodeID)
    }
    private deleteBeam(beamID: number): void {
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

    getNodes(): Node[] {
        const nodes: Node[] = [];
        for (let node of this.nodes.values()) {
            nodes.push(node)
        }
        return nodes
    }
    getBeams(): Beam[] {
        const beams: Beam[] = [];
        for (let beam of this.beams.values()) {
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

    connectBeamToNode(beam: Beam | number, node: Node | number, place: 'start' | 'end' = 'start'): boolean {
        let _beam: Beam = beam instanceof Beam ? beam : this.getBeam(beam)
        let _node: Node = node instanceof Node ? node : this.getNode(node)

        switch (place) {
            case 'start': {

                _beam.connectNode(_node.id, 'start')
                _node.connectBeam(_beam.id)
                break;
            }
            case 'end': {
                const beams = this.getBeamsOnNode(_beam.startConnectedNodeID)
                const oldBeam = beams.find(item =>
                    item.startConnectedNodeID === _beam.startConnectedNodeID && item.endConnectedNodeID === _node.id ||
                    item.startConnectedNodeID === _node.id && item.endConnectedNodeID === _beam.startConnectedNodeID ||
                    item.id === _beam.id && item.endConnectedNodeID === _beam.id
                )



                if (!oldBeam && _node.connectBeam(_beam.id)) {
                    _beam.moveEndPoint(_node.x, _node.y)
                    _beam.connectNode(_node.id, "end")
                } else return false
                break;
            }
            default: return false
        }

        return true
    }
    deleteEntity(entity: Entity | number) {
        if (entity instanceof Node) {
            // const beams = this.getBeamsOnNode(entity.id)
            const beams = entity.beamsID.map(beamID => this.getBeam(beamID))
            beams.forEach(beam => {
                if (beam.startConnectedNodeID === entity.id) this.getNode(beam.endConnectedNodeID).removeBeam(beam.id)
                else this.getNode(beam.startConnectedNodeID).removeBeam(beam.id)
                this.deleteBeam(beam.id)
            })
            this.deleteNode(entity.id)
        } else if (entity instanceof Beam) {
            [entity.startConnectedNodeID,entity.endConnectedNodeID].forEach(nodeID => {
                if(nodeID > 0){
                    this.getNode(nodeID).removeBeam(entity.id)
                }
            })
            this.deleteBeam(entity.id)
        } else if(entity instanceof Entity){
            const _entity = this.nodes.get(entity.id) || this.beams.get(entity.id)
            if(_entity) this.deleteEntity(_entity)
        }else{            
            const _entity = this.nodes.get(entity) || this.beams.get(entity)
            if(_entity) this.deleteEntity(_entity)
        }
    }
    moveNodeTo(nodeID: number, x: number, y: number): void {
        const node = this.getNode(nodeID)
        node.x = x
        node.y = y
        node.beamsID.forEach(beamID => {
            const beam = this.getBeam(beamID)
            if (beam.startConnectedNodeID === nodeID) {
                beam.moveStartPoint(x, y)
            } else if (beam.endConnectedNodeID === nodeID) {
                beam.moveEndPoint(x, y)
            }
        })
    }
}