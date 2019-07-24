import * as React from 'react'
import KeyHandler from 'react-key-handler'
import Konva from "konva"
import { Stage } from "react-konva"
import { createStyles, Theme, WithStyles, withStyles, Box } from '@material-ui/core';
import { IFarmStore } from './farmReducer';
import { Farm, Node, Beam, Entity } from 'src/models/Farm';
import { UITreePanel, UIEntityInfo, UIStage, UIHeader } from './components';
import UIToolPanel, { UIModes } from './components/UIToolPanel';
import { MyMath } from 'src/utils';
import CreateDefaultFarm from './_testFarm'


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
    constructor(props: UIFarmProps){
        super(props)

        this.state = {
            stageHeight: 100,
            stageWidth: 100,
            farm: CreateDefaultFarm.call(this),
            uiMode: UIModes.none,
            selectedEntity: undefined,
            paintEntity: undefined,

        }
        console.log("PAP", this.state.farm);
        
        this.onClick = this.onClick.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.setFarm = this.setFarm.bind(this)
        this.updateFarm = this.updateFarm.bind(this)
        this.onKeyHandle = this.onKeyHandle.bind(this)
        this._setStageSize = this._setStageSize.bind(this)
        this.deleteEntity = this.deleteEntity.bind(this)
        this.selectEntity = this.selectEntity.bind(this)
        this.clearFarm = this.clearFarm.bind(this)

        this.stage = React.createRef();
    }
    componentWillMount(){
        this._setStageSize()

    }
    componentDidMount() {
        window.addEventListener('resize', this._setStageSize)
        const { current: stage } = this.stage
        if (stage) {
            const container : HTMLDivElement = stage.attrs.container.parentElement            
            if(container){             
                container.scrollTop = (container.scrollHeight - container.offsetHeight) / 2
                container.scrollLeft = (container.scrollWidth - container.offsetWidth) / 2
            }
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this._setStageSize)
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
        const { uiMode, farm } = this.state
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
                        farm.addNode(cellX, cellY, 0)

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
                        this.deleteEntity(entity)
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
                if(e.target.getStage()){
                    if (paintEntity && paintEntity instanceof Beam) {
                        const beam = paintEntity
                        beam.moveEndPoint(layerX, layerY)
                    } else this.setState({ uiMode: UIModes.addBeam })
                    this.updateFarm(farm)
                }
                break;
            }
            case UIModes.delete:{                
                const stage: Stage & Konva.Stage = e.target.getStage()
                if(stage === e.target){                    
                    stage.container().style.cursor = 'default'
                }
                break;
            }
            default:
                break;
        }
    }
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Entity) {
        const { farm, uiMode } = this.state
        switch (uiMode) {
            case UIModes.move:{
                if (entity instanceof Node) {
                    if (e.evt.defaultPrevented) {                        
                        const { layerX, layerY } = e.evt
                        farm.moveNodeTo(entity.id, MyMath.cellX(layerX), MyMath.cellY(layerY))
                        this.updateFarm(farm)
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
    _setStageSize(e?: UIEvent) {
        this.setState({
            stageHeight: window.innerHeight * 1.5,
            stageWidth: window.innerWidth * 1.5
        })
    }
    selectEntity(entity:Entity | undefined){
        if (entity) this.setState({ selectedEntity: entity })
    }
    deleteEntity(entity: Entity) {

        this.setState({ selectedEntity: undefined })
        this.state.farm.deleteEntity(entity)
        this.updateFarm(this.state.farm)
    }
    clearFarm():void{
        if (window.confirm('Выуверены, что хотите очистить холст?')) {
            this.setState({farm: CreateDefaultFarm()})
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
                <UIHeader
                    hundleClear={this.clearFarm}/>

                <div className={classes.toolbar} />
                <Box className={classes.stageBox}>
                    <div className={classes.toolbar} />
                    
                    <UITreePanel
                        nodes={farm.getNodes()}
                        beams={farm.getBeams()}
                        selectedEntity={selectedEntity}
                        onSelect={this.selectEntity}
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