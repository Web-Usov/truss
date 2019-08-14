import * as React from 'react'
import KeyHandler from 'react-key-handler'
import Konva from "konva"
import { Stage } from "react-konva"
import { createStyles, Theme, WithStyles, withStyles, Box } from '@material-ui/core';
import { UITreePanel, UIEntityInfo, UIStage, UIHeader, UIToolPanel } from '.';
import { MyMath } from 'src/utils';
import Stats from 'react-stats'
import { UIModes } from 'src/utils/UI';
import {  canvas} from 'src/static/const';
import {TrussContainer} from '../TrussContainer';
import { Truss, TEntity, TNode, TBeam } from 'src/models/Truss';

import { observer} from "mobx-react";



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

export interface UITrussProps extends  WithStyles<typeof styles> {
    farm:typeof Truss,
    addNode: typeof TrussContainer.prototype.addNode,
    addBeam: typeof TrussContainer.prototype.addBeam,
    moveNode: typeof TrussContainer.prototype.moveNode,
    moveEndBeam: typeof TrussContainer.prototype.moveEndBeam,
    connectBeamToNode: typeof TrussContainer.prototype.connectBeamToNode,
    // deleteEntity: typeof FarmContainer.prototype.deleteEntity
    // defautlFarm: typeof FarmContainer.prototype.defautlFarm
    // saveFarm: typeof FarmContainer.prototype.saveFarm,
    // calculateFarm: typeof FarmContainer.prototype.calculateFarm
    calculation: boolean,
    calculated: boolean,
}

export interface UITrussState {
    stageWidth: number,
    stageHeight: number,
    uiMode: UIModes,
    // selectedEntityID: string,
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
            // selectedEntityID: "",
            paintEntity: null,
        }
        this.UIonClick = this.UIonClick.bind(this)
        this.UIonDrag = this.UIonDrag.bind(this)
        this.UIonMouseMove = this.UIonMouseMove.bind(this)
        // this.onKeyHandle = this.onKeyHandle.bind(this)
        // this.selectEntity = this.selectEntity.bind(this)
        // this.clearFarm = this.clearFarm.bind(this)
        // this.deleteEntity = this.deleteEntity.bind(this)
        // this.saveFarm = this.saveFarm.bind(this)
        // this.calculateFarm = this.calculateFarm.bind(this)
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
                // case UIModes.none: {
                //     if (!isEmptyPlace) {
                //         this.selectEntity(entity);
                //     } else this.setState({ selectedEntityID: "" })

                //     break;
                // }
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
                            coord:entity.coord
                        })
                        if (beam instanceof TBeam) {
                            const connectedBeam = this.props.connectBeamToNode(entity, beam, 'start')
                            if (connectedBeam instanceof TBeam)
                                this.setState({
                                    paintEntity: connectedBeam,
                                    uiMode: UIModes.addBeamStart
                                })
                            // else this.props.deleteEntity(beam.id)
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
                // case UIModes.delete: {
                //     if (!isEmptyPlace && entity) {
                //         this.deleteEntity(entity)
                //     }
                //     break;
                // }
                default:
                    break;
            }
            
            // if (isEmptyPlace) this.setState({ selectedEntityID: "" })
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
    // onKeyHandle(e: KeyboardEvent) {
    //     switch (e.key) {
    //         case "Escape": {
    //             this.deletePaintEntity()
    //             this.setState({
    //                 uiMode:0
    //             })
    //             break;
    //         }
    //         default:
    //             break;
    //     }
    // }
    // deletePaintEntity() {
    //     if (this.state.paintEntity)
    //         this.props.deleteEntity(this.state.paintEntity.id)
    //     this.setState({
    //         paintEntity: undefined
    //     })
    // }
    // deleteEntity(entity: Entity) {
    //     const { calculation } = this.props
    //     if (calculation) return
    //     if (this.state.selectedEntityID && this.state.selectedEntityID === entity.id)
    //         this.setState({
    //             selectedEntityID: ""
    //         })
    //     this.props.deleteEntity(entity.id)
    // }
    // selectEntity(entity: Entity | undefined) {
    //     const { calculation } = this.props
    //     if (calculation) return
    //     if (entity) this.setState({ selectedEntityID: entity.id })
    // }
    // clearFarm(): void {
    //     if (window.confirm('Вы уверены, что хотите очистить холст?'))
    //         this.props.defautlFarm()
    // }
    // saveFarm(e: React.FormEvent<HTMLButtonElement>) {
    //     if (window.confirm('Вы уверены, что хотите сохранить холст в кэш?'))
    //         this.props.saveFarm()
    // }
    // calculateFarm(e: React.FormEvent<HTMLButtonElement>) {
    //     this.props.calculateFarm()
    // }
    setSelectedMode(mode: UIModes) {
        const { calculation } = this.props
        if (calculation) return
        // if (this.state.paintEntity)
        //     this.props.deleteEntity(this.state.paintEntity.id)
        this.setState({
            uiMode: mode || 0,
            // paintEntity: undefined
        })
    }
    render() {
        const { stageHeight, stageWidth, uiMode,}  = this.state
        const { classes, farm,  calculation, calculated } = this.props
        // const selectedEntity = ([...nodes,...beams].find(item => item.id === selectedEntityID) as Entity)
        return (
            <Box className={classes.root}>
                <Stats isActive={true} />
                {/* <KeyHandler
                    keyEventName={"keyup"}
                    keyValue={"Escape"}
                    onKeyHandle={this.onKeyHandle}
                /> */}
                <UIHeader
                    // hundleClear={this.clearFarm}
                    // hundleSave={this.saveFarm}
                    // hundleCalculate={this.calculateFarm}
                    disabled={calculation} />

                <div className={classes.toolbar} />
                <Box className={classes.stageBox}>
                    <div className={classes.toolbar} />
                    {/* <UITreePanel
                        nodes={nodes}
                        beams={beams}
                        selectedEntity={selectedEntity}
                        onSelect={this.selectEntity}
                    /> */}
                    <UIStage
                        onClick={this.UIonClick}
                        onDrag={this.UIonDrag}
                        // onMouseMove={this.UIonMouseMove}
                        // selectedEntity={selectedEntity}
                        // onDrag={() => {}}
                        onMouseMove={() => {}}
                        selectedEntity={undefined}
                        stageHeight={stageHeight}
                        stageWidth={stageWidth}
                        nodes={farm.nodesArray}
                        beams={farm.beamsArray}
                        stage={this.stage}
                        uiMode={uiMode}
                        viewNewPos={calculated}
                    />
                    {/* <UIEntityInfo
                        entity={selectedEntity}
                        onDelete={this.deleteEntity} /> */}
                </Box>
                <UIToolPanel
                    selected={uiMode}
                    onSelect={this.setSelectedMode.bind(this)} />
            </Box>
        )
    }
}

export default withStyles(styles)(UITruss)