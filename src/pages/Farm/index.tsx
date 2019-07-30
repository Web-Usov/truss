import * as React from 'react'
import UIFarm from './farm'
import { FarmNode, INode, createNode, instanceOfNode } from 'src/models/Farm/ModelNode';
import { Beam, IBeam, createBeam, instanceOfBeam } from 'src/models/Farm/ModelBeam';
import { Force, createForce, IForce, instanceOfForce } from 'src/models/Farm/ModelForce';
import uuid from 'uuid'
import testFarm from './_testFarm'

interface State {
    nodes: FarmNode[],
    beams: Beam[],
    forces: Force[]
}
interface Props {

}
export class FarmContainerClass extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            nodes:[],
            beams:[],
            forces:[]
        }
        this.defautlFarm = this.defautlFarm.bind(this)
    }
    componentDidMount(){
        
        this.defautlFarm()
    }
    addNode = (x: number, y: number, options?: INode) => {
        if(this.state.nodes.length > 12) return false
        const oldNode = this.state.nodes.find(item => item.x === x && item.y === y)
        if (oldNode) return false
        const id = uuid()
        if (!id) return false
        const name = (this.state.nodes.length + 1)+""
        const node = createNode({
            ...options,
            name:options ? options.name || name : name, 
            id,
            x,
            y
        })
        this.setState({
            nodes: [...this.state.nodes, node]
        })
        return node
    }
    addBeam = (options?: IBeam) => {
        if(this.state.beams.length > 36) return false

        const id = uuid()
        if (!id) return false
        const beam = createBeam({
            ...options,
            id,
        })
        this.setState({
            beams: [...this.state.beams, beam]
        })
        return beam
    }
    addForce = (options?: IForce) => {
        const id = uuid()
        if (!id) return false
        const force = createForce({
            ...options,
            id,
        })
        this.setState({
            forces: [...this.state.forces, force]
        })
        return force
    }

    connectBeamToNode = (_node: FarmNode, _beam: Beam, place: 'start' | 'end') => {

        const node = createNode(_node)
        const beam = createBeam(_beam)

        switch (place) {
            case 'start': {

                beam.startConnectedNodeID = node.id
                node.beamsID.push(beam.id)
                
                beam.x = node.x
                beam.y = node.y
                this.setState(state => ({
                    nodes: state.nodes.map(item => {
                        if (item.id === node.id) return node
                        return item
                    }),
                    beams: state.beams.map(item => {                        
                        if (item.id === beam.id) return beam
                        return item
                    })
                }))
                console.log(...this.state.beams);
                
                return beam;
            }
            case 'end': {
                const beamsOfNode = this.state.beams.filter(item => (node && node.beamsID.includes(item.id)))
                const oldBeam = beamsOfNode.find(item =>
                    (node && beam && (
                        (item.startConnectedNodeID === beam.startConnectedNodeID && item.endConnectedNodeID === node.id) ||
                        (item.startConnectedNodeID === node.id && item.endConnectedNodeID === beam.startConnectedNodeID) ||
                        (item.id === beam.id && item.startConnectedNodeID === node.id))
                    )
                )

                if (!oldBeam) {

                    node.beamsID.push(beam.id)
                    beam.endConnectedNodeID = node.id
                    beam.endX = node.x
                    beam.endY = node.y
                    this.setState(state => ({
                        nodes: state.nodes.map(item => {
                            if (item.id === node.id) return node
                            return item
                        }),
                        beams: state.beams.map(item => {
                            if (item.id === beam.id) return beam
                            return item
                        })
                    }))
                    return true
                }
                return false
            }
            default: return false
        }
    }
    addForceToNode = (node: FarmNode, options?: IForce) => {
        let force: Force = createForce({
            ...options,
            nodeID: node.id,
        })

        if (force.angle === 0) node.forceX = force
        else node.forceY = force
        this.setState(state => ({
            nodes: state.nodes.map(item => {
                if (node && item.id === node.id) return node
                return item
            }),
            forces: [...state.forces, force]
        }))
        return force

    }
    moveNode = (_node: FarmNode, x: number, y: number, ) => {

        if (_node.isStatic) return false
        const oldNode = this.state.nodes.find(item => item.x === x && item.y === y)
        if (!oldNode) {
            const node = createNode({
                ..._node,
                x,
                y
            })
            const beamsOfNode = this.state.beams.filter(item => (node && node.beamsID.includes(item.id)))
            beamsOfNode.forEach(item => {
                if (node) {
                    const beam = createBeam(item)
                    if (beam.startConnectedNodeID === node.id) {
                        beam.x = x
                        beam.y = y

                    } else if (item.endConnectedNodeID === node.id) {
                        beam.endX = x
                        beam.endY = y
                    }
                    this.setState(state => ({
                        beams: state.beams.map(item => {
                            if (item.id === beam.id) return beam
                            return item
                        })
                    }))
                }
            })
            this.setState(state => ({
                nodes: state.nodes.map(item => {
                    if (item.id === node.id) return node
                    return item
                }),
            }))

            return true
        }
        return false
    }

    moveBeam = (beam: Beam, x: number, y: number, place: 'start' | 'end' = 'end') => {

        beam = createBeam(beam)
        if (place === 'start') {
            beam.x = x
            beam.y = y
        }
        else {
            beam.endX = x
            beam.endY = y
        }
        
        this.setState(state => ({
            beams: state.beams.map(item => {
                if (beam && item.id === beam.id) return beam
                return item
            })
        }))
        return true
    }

    deleteEntity = (id: string) => {
        let entity: Beam | FarmNode | Force | undefined =
            this.state.beams.find(item => item.id === id) ||
            this.state.nodes.find(item => item.id === id) ||
            this.state.forces.find(item => item.id === id)
        if (instanceOfNode(entity)) {
            if (entity.isStatic) return false
            const beamsOfNode = this.state.beams.filter(item => (instanceOfNode(entity) && entity.beamsID.includes(item.id)))            
            beamsOfNode.forEach(beam => {
                if (instanceOfNode(entity)) {
                    let _node: FarmNode | undefined
                    if (beam.startConnectedNodeID === entity.id) {
                        _node = this.state.nodes.find(item => item.id === beam.endConnectedNodeID)
                    }
                    else {
                        _node = this.state.nodes.find(item => item.id === beam.startConnectedNodeID)
                    }
                    if (_node) {
                        _node = createNode(_node)
                        _node.beamsID = _node.beamsID.filter(id => id !== beam.id)
                        this.setState(state => ({
                            nodes: state.nodes.map(item => {
                                if (_node && item.id === _node.id) return _node
                                return item
                            }),
                        }))
                    }
                    this.setState(state => ({
                        beams: state.beams.filter(i => i.id !== beam.id)
                    }))
                }
            })
            if (entity.forceX) this.setState(state => ({
                forces: state.forces.filter(i => (instanceOfNode(entity) && instanceOfForce(entity.forceX) && i.id !== entity.forceX.id))
            }))
            if (entity.forceY) this.setState(state => ({
                forces: state.forces.filter(i => (instanceOfNode(entity) && instanceOfForce(entity.forceY) && i.id !== entity.forceY.id))
            }))
            this.setState(state => ({
                nodes: state.nodes.filter(i => (instanceOfNode(entity) && i.id !== entity.id)).map((node,index) => ({...node, name:(index + 1)+""}))
            }))
            return true

        } else if (instanceOfBeam(entity)) {
            [entity.startConnectedNodeID, entity.endConnectedNodeID].forEach(nodeID => {
                if (nodeID && nodeID.length > 0) {
                    let _node = this.state.nodes.find(item => item.id === nodeID)
                    if (_node && instanceOfBeam(entity)) {
                        _node = createNode(_node)
                        _node.beamsID = _node.beamsID.filter(id => {
                            if (entity) return id !== entity.id
                            return false
                        })
                        this.setState(state => ({
                            nodes: state.nodes.map(item => {
                                if (_node && item.id === _node.id) return _node
                                return item
                            }),
                        }))
                    }
                }
            })
            this.setState(state => ({
                beams: state.beams.filter(i => (instanceOfBeam(entity) && i.id !== entity.id))
            }))
            return true
        }

        return false
    }
    defautlFarm(){
        const {n:nodes, b:beams,f:forces} = testFarm()
        this.setState({
            nodes,
            beams,
            forces
        })
    }
    render() {
        return (
            <UIFarm
                {...this.state}
                {...this}
            />
        )
    }
}
export default FarmContainerClass