import * as React from 'react'
import { IFarmStore } from './farmReducer';
import { Stage, Layer } from "react-konva"
import Konva from "konva"
import './style.css'
import { Farm, Node } from 'src/models/Farm';
import UINode from './components/UINode';
import UIBeam from './components/UIBeam';
import UIToolBar, { UIModes } from './components/UIToolBar';
import { Beam } from 'src/models/Farm/ModelBeam';
import { Entity } from 'src/models/Farm/ModelEntity';
import KeyHandler from 'react-key-handler'
import { createStyles, Theme, WithStyles, withStyles, Box } from '@material-ui/core';
import UIStage from './components/UIStage';
import { UITreePanel, UIEntityInfo } from './components';


const styles = (theme: Theme) => createStyles({
    root: {
        width: window.innerWidth,
        height: window.innerHeight,
        maxHeight: window.innerHeight,
        overflow: "hidden",
        background: theme.palette.background.default,
        // padding: theme.spacing(4),
        display: "flex",
        flexDirection: "column",
        // borderRadius:18,
    },
    stageBox: {
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden'
    }
})

export interface UIFarmProps extends IFarmStore, WithStyles<typeof styles> {
    update: (workSpace: Farm) => void
}

export interface UIFarmState {
    stageWidth: number,
    stageHeight: number,
    farm: Farm,
    uiMode: UIModes,
    selectedEntity: Entity | undefined,
    paintEntity: Entity | undefined
}



class UIFarm extends React.Component<UIFarmProps, UIFarmState>{
    private stage: React.RefObject<Stage & Konva.Stage>
    constructor(props: UIFarmProps) {
        super(props)

        this.state = {
            stageHeight: 100,
            stageWidth: 100,
            farm: props.workSpace,
            uiMode: UIModes.none,
            selectedEntity: undefined,
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
    componentDidMount() {
        this.setStageSize()
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

    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Entity) {
        const { uiMode, farm, selectedEntity } = this.state
        const isEmptyPlace = e.target.getStage() === e.target
        e.evt.preventDefault()

        if (e.evt.button === 0) {
            switch (uiMode) {
                case UIModes.none: {
                    if (!isEmptyPlace) {
                        if (entity) this.setState({ selectedEntity: entity })
                    } else this.setState({ selectedEntity: undefined })

                    break;
                }
                case UIModes.addNode: {
                    if (isEmptyPlace) {
                        const { layerX, layerY } = e.evt
                        farm.addNode(layerX, layerY, 0)

                        this.updateFarm(farm)
                    }
                    break;
                }
                case UIModes.addBeam: {
                    if (!isEmptyPlace && entity instanceof Node) {

                        const beam = farm.addBeam(entity.x, entity.y)
                        farm.connectBeamToNode(beam, entity)
                        this.setState({
                            paintEntity: beam,
                            uiMode: UIModes.addBeamStart
                        })

                        this.updateFarm(farm)
                    }
                    break;
                }
                case UIModes.addBeamStart: {
                    if (!isEmptyPlace && entity instanceof Node && this.state.paintEntity instanceof Beam) {
                        const beam = this.state.paintEntity
                        if (farm.connectBeamToNode(beam, entity, 'end'))
                            this.setState({
                                uiMode: UIModes.addBeam,
                                paintEntity: undefined
                            })

                        this.updateFarm(farm)
                    }
                    break;
                }
                case UIModes.delete: {
                    if (!isEmptyPlace && entity) {
                        if (selectedEntity === entity) this.setState({ selectedEntity: undefined })
                        farm.deleteEntity(entity)
                        this.updateFarm(farm)
                    }
                    break;
                }
                default:
                    break;
            }
        }


        // if (isEmptyPlace) this.setState({ selectedEntity: undefined })

    }
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
        const { uiMode, farm, paintEntity } = this.state
        const { layerX, layerY } = e.evt
        switch (uiMode) {
            case UIModes.addBeamStart: {
                if (paintEntity && paintEntity instanceof Beam) {
                    const beam = paintEntity
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
            if (uiMode === UIModes.move) {
                farm.moveNodeTo(entity.id, e.evt.layerX, e.evt.layerY)
                this.updateFarm(farm)
            }
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
    setSelectMode(mode: UIModes) {
        this.deletePaintEntity()
        this.setState({
            uiMode: mode || 0,
        })
    }
    deletePaintEntity() {

        const { uiMode, paintEntity, farm } = this.state
        if (uiMode === UIModes.addBeamStart && paintEntity) {
            farm.deleteEntity(paintEntity)
            this.setState({
                paintEntity: undefined,
            })
            this.updateFarm(farm)
        }
    }
    setStageSize(e?: UIEvent) {
        const { current: stage } = this.stage
        if (stage) {
            const container: HTMLDivElement = stage.attrs.container
            const { clientWidth, clientHeight } = container
            this.setState({
                stageHeight: clientHeight,
                stageWidth: clientWidth
            })
        }
    }
    render() {
        const { stageHeight, stageWidth, farm, uiMode, selectedEntity } = this.state
        const { classes } = this.props
        return (
            <Box className={classes.root}>
                <KeyHandler
                    keyEventName={"keyup"}
                    keyValue={"Escape"}
                    onKeyHandle={this.onKeyHandle}
                />
                <UIToolBar
                    selected={uiMode}
                    onSelect={this.setSelectMode.bind(this)} />

                <Box className={classes.stageBox}>
                    <UITreePanel
                        nodes={farm.getNodes()}
                        beams={farm.getBeams()}
                    />
                    <UIStage
                        onClick={this.onClick}
                        onDrag={this.onDrag}
                        onMouseMove={this.onMouseMove}
                        stageHeight={stageHeight}
                        stageWidth={stageWidth}
                        farm={farm}
                        stage={this.stage}
                        selectedEntity={selectedEntity}
                        uiMode={uiMode}
                    />
                    <UIEntityInfo
                        entity={selectedEntity} />
                </Box>


            </Box>
        )
    }
}

export default withStyles(styles)(UIFarm)