import * as React from 'react'
import KeyHandler from 'react-key-handler'
import Konva from "konva"
import { Stage } from "react-konva"
import { createStyles, Theme, WithStyles, withStyles, Box } from '@material-ui/core';
import { UITreePanel, UIEntityInfo, UIStage, UIHeader, UIToolPanel } from '.';
import { MyMath } from 'src/utils';
import Stats from 'react-stats'
import { instanceOfBeam } from 'src/models/Farm/ModelBeam';
import { Entity } from 'src/models/Farm/ModelEntity';
import { instanceOfNode } from 'src/models/Farm/ModelNode';
import { FarmContainer } from '../FarmContainer'
import { UIModes } from 'src/utils/UI';
import { IFarm } from 'src/models/Farm/ModelFarm';



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
export interface UIFarmProps extends IFarm, WithStyles<typeof styles> {
    addNode: typeof FarmContainer.prototype.addNode,
    addBeam: typeof FarmContainer.prototype.addBeam,
    moveNode: typeof FarmContainer.prototype.moveNode,
    moveBeam: typeof FarmContainer.prototype.moveBeam,
    connectBeamToNode: typeof FarmContainer.prototype.connectBeamToNode,
    deleteEntity: typeof FarmContainer.prototype.deleteEntity
    defautlFarm: typeof FarmContainer.prototype.defautlFarm
    saveFarm: typeof FarmContainer.prototype.saveFarm,
    calculateFarm:typeof FarmContainer.prototype.calculateFarm
    calculation: boolean,
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
            stageHeight: 2000,
            stageWidth: 2000,
            uiMode: UIModes.none,
            selectedEntity: undefined,
            paintEntity: undefined,
        }
        this.UIonClick = this.UIonClick.bind(this)
        this.UIonDrag = this.UIonDrag.bind(this)
        this.UIonMouseMove = this.UIonMouseMove.bind(this)
        this.onKeyHandle = this.onKeyHandle.bind(this)
        this.selectEntity = this.selectEntity.bind(this)
        this.clearFarm = this.clearFarm.bind(this)
        this.deleteEntity = this.deleteEntity.bind(this)
        this.saveFarm = this.saveFarm.bind(this)
        this.calculateFarm = this.calculateFarm.bind(this)
        this.stage = React.createRef();
    }
    componentDidMount() {
        const { current: stage } = this.stage
        if (stage) {
            const container: HTMLDivElement = stage.attrs.container.parentElement
            if (container) {
                container.scrollTop = (container.scrollHeight - container.offsetHeight) / 2
                container.scrollLeft = (container.scrollWidth - container.offsetWidth) / 2
            }
        }
    }

    UIonClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Entity) {
        const { uiMode, paintEntity } = this.state
        const { calculation } = this.props
        const isEmptyPlace = e.target.getStage() === e.target
        e.evt.preventDefault()
        if (e.evt.button === 0 && !calculation) {
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
                            x: entity.x,
                            y: entity.y
                        })
                        if (instanceOfBeam(beam)) {
                            const connectedBeam = this.props.connectBeamToNode(entity, beam, 'start')
                            if (instanceOfBeam(connectedBeam))
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
    UIonMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const { calculation } = this.props
        if (calculation) return
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
    UIonDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Entity) {
        const { calculation } = this.props
        if (calculation) return
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
    deletePaintEntity() {
        if (this.state.paintEntity)
            this.props.deleteEntity(this.state.paintEntity.id)
        this.setState({
            paintEntity: undefined
        })
    }
    deleteEntity(entity: Entity) {
        const { calculation } = this.props
        if (calculation) return
        if (this.state.selectedEntity && this.state.selectedEntity.id === entity.id)
            this.setState({
                selectedEntity: undefined
            })
        this.props.deleteEntity(entity.id)
    }
    selectEntity(entity: Entity | undefined) {
        const { calculation } = this.props
        if (calculation) return
        if (entity) this.setState({ selectedEntity: entity })
    }
    clearFarm(): void {
        if (window.confirm('Вы уверены, что хотите очистить холст?'))
            this.props.defautlFarm()
    }
    saveFarm(e: React.FormEvent<HTMLButtonElement>) {
        if (window.confirm('Вы уверены, что хотите сохранить холст в кэш?'))
            this.props.saveFarm()
    }
    calculateFarm(e: React.FormEvent<HTMLButtonElement>){
        this.props.calculateFarm()
    }
    setSelectedMode(mode: UIModes) {
        const { calculation } = this.props
        if (calculation) return
        if (this.state.paintEntity)
            this.props.deleteEntity(this.state.paintEntity.id)
        this.setState({
            uiMode: mode || 0,
            paintEntity: undefined
        })
    }
    render() {
        const { stageHeight, stageWidth, uiMode, selectedEntity } = this.state
        const { classes, nodes, beams, calculation } = this.props
        return (
            <Box className={classes.root}>
                <Stats.FPSStats isActive={true} />
                <KeyHandler
                    keyEventName={"keyup"}
                    keyValue={"Escape"}
                    onKeyHandle={this.onKeyHandle}
                />
                <UIHeader
                    hundleClear={this.clearFarm}
                    hundleSave={this.saveFarm}
                    hundleCalculate={this.calculateFarm}
                    disabled={calculation} />

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
                        onClick={this.UIonClick}
                        onDrag={this.UIonDrag}
                        onMouseMove={this.UIonMouseMove}
                        stageHeight={stageHeight}
                        stageWidth={stageWidth}
                        nodes={nodes}
                        beams={beams}
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