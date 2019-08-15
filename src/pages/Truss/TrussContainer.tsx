import { observer } from 'mobx-react';
import * as React from 'react';
import { TBeam, TNode, Truss as farm } from 'src/models/Truss';
import TrussFactory from 'src/models/Truss/TFactory';
import { ITBeam, ITNode, NodeFixation, TrussCalcProps } from 'src/models/Truss/TTypes';
import { consts } from 'src/static';
import { UIFarm } from './components';

interface State {
    calculation: boolean,
    calculated: boolean
}
interface Props {

}
@observer
export class TrussContainer extends React.Component<Props, State>  {
    constructor(props: Props) {
        super(props)
        this.state = {
            calculation: false,
            calculated: false,
        }
    }
    componentDidMount() {
        this.setDefaultTruss()
    }
    // Node
    addNode = (x: number, y: number, options?: ITNode) => {
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
        try {
            return farm.addBeam(options)
        } catch (e) {
            console.error("addBeam", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    moveEndBeam = (_beam: TBeam, _x: number, _y: number) => {
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
        try {
            farm.delete(id)
        } catch (e) {
            console.error("deleteEntity", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    // Calculate
    calculate = (props?: TrussCalcProps) => {
        try {
            console.log("Calculate");

            farm.sortNodes()
        } catch (e) {
            console.error("calculate", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }

    setDefaultTruss = () => {
        try {
            console.log("setDefaultTruss");
            const _truss = genTruss()
            farm.setNodes(_truss)
        } catch (e) {
            console.error("setDefaultTruss", e);
            if (e.message) alert(e.message)
            else alert(e)
        }
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