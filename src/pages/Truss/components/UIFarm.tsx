import { Box, createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import Konva from "konva";
import { observer } from "mobx-react";
import * as React from 'react';
import KeyHandler from 'react-key-handler';
import { Stage } from "react-konva";
import Stats from 'react-stats';
import { TBeam, TEntity, TNode, Truss } from 'src/models/Truss';
import { UIEntityInfo, UITreePanel } from 'src/pages/Truss/components';
import { canvas } from 'src/static/const';
import { MyMath } from 'src/utils';
import { UIModes } from 'src/utils/UI';
import { UIHeader, UIStage, UIToolPanel } from '.';
import { TrussContainer } from '../TrussContainer';




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
export interface UITrussProps extends WithStyles<typeof styles> {
    farm: typeof Truss,
    addNode: typeof TrussContainer.prototype.addNode,
    addBeam: typeof TrussContainer.prototype.addBeam,
    moveNode: typeof TrussContainer.prototype.moveNode,
    moveEndBeam: typeof TrussContainer.prototype.moveEndBeam,
    connectBeamToNode: typeof TrussContainer.prototype.connectBeamToNode,
    deleteEntity: typeof TrussContainer.prototype.deleteEntity
    clearTruss: typeof TrussContainer.prototype.clearTruss
    cacheTruss: typeof TrussContainer.prototype.cacheTruss,
    calculate: typeof TrussContainer.prototype.calculate
    calculation: boolean,
    calculated: boolean,
}

export interface UITrussState {
    stageWidth: number,
    stageHeight: number,
    uiMode: UIModes,
    selectedEntityID: string,
    paintEntity: TBeam | null
}
@observer
class UITruss extends React.Component<UITrussProps, UITrussState>{
    private stage: React.RefObject<Stage & Konva.Stage>
    constructor(props: UITrussProps) {
        super(props)
        this.state = {
            stageHeight: canvas.height,
            stageWidth: canvas.width,
            uiMode: UIModes.none,
            selectedEntityID: "",
            paintEntity: null,
        }
        this.UIonClick = this.UIonClick.bind(this)
        this.UIonDrag = this.UIonDrag.bind(this)
        this.UIonMouseMove = this.UIonMouseMove.bind(this)
        this.onKeyHandle = this.onKeyHandle.bind(this)
        this.selectEntity = this.selectEntity.bind(this)
        this.deleteEntity = this.deleteEntity.bind(this)
        this.clearFarm = this.clearFarm.bind(this)
        this.saveFarm = this.saveFarm.bind(this)
        this.calculate = this.calculate.bind(this)
        this.stage = React.createRef();
    }
    componentDidMount() {
        const { current: stage } = this.stage
        if (stage) {
            const container: HTMLDivElement = stage.attrs.container.parentElement.parentElement
            if (container) {
                container.scrollTop = (container.scrollHeight - container.offsetHeight) / 2
                container.scrollLeft = (container.scrollWidth - container.offsetWidth) / 2
            }
        }
    }

    UIonClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: TEntity) {
        const { uiMode, paintEntity } = this.state
        const { calculation } = this.props
        const isEmptyPlace = e.target.getStage() === e.target
        e.evt.preventDefault()
        if (e.evt.button === 0 && !calculation) {
            switch (uiMode) {
                case UIModes.none: {
                    if (!isEmptyPlace && entity) this.selectEntity(entity.id)
                    else this.selectEntity('')
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
                    if (!isEmptyPlace && entity instanceof TNode) {
                        const beam = this.props.addBeam({
                            coord: { ...entity.coord }
                        })
                        if (beam instanceof TBeam) {
                            const connectedBeam = this.props.connectBeamToNode(entity, beam, 'start')
                            if (connectedBeam instanceof TBeam) {
                                this.setState({
                                    paintEntity: connectedBeam,
                                    uiMode: UIModes.addBeamStart
                                })
                            }
                            else this.props.deleteEntity(beam.id)
                        }
                    }
                    break;
                }
                case UIModes.addBeamStart: {
                    if (!isEmptyPlace && entity instanceof TNode && paintEntity) {
                        if (this.props.connectBeamToNode(entity, paintEntity, 'end'))
                            this.setState({
                                uiMode: UIModes.addBeam,
                                paintEntity: null
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

            if (isEmptyPlace) this.setState({ selectedEntityID: "" })
        }



    }
    UIonMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const { calculation } = this.props
        if (calculation) return
        const { uiMode, paintEntity } = this.state
        const { layerX, layerY } = e.evt
        switch (uiMode) {
            case UIModes.addBeamStart: {
                if (e.target.getStage()) {
                    if (paintEntity) {
                        this.props.moveEndBeam(paintEntity, layerX, layerY)
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
    UIonDrag(e: Konva.KonvaEventObject<DragEvent>, entity: TEntity) {
        const { calculation } = this.props
        if (calculation) return
        const { uiMode } = this.state
        switch (uiMode) {
            case UIModes.move: {
                if (entity instanceof TNode) {
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
                this.setState({
                    uiMode: 0
                })
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
            paintEntity: null
        })
    }
    deleteEntity(entity: TEntity) {
        const { calculation } = this.props
        if (calculation) return
        if (this.state.selectedEntityID && this.state.selectedEntityID === entity.id)
            this.setState({
                selectedEntityID: ""
            })
        this.props.deleteEntity(entity.id)
    }
    selectEntity(id: string) {
        const { calculation } = this.props
        if (calculation) return
        if (id) this.setState({ selectedEntityID: id })
    }
    clearFarm(): void {
        if (window.confirm('Вы уверены, что хотите очистить холст?'))
            this.props.clearTruss()
    }
    saveFarm(e: React.FormEvent<HTMLButtonElement>) {
        if (window.confirm('Вы уверены, что хотите сохранить холст в кэш?'))
            this.props.cacheTruss()
    }
    calculate(e: React.FormEvent<HTMLButtonElement>) {
        this.props.calculate()
    }
    setSelectedMode(mode: UIModes) {
        const { calculation } = this.props
        if (calculation) return
        if (this.state.paintEntity)
            this.props.deleteEntity(this.state.paintEntity.id)
        this.setState({
            uiMode: mode || 0,
            paintEntity: null
        })
    }
    render() {
        const { stageHeight, stageWidth, uiMode, selectedEntityID } = this.state
        const { classes, farm, calculation, calculated } = this.props
        const selectedEntity: TEntity | null = selectedEntityID ? farm.beams.get(selectedEntityID) || farm.nodes.get(selectedEntityID) || null : null
        return (
            <Box className={classes.root}>
                <Stats isActive={true} />
                <KeyHandler
                    keyEventName={"keyup"}
                    keyValue={"Escape"}
                    onKeyHandle={this.onKeyHandle}
                />
                <UIHeader
                    hundleClear={this.clearFarm}
                    hundleSave={this.saveFarm}
                    hundleCalculate={this.calculate}
                    disabled={calculation} />

                <div className={classes.toolbar} />
                <Box className={classes.stageBox}>
                    <div className={classes.toolbar} />
                    <UITreePanel
                        nodes={farm.nodesArray}
                        beams={farm.beamsArray}
                        selectedEntityID={selectedEntityID}
                        onSelect={this.selectEntity}
                    />
                    <UIStage
                        onClick={this.UIonClick}
                        onDrag={this.UIonDrag}
                        onMouseMove={this.UIonMouseMove}
                        selectedEntity={selectedEntity}
                        stageHeight={stageHeight}
                        stageWidth={stageWidth}
                        nodes={farm.nodesArray}
                        beams={farm.beamsArray}
                        stage={this.stage}
                        uiMode={uiMode}
                        viewNewPos={calculated}
                    />
                    <UIEntityInfo
                        entity={farm.nodes.get(selectedEntityID) || farm.beams.get(selectedEntityID)}
                        onDelete={this.deleteEntity} />
                </Box>
                <UIToolPanel
                    selected={uiMode}
                    onSelect={this.setSelectedMode.bind(this)} />
            </Box>
        )
    }
}

export default withStyles(styles)(UITruss)