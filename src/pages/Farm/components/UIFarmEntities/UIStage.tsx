import * as React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Stage, Layer, } from 'react-konva';
import { UINode, UIBeam } from '..';
import { Farm, Entity } from 'src/models/Farm';
import { UIModes } from '../UIToolBar';
import Konva from 'konva';
import UIGrid from './UIGrid';
import { consts } from 'src/static';

const styles = (theme: Theme) => createStyles({
    stage: {
        backgroundColor: "#fff",
        // width:"100%",
        flexGrow: 1
    }
})


export interface UIStageProps extends WithStyles<typeof styles> {
    farm:Farm,
    uiMode:UIModes,
    selectedEntity:Entity | undefined,
    stageHeight:number,
    stageWidth:number,
    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Entity):void,
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent>):void,
    onDrag(e:Konva.KonvaEventObject<DragEvent>, entity:Entity):void,
    stage:React.RefObject<Stage & Konva.Stage>
}

const UIStage: React.FC<UIStageProps> = ({classes, stage, stageHeight,stageWidth, onClick, onMouseMove, onDrag, farm, uiMode,selectedEntity }) => {
    return (
        <Stage
            height={stageHeight}
            width={stageWidth}
            className={classes.stage}
            onClick={onClick}
            onMouseMove={onMouseMove}
            ref={stage}
        >

            <Layer className="layer" >
                <UIGrid 
                    heightCell={consts.UI_cellSize}
                    widthCell={consts.UI_cellSize}
                    heightBox={stageHeight}
                    widthBox={stageWidth}
                />
                {farm.getBeams().map(beam => (
                    <UIBeam
                        key={beam.id}
                        beam={beam}
                        mode={uiMode}
                        onClick={onClick}
                        selected={selectedEntity === beam}
                    />
                ))}

                {farm.getNodes().map(node => (
                    <UINode
                        key={node.id}
                        node={node}
                        mode={uiMode}
                        drag={onDrag}
                        onClick={onClick}
                        selected={selectedEntity === node}
                    />
                ))}
            </Layer>
        </Stage>


    )
}

export default withStyles(styles)(UIStage)