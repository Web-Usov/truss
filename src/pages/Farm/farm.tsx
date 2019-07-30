import * as React from 'react'
import KeyHandler from 'react-key-handler'
import Konva from "konva"
import { Stage } from "react-konva"
import { createStyles, Theme, WithStyles, withStyles, Box } from '@material-ui/core';
import { IFarmStore } from './store/farmReducer';
import { UITreePanel, UIEntityInfo, UIStage, UIHeader, UIToolPanel } from './components';
import { UIModes } from './components/UIToolPanel';
import { MyMath } from 'src/utils';
import Stats from 'react-stats'
import { instanceOfBeam } from 'src/models/Farm/ModelBeam';
import { Entity } from 'src/models/Farm/ModelEntity';
import { instanceOfNode } from 'src/models/Farm/ModelNode';
import { FarmContainerClass } from './index'



const styles = (theme: Theme) => createStyles({
    root: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
    },
    stageBox: {
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden',

    },
    toolbar: theme.mixins.toolbar,
})

export interface UIFarmProps extends IFarmStore, WithStyles<typeof styles> {
    addNode: typeof FarmContainerClass.prototype.addNode,
    addBeam: typeof FarmContainerClass.prototype.addBeam,
    moveNode: typeof FarmContainerClass.prototype.moveNode,
    moveBeam: typeof FarmContainerClass.prototype.moveBeam,
    connectBeamToNode: typeof FarmContainerClass.prototype.connectBeamToNode,
    deleteEntity: typeof FarmContainerClass.prototype.deleteEntity
    defautlFarm:typeof FarmContainerClass.prototype.defautlFarm
}

export interface UIFarmState {
    stageWidth: number,
    stageHeight: number,
    uiMode: UIModes,
    selectedEntity: Entity | undefined,
    paintEntity: Entity | undefined
}



