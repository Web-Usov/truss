import * as React from 'react'
import { IFarmStore } from './farmReducer';
import { Stage, Layer } from "react-konva"
import Konva from "konva"
import './style.css'
import { Farm, Node } from 'src/models/Farm';
import UINode from './components/UINode';
import UIBeam from './components/UIBeam';
import UIPanel, { UIModes } from './components/UIPanel';
import { Beam } from 'src/models/Farm/ModelBeam';
import { Entity } from 'src/models/Farm/ModelEntity';
import { MyMath } from 'src/utils';


export interface UIFarmProps extends IFarmStore {
    update: (workSpace: Farm) => void
}

export interface UIFarmState {
    stageWidth: number,
    stageHeight: number,
    farm: Farm,
    uiMode: UIModes,
    selectedID: number,
    paintEntity: Entity | undefined
}




export default class UIFarm extends React.Component<UIFarmProps, UIFarmState>{
    constructor(props: UIFarmProps) {
        super(props)

        this.state = {
            stageHeight: window.innerHeight * 0.75,
            stageWidth: window.innerWidth * 0.75,
            farm: props.workSpace,
            uiMode: UIModes.none,
            selectedID: -1,
            paintEntity: undefined,

        }
        this.onClick = this.onClick.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.setFarm = this.setFarm.bind(this)
        this.updateFarm = this.updateFarm.bind(this)
    }

    componentWillReceiveProps(nextProps: UIFarmProps) {
        if (nextProps.workSpace !== this.state.farm)
            this.setState({ farm: nextProps.workSpace })
    }
    setFarm(farm: Farm): void {
        this.props.update(farm)
    }
    updateFarm(farm: Farm): void {
        this.setState({ farm })
    }

    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Node | Beam) {
        const { uiMode, farm } = this.state
        const isEmptyPlace = e.target.getStage() === e.target

        switch (uiMode) {
            case UIModes.addNode: {
                if (isEmptyPlace) {

                    const { layerX, layerY } = e.evt
                    farm.addNode(layerX, layerY, 0)
                }
                break;

            }
            case UIModes.addBeam: {
                if(!isEmptyPlace && entity instanceof Node){
                    
                    const beam = farm.addBeam(entity.x, entity.y, 0, 0)
                    this.setState({
                        paintEntity:beam,
                        uiMode:UIModes.addBeamStart
                    })
                }
                break;
            }
            case UIModes.addBeamStart: {
                if(!isEmptyPlace && entity instanceof Node && this.state.paintEntity instanceof Beam){
                    const beam = this.state.paintEntity

                    beam.angle = MyMath.angleBePoints(beam.x, beam.y, entity.x, entity.y)
                    beam.length = MyMath.lengthBePoints(beam.x, beam.y, entity.x, entity.y)

                    this.setState({
                        uiMode: UIModes.addBeam,
                        paintEntity: undefined
                    })
                }
                break;
            }
            default:
                break;
        }
        
        if(isEmptyPlace) this.setState({ selectedID: -1 })

        this.updateFarm(farm)
    }
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const { uiMode, farm, paintEntity: paintEntity } = this.state

        switch (uiMode) {
            case UIModes.addBeamStart: {

                if (paintEntity && paintEntity instanceof Beam) {

                    const beam = paintEntity
                    const { layerX, layerY } = e.evt
                    // beam.angle = Math.atan2(-beam.y + layerY, -beam.x + layerX) / (Math.PI)
                    beam.angle = MyMath.angleBePoints(beam.x, beam.y, layerX, layerY)
                    beam.length = MyMath.lengthBePoints(beam.x, beam.y, layerX, layerY)

                } else this.setSelectMode(UIModes.addBeam)

                this.updateFarm(farm)
            }
            default:
                break;
        }

    }
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Node | Beam) {

        const { farm, uiMode } = this.state
        if (entity instanceof Node) {
            if (uiMode === UIModes.dragNode || uiMode === UIModes.drag) {
                // const farmNode = farm.getNode(entity.id)
                const node = entity
                node.x = e.evt.layerX
                node.y = e.evt.layerY
            }
        }

        this.updateFarm(farm)


    }
    setSelectMode(mode: UIModes) {
        this.setState({ uiMode: mode })
    }
    render() {
        const { stageHeight, stageWidth, farm, uiMode, selectedID } = this.state

        return (
            <div>
                <UIPanel
                    selected={uiMode}
                    onSelect={this.setSelectMode.bind(this)} />
                <Stage
                    height={stageHeight}
                    width={stageWidth}
                    className="stage"
                    style={{
                        height: stageHeight + 'px',
                        width: stageWidth + 'px',
                    }}
                    onClick={this.onClick}
                    // onMouseDown={this.onMouseDown}
                    // onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                >
                    <Layer className="layer">
                        {farm.getNodes().map(node => (
                            <UINode
                                key={node.id}
                                node={node}
                                mode={uiMode}
                                drag={this.onDrag}
                                onClick={this.onClick}
                                selected={selectedID === node.id}
                            />
                        ))}
                        {farm.getBeams().map(beam => (
                            <UIBeam
                                key={beam.id}
                                beam={beam}
                                mode={uiMode}
                                drag={this.onDrag}
                                onClick={this.onClick}
                                selected={selectedID === beam.id}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        )
    }
}