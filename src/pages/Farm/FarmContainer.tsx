import * as React from 'react'
import { UIFarm } from './components'
import { FarmNode, INode, instanceOfNode } from 'src/models/Farm/ModelNode';
import { Beam, IBeam, instanceOfBeam } from 'src/models/Farm/ModelBeam';
import { Force, IForce, createForce } from 'src/models/Farm/ModelForce';
import Farm from 'src/models/Farm/Farm';
import testFarm from './_testFarm'
import { consts } from 'src/static';
import { IFarm } from 'src/models/Farm/FarmTypes';
import FarmFactory from 'src/models/Farm/FarmFactory';

interface State extends IFarm {
    calculation: boolean,
    calculated:boolean
}
interface Props {

}
export class FarmContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            nodes: [],
            beams: [],
            calculation: false,
            calculated: false,
        }
        this.defautlFarm = this.defautlFarm.bind(this)
        this.saveFarm = this.saveFarm.bind(this)
        this.calculateFarm = this.calculateFarm.bind(this)
    }
    componentDidMount() {
        const nodesJSON = localStorage.getItem("nodes")
        const beamsJSON = localStorage.getItem("beams")
        if (nodesJSON && beamsJSON) {
            const {nodes, beams} = FarmFactory.parse(nodesJSON, beamsJSON)
            this.setState({ nodes, beams })
        } else this.defautlFarm()
    }
    componentWillUpdate(nextProps:Props,nextState:State){
        if(this.state.calculated && nextState.calculated ) this.setState({calculated:false})
    }
    addNode = (x: number, y: number, options?: INode) => {
        const node = Farm.addNode(this.state.nodes, { ...options, x: x * consts.UI.koefOnGrid, y: y * consts.UI.koefOnGrid })
        if (node) {
            this.setState({
                nodes: [...this.state.nodes, node]
            })
            return node
        }
        return null
    }
    addBeam = (options?: IBeam) => {
        const beam = Farm.addBeam(this.state.beams, { ...options })
        if (beam) {
            this.setState({
                beams: [...this.state.beams, beam]
            })
            return beam
        }
        return null
    }
    connectBeamToNode = (_node: FarmNode, _beam: Beam, place: 'start' | 'end') => {

        const node: FarmNode = { ..._node }
        const beam: Beam = { ..._beam }

        switch (place) {
            case 'start': {
                beam.startConnectedNodeID = node.id
                beam.name = node.name + " - "
                node.beamsID.push(beam.id)
                Farm.moveEntity(beam, node.x, node.y)
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
                return beam;
            }
            case 'end': {
                const beamsOfNode = this.state.beams.filter(item => (node && node.beamsID.includes(item.id)))
                const oldBeam = beamsOfNode.find(item => Farm.findOldBeam(node, beam, item))
                if (!oldBeam) {
                    node.beamsID.push(beam.id)
                    beam.endConnectedNodeID = node.id
                    beam.name = beam.name + node.name
                    Farm.moveBeamEnd(beam, node.x, node.y)
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
        }))
        return force

    }
    moveNode = (_node: FarmNode, _x: number, _y: number, ) => {
        const x = _x * consts.UI.koefOnGrid
        const y = _y * consts.UI.koefOnGrid
        if (_node.isStatic) return false
        const oldNode = this.state.nodes.find(item => item.x === x && item.y === y)
        if (!oldNode) {
            const node: FarmNode = { ..._node }
            Farm.moveEntity(node, x, y)
            const beamsOfNode = this.state.beams.filter(item => (node && node.beamsID.includes(item.id)))
            beamsOfNode.forEach(item => {
                if (node) {
                    const beam: Beam = { ...item }
                    if (beam.startConnectedNodeID === node.id) Farm.moveEntity(beam, x, y)
                    else if (item.endConnectedNodeID === node.id) Farm.moveBeamEnd(beam, x, y)
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
    moveBeam = (beam: Beam, _x: number, _y: number, place: 'start' | 'end' = 'end') => {

        const x = _x * consts.UI.koefOnGrid
        const y = _y * consts.UI.koefOnGrid
        beam = { ...beam }
        if (place === 'start') Farm.moveEntity(beam, x, y)
        else Farm.moveBeamEnd(beam, x, y)
        this.setState(state => ({
            beams: state.beams.map(item => {
                if (beam && item.id === beam.id) return beam
                return item
            })
        }))
        return true
    }
    deleteEntity = (id: string) => {
        let nodes: FarmNode[] = [...this.state.nodes]
        let beams: Beam[] = [...this.state.beams]
        let entity: Beam | FarmNode | undefined =
            this.state.beams.find(item => item.id === id) ||
            this.state.nodes.find(item => item.id === id)
        if (instanceOfNode(entity)) {
            if (entity.isStatic) return false
            const beamsOfNode = beams.filter(item => (instanceOfNode(entity) && entity.beamsID.includes(item.id)))
            beamsOfNode.forEach(beam => {
                if (instanceOfNode(entity)) {
                    let _node: FarmNode | undefined
                    if (beam.startConnectedNodeID === entity.id) _node = nodes.find(item => item.id === beam.endConnectedNodeID)
                    else _node = nodes.find(item => item.id === beam.startConnectedNodeID)
                    if (_node) {
                        _node = { ..._node }
                        _node.beamsID = _node.beamsID.filter(id => id !== beam.id)
                        nodes = nodes.map(item => {
                            if (_node && item.id === _node.id) return _node
                            return item
                        })
                    }
                    beams = beams.filter(i => i.id !== beam.id)
                }
            })
            nodes = nodes.filter(i => (instanceOfNode(entity) && i.id !== entity.id))
            const { nodes: upNodes, beams: upBeams } = Farm.update(nodes, beams)
            this.setState({
                nodes: upNodes,
                beams: upBeams
            })
            return true

        } else if (instanceOfBeam(entity)) {
            [entity.startConnectedNodeID, entity.endConnectedNodeID].forEach(nodeID => {
                if (nodeID && nodeID.length > 0) {
                    let _node = nodes.find(item => item.id === nodeID)
                    if (_node && instanceOfBeam(entity)) {
                        _node = { ..._node }
                        _node.beamsID = _node.beamsID.filter(id => {
                            if (entity) return id !== entity.id
                            return false
                        })
                        nodes = nodes.map(item => {
                            if (_node && item.id === _node.id) return _node
                            return item
                        })
                    }
                }
            })
            beams = beams.filter(i => (instanceOfBeam(entity) && i.id !== entity.id))
            this.setState({
                nodes, beams
            })
            return true
        }

        return false
    }
    async calculateFarm() {
        let { nodes, beams } = Farm.normalize(this.state.nodes, this.state.beams)
        this.setState({
            nodes,
            beams,
            calculation:true
        })
        try {
            const data = await Farm.calculate(nodes, beams)
            const withNewPos = Farm.correctAfterCalc(nodes, beams, data)
            this.setState({
                nodes:withNewPos.nodes,
                beams:withNewPos.beams,
                calculation:false,
                calculated:true
            })

        } catch (e) {
            if (e.message)
                alert(e.message)
            else alert(e)
            console.error(e);
            
            this.setState({
                calculation:false
            })
        }
    }
    defautlFarm() {
        let _farm = testFarm()
        localStorage.removeItem('nodes')
        localStorage.removeItem('beams')
        _farm = FarmFactory.firstPlacement(_farm.nodes, _farm.beams)
        const { nodes, beams } = _farm
        this.setState({
            nodes,
            beams,
        })
    }
    saveFarm() {
        const { nodes, beams } = this.state
        localStorage.setItem('nodes', JSON.stringify(nodes))
        localStorage.setItem('beams', JSON.stringify(beams))
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
export default FarmContainer