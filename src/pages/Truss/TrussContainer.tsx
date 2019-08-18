import { observer } from 'mobx-react';
import * as React from 'react';
import { TBeam, TNode, Truss as farm } from 'src/models/Truss';
import TrussFactory from 'src/models/Truss/TFactory';
import { ITBeam, ITNode, NodeFixation, TrussCalcProps } from 'src/models/Truss/TTypes';
import { consts } from 'src/static';
import { UIFarm } from './components';

interface State {
    calculation: boolean,
    calculated: boolean,
    loadFromCache: boolean
}
interface Props {

}
@observer
export class TrussContainer extends React.Component<Props, State>  {
    private nodesCacheName = "nodes:array"
    private beamsCacheName = "beams:array"
    constructor(props: Props) {
        super(props)
        this.state = {
            calculation: false,
            calculated: false,
            loadFromCache: false
        }
    }
    componentWillMount() {
        if (localStorage.getItem(this.nodesCacheName) && localStorage.getItem(this.beamsCacheName))
            this.setState({ loadFromCache: true })
    }
    componentDidMount() {
        this.setDefaultTruss()
    }

    // Node
    addNode = (x: number, y: number, options?: ITNode) => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            return farm.addNode({
                ...options,
                coord: {
                    x: x * consts.UI.koefOnGrid,
                    y: y * consts.UI.koefOnGrid
                }
            })
        } catch (e) {
            console.error("addNode", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    moveNode = (_node: TNode, _x: number, _y: number) => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            const x = _x * consts.UI.koefOnGrid
            const y = _y * consts.UI.koefOnGrid
            farm.moveNode(_node.id, x, y)
        } catch (e) {
            console.error("moveNode", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    // Beam
    addBeam = (options?: ITBeam) => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            return farm.addBeam(options)
        } catch (e) {
            console.error("addBeam", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    moveEndBeam = (_beam: TBeam, _x: number, _y: number) => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            const x = _x * consts.UI.koefOnGrid
            const y = _y * consts.UI.koefOnGrid
            return farm.moveEndBeamWhileDraving(_beam.id, x, y)
        } catch (e) {
            console.error("moveEndBeam", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    connectBeamToNode = (_node: TNode, _beam: TBeam, place: 'start' | 'end') => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            switch (place) {
                case 'start': {
                    return farm.connectBeamToStartNode(_node.id, _beam.id)
                }
                case 'end': {
                    return farm.connectBeamToEndNode(_node.id, _beam.id)
                }
                default:
                    break;
            }
        } catch (e) {
            console.error("connectBeamToNode", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    // Generals actions
    deleteEntity = (id: string) => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            farm.delete(id)
        } catch (e) {
            console.error("deleteEntity", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    // Calculate
    calculate = async (props?: TrussCalcProps) => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            this.setState({ calculation: true })
            console.log("Calculate");
            await farm.calculate()
            this.setState({ calculated: true, calculation: false })

        } catch (e) {
            console.error("calculate", e);
            if (e.message) alert(e.message)
            else alert(e)

            this.setState({ calculated: false, calculation: false })
        }
    }

    setDefaultTruss = () => {
        if (this.state.calculated) this.setState({ calculated: false })
        try {
            console.log("setDefaultTruss");

            if (this.state.loadFromCache) {
                this.loadTrussFromCache()
            } else {
                const _truss = genTruss()
                farm.setNodes(_truss)
                farm.sortNodesByCoord()
                TrussFactory.firstPlacement(farm.nodesArray, farm.beamsArray)
            }

        } catch (e) {
            console.error("setDefaultTruss", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    cacheTruss = () => {
        const { beamsJSON, nodesJSON } = TrussFactory.toString(farm)
        localStorage.setItem(this.nodesCacheName, nodesJSON)
        localStorage.setItem(this.beamsCacheName, beamsJSON)
    }

    loadTrussFromCache = async () => {
        const nodesJSON = localStorage.getItem(this.nodesCacheName)
        const beamsJSON = localStorage.getItem(this.beamsCacheName)
        if (nodesJSON && beamsJSON) {
            const { nodes, beams } = await TrussFactory.parse(nodesJSON, beamsJSON)
            farm.setNodes(nodes)
            farm.setBeams(beams)
        }
    }
    clearTruss = async () => {
        await this.setState({ loadFromCache: false })
        localStorage.removeItem(this.nodesCacheName)
        localStorage.removeItem(this.beamsCacheName)
        await farm.clear()
        this.setDefaultTruss()
    }
    render() {
        return (
            <UIFarm
                {...this.state}
                {...this}
                farm={farm}
            />
        )
    }
}

const genTruss = () => {
    return TrussFactory.createNodes(
        [
            {
                x: 0,
                y: 1000,
                fixation: NodeFixation.XY,
            },
            {
                x: 3000,
                y: 1000,
                fixation: NodeFixation.Y,
            }
        ],
        [
            {
                x: 1000,
                y: 1000,
                forceY: 9000
            }
        ],
        [
            // {
            //     x: 1000,
            //     y: 1000
            // }, {
            //     x: 700,
            //     y: 700
            // }, {
            //     x: 1000,
            //     y: 700
            // }
        ]
    )
}

export default TrussContainer