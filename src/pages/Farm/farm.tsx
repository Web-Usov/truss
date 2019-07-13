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
import KeyHandler from 'react-key-handler'


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
    private stage: React.RefObject<Stage>
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
        this.onKeyHandle = this.onKeyHandle.bind(this)

        this.stage = React.createRef();
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
                if (!isEmptyPlace && entity instanceof Node) {

                    const beam = farm.addBeam(entity.x, entity.y)
                    beam.connectNode(entity.id, 'start')
                    entity.connectBeam(beam.id)

                    this.setState({
                        paintEntity: beam,
                        uiMode: UIModes.addBeamStart
                    })
                }
                break;
            }
            case UIModes.addBeamStart: {
                if (!isEmptyPlace && entity instanceof Node && this.state.paintEntity instanceof Beam) {
                    const beam = this.state.paintEntity
                    const beams = farm.getBeamsOnNode(beam.startConnectedNodeID)
                    const oldBeam = beams.find(_beam =>
                        _beam.startConnectedNodeID === beam.startConnectedNodeID &&
                        _beam.endConnectedNodeID === entity.id ||
                        _beam.startConnectedNodeID === entity.id &&
                        _beam.endConnectedNodeID === beam.startConnectedNodeID)

                    console.log(beams, oldBeam, beam);


                    if (!oldBeam && entity.connectBeam(beam.id) ) {
                        beam.moveEndPoint(entity.x, entity.y)
                        beam.connectNode(entity.id, "end")
                        this.setState({
                            uiMode: UIModes.addBeam,
                            paintEntity: undefined
                        })
                    }
                }
                break;
            }
            case  UIModes.delete:{
                if(!isEmptyPlace){
                    if(entity instanceof Node){
                       const beams = farm.getBeamsOnNode(entity.id)
                       beams.forEach(beam => {
                           if(beam.startConnectedNodeID === entity.id) farm.getNode(beam.endConnectedNodeID).removeBeam(beam.id)
                           else farm.getNode(beam.startConnectedNodeID).removeBeam(beam.id)
                           farm.deleteBeam(beam.id)
                       }) 
                       farm.deleteNode(entity.id)
                    }else if(entity instanceof Beam){
                        farm.getNodesOnBeam(entity.id).forEach(node => {
                            node.removeBeam(entity.id)
                        })                        
                        farm.deleteBeam(entity.id)
                    }
                }
                break;
            }
            default:
                break;
        }

        if (isEmptyPlace) this.setState({ selectedID: -1 })

        this.updateFarm(farm)
    }
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const { uiMode, farm, paintEntity } = this.state

        switch (uiMode) {
            case UIModes.addBeamStart: {

                if (paintEntity && paintEntity instanceof Beam) {

                    const beam = paintEntity
                    const { layerX, layerY } = e.evt
                    beam.moveEndPoint(layerX, layerY)

                } else this.setState({ uiMode: UIModes.addBeam })

                this.updateFarm(farm)
                break;
            }
            default:
                break;
        }

    }
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Entity) {

        const { farm, uiMode } = this.state
        if (entity instanceof Node) {
            if (uiMode === UIModes.dragNode || uiMode === UIModes.drag) {
                farm.moveNodeTo(entity.id, e.evt.layerX, e.evt.layerY)
            }
        }
        this.updateFarm(farm)
    }
    onKeyHandle(e: KeyboardEvent) {
        switch (e.key) {
            case "Escape": {
                this._deletePaintEntity()
                break;
            }

            default:
                break;
        }

    }
    setSelectMode(mode: UIModes) {
        this._deletePaintEntity()
        this.setState({
            uiMode: mode,
        })
    }
    _deletePaintEntity() {
        
        const { uiMode, paintEntity, farm } = this.state
        if (uiMode === UIModes.addBeamStart && paintEntity instanceof Beam) {
            const node = farm.getNode(paintEntity.startConnectedNodeID)
            node.removeBeam(paintEntity.id)
            farm.deleteBeam(paintEntity.id)
            this.setState({
                paintEntity: undefined,
            })
            this.updateFarm(farm)
        } 
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
                    onMouseMove={this.onMouseMove}
                    ref={this.stage}
                >
                    <KeyHandler
                        keyEventName={"keyup"}
                        keyValue={"Escape"}
                        onKeyHandle={this.onKeyHandle}
                    />
                    <Layer className="layer" >
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
                    </Layer>
                </Stage>
            </div>
        )
    }
}