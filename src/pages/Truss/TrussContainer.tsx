import * as React from 'react'
import { Truss as farm, TNode, TBeam } from 'src/models/Truss'
import { ITNode, ITBeam } from 'src/models/Truss/TTypes';
import { consts } from 'src/static';
import { UIFarm } from './components';
import { observer } from 'mobx-react';

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
            console.error("addNode",e);            
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
            console.error("moveNode",e);
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    addBeam = (options?: ITBeam) => {
        try {
            return farm.addBeam(options)            
        } catch (e) {
            console.error("addBeam",e);            
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    moveEndBeam = (_beam: TBeam, x:number,y:number) => {
        
        try {
            return farm.moveEndBeamWhileDraving(_beam.id,x,y)      
        } catch (e) {
            console.error("moveEndBeam",e);            
            if (e.message) alert(e.message)
            else alert(e)
        }
    }
    connectBeamToNode = (_node: TNode, _beam: TBeam, place: 'start' | 'end') => {        
        try {
            switch (place) {
                case 'start':{
                    return farm.connectBeamToStartNode(_node.id,_beam.id)
                }            
                case 'end':{
                    return farm.connectBeamToEndNode(_node.id,_beam.id)
                }
                default:
                    break;
            }            
        } catch (e) {
            console.error("connectBeamToNode",e);            
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

export default TrussContainer