class UIFarm extends React.Component<UIFarmProps, UIFarmState>{
    private stage: React.RefObject<Stage & Konva.Stage>
    constructor(props: UIFarmProps) {
        super(props)

        this.state = {
            stageHeight: 3000,
            stageWidth: 3000,
            uiMode: UIModes.none,
            selectedEntity: undefined,
            paintEntity: undefined,

        }

        this.onClick = this.onClick.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onKeyHandle = this.onKeyHandle.bind(this)
        this._setStageSize = this._setStageSize.bind(this)
        this.selectEntity = this.selectEntity.bind(this)
        this.clearFarm = this.clearFarm.bind(this)
        this.deleteEntity = this.deleteEntity.bind(this)

        this.stage = React.createRef();
    }
    componentWillMount() {
        this._setStageSize()

    }
    componentDidMount() {
        window.addEventListener('resize', this._setStageSize)
        const { current: stage } = this.stage
        if (stage) {
            const container: HTMLDivElement = stage.attrs.container.parentElement
            if (container) {
                container.scrollTop = (container.scrollHeight - container.offsetHeight) / 2
                container.scrollLeft = (container.scrollWidth - container.offsetWidth) / 2
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this._setStageSize)
    }


    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Entity) {
        const { uiMode, paintEntity } = this.state
        const isEmptyPlace = e.target.getStage() === e.target
        e.evt.preventDefault()
        if (e.evt.button === 0) {
            switch (uiMode) {
                case UIModes.none: {
                    if (!isEmptyPlace) {
                        this.selectEntity(entity);
                    } else this.setState({ selectedEntity: undefined })

                    break;
                }
                case UIModes.addNode: {
                    if (isEmptyPlace) {
                        const { layerX, layerY } = e.evt
                        const cellX = MyMath.cellX(layerX)
                        const cellY = MyMath.cellX(layerY)
                        this.props.addNode(cellX, cellY)
                    }
                    break;
                }
                case UIModes.addBeam: {
                    if (!isEmptyPlace && instanceOfNode(entity)) {

                        const beam = this.props.addBeam({
                            x:entity.x,
                            y:entity.y
                        })
                        if (instanceOfBeam(beam)) {
                            const connectedBeam = this.props.connectBeamToNode(entity, beam, 'start')
                            console.log("PAM", connectedBeam);
                            
                            if(instanceOfBeam(connectedBeam))
                                this.setState({
                                    paintEntity: connectedBeam,
                                    uiMode: UIModes.addBeamStart
                                })
                            else this.props.deleteEntity(beam.id)
                        }
                    }
                    break;
                }
                case UIModes.addBeamStart: {
                    if (!isEmptyPlace && instanceOfNode(entity) && instanceOfBeam(paintEntity)) {
                        if (this.props.connectBeamToNode(entity, paintEntity, 'end'))
                            this.setState({
                                uiMode: UIModes.addBeam,
                                paintEntity: undefined
                            })
                    }
                    break;
                }
                case UIModes.delete: {
                    if (!isEmptyPlace && entity) {
                        this.deleteEntity(entity)
                    }
                    break;
                }
                default:
                    break;
            }
        }


        if (isEmptyPlace) this.setState({ selectedEntity: undefined })

    }
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const { uiMode, paintEntity } = this.state
        const { layerX, layerY } = e.evt
        switch (uiMode) {
            case UIModes.addBeamStart: {
                if (e.target.getStage()) {
                    if (paintEntity && instanceOfBeam(paintEntity)) {
                        this.props.moveBeam(paintEntity, layerX, layerY)
                    } else this.setState({ uiMode: UIModes.addBeam })
                }
                break;
            }
            case UIModes.delete: {
                const stage: Stage & Konva.Stage = e.target.getStage()
                if (stage === e.target) {
                    stage.container().style.cursor = 'default'
                }
                break;
            }
            default:
                break;
        }
    }
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Entity) {
        const { uiMode } = this.state
        switch (uiMode) {
            case UIModes.move: {
                if (instanceOfNode(entity)) {
                    if (e.evt.defaultPrevented) {
                        const { layerX, layerY } = e.evt
                        this.props.moveNode(entity, MyMath.cellX(layerX), MyMath.cellY(layerY))
                    }
                }
                break
            }
            default:
                break;
        }

    }
    onKeyHandle(e: KeyboardEvent) {
        switch (e.key) {
            case "Escape": {
                this.deletePaintEntity()

                break;
            }
            default:
                break;
        }

    }
    setSelectedMode(mode: UIModes) {
        if(this.state.paintEntity) 
            this.props.deleteEntity(this.state.paintEntity.id)
        this.setState({
            uiMode: mode || 0,
            paintEntity: undefined
        })
    }

    _setStageSize(e?: UIEvent) {
        this.setState({
            stageHeight: window.innerHeight * 1.5,
            stageWidth: window.innerWidth * 1.5
        })
    }
    selectEntity(entity: Entity | undefined) {
        if (entity) this.setState({ selectedEntity: entity })
    }
    clearFarm(): void {
        if (window.confirm('Выуверены, что хотите очистить холст?')) {
            this.props.defautlFarm()
        }
    }
    deletePaintEntity() {
        if (this.state.paintEntity)
            this.props.deleteEntity(this.state.paintEntity.id)
        this.setState({
            paintEntity: undefined
        })
    }
    deleteEntity(entity: Entity) {
        if (this.state.selectedEntity && this.state.selectedEntity.id === entity.id)
            this.setState({
                selectedEntity: undefined
            })
        this.props.deleteEntity(entity.id)
    }
    render() {
        const { stageHeight, stageWidth, uiMode, selectedEntity } = this.state
        const { classes, nodes, beams, forces } = this.props
        return (
            <Box className={classes.root}>
                <Stats.FPSStats isActive={true} />
                <KeyHandler
                    keyEventName={"keyup"}
                    keyValue={"Escape"}
                    onKeyHandle={this.onKeyHandle}
                />
                <UIHeader
                    hundleClear={this.clearFarm} />

                <div className={classes.toolbar} />
                <Box className={classes.stageBox}>
                    <div className={classes.toolbar} />

                    <UITreePanel
                        nodes={nodes}
                        beams={beams}
                        selectedEntity={selectedEntity}
                        onSelect={this.selectEntity}
                    />

                    <UIStage
                        onClick={this.onClick}
                        onDrag={this.onDrag}
                        onMouseMove={this.onMouseMove}
                        stageHeight={stageHeight}
                        stageWidth={stageWidth}
                        nodes={nodes}
                        beams={beams}
                        forces={forces}
                        stage={this.stage}
                        selectedEntity={selectedEntity}
                        uiMode={uiMode}
                    />
                    <UIEntityInfo
                        entity={selectedEntity}
                        onDelete={this.deleteEntity} />
                </Box>

                <UIToolPanel
                    selected={uiMode}
                    onSelect={this.setSelectedMode.bind(this)} />
            </Box>
        )
    }
}

export default withStyles(styles)(UIFarm)