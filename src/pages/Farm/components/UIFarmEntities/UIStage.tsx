import * as React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Stage, Layer, } from 'react-konva';
import {  Entity } from 'src/models/Farm/ModelEntity';
import { UIModes } from '../UIToolPanel';
import Konva from 'konva';
import UIGrid from './UIGrid';
import { consts } from 'src/static';
import ScrollBar from 'react-custom-scrollbars';
import { FarmNode } from 'src/models/Farm/ModelNode';
import { Beam } from 'src/models/Farm/ModelBeam';
import { Force } from 'src/models/Farm/ModelForce';
import { UIBeam, UINode } from '..';

const styles = (theme: Theme) => createStyles({
    root:{
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    stage: {
        backgroundColor: "#fff",
    }
})


export interface UIStageProps extends WithStyles<typeof styles> {
    nodes: FarmNode[],
    beams: Beam[],
    forces: Force[],
    uiMode: UIModes,
    selectedEntity: Entity | undefined,
    stageHeight: number,
    stageWidth: number,
    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Entity): void,
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): void,
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Entity): void,
    stage: React.RefObject<Stage & Konva.Stage>
}

const UIStage: React.FC<UIStageProps> = ({ classes, stage, stageHeight, stageWidth, onClick, onMouseMove, onDrag, forces,beams,nodes, uiMode, selectedEntity }) => {
    return (
        <ScrollBar 
            className={classes.root}
            autoHide>
            <Stage
                height={stageHeight}
                width={stageWidth}
                style={{height:stageHeight, width:stageWidth}}
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
                    {beams.map(beam => (
                        <UIBeam
                            key={beam.id}
                            beam={beam}
                            mode={uiMode}
                            onClick={onClick}
                            selected={selectedEntity === beam}
                        />
                    ))}

                    {nodes.map(node => (
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
        </ScrollBar>



    )
}

export default withStyles(styles)(UIStage)