import * as React from 'react'
import { Theme, createStyles, withStyles, Box } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Stage, Layer, } from 'react-konva';
import { Entity } from 'src/models/Farm/ModelEntity';
import Konva from 'konva';
import UIGrid from './UIGrid';
import { consts } from 'src/static';
import ScrollBar from 'react-custom-scrollbars';
import { UIBeam, UINode } from '..';
import { UIModes } from 'src/utils/UI';
import { IFarm } from 'src/models/Farm/FarmTypes';

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: "#ddd",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    stage: {
        backgroundColor: "#fff",
        boxShadow: theme.shadows[2],
        borderRadius: 8,
    }
})

export interface UIStageProps extends IFarm, WithStyles<typeof styles> {
    uiMode: UIModes,
    selectedEntity: Entity | undefined,
    stageHeight: number,
    stageWidth: number,
    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: Entity): void,
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): void,
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: Entity): void,
    stage: React.RefObject<Stage & Konva.Stage>,
    viewNewPos: boolean
}

const UIStage: React.FC<UIStageProps> = ({ classes, stage, stageHeight, stageWidth, onClick, onMouseMove, onDrag, beams, nodes, uiMode, selectedEntity, viewNewPos }) => {
    return (
        <ScrollBar
            autoHide>
            <Box style={{ width: stageWidth + consts.UI.sidebarWidth * 2 + 20, height: stageHeight + consts.UI.sidebarWidth }}
                className={classes.root}>
                <Stage
                    height={stageHeight}
                    width={stageWidth}
                    style={{ height: stageHeight, width: stageWidth }}
                    className={classes.stage}
                    onClick={onClick}
                    onMouseMove={onMouseMove}
                    ref={stage}
                >

                    <Layer className="layer" >

                        <UIGrid
                            heightCell={consts.UI.cellSize}
                            widthCell={consts.UI.cellSize}
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

                        {viewNewPos && beams.map(beam => (
                            <UIBeam
                                key={beam.id}
                                beam={beam}
                                mode={uiMode}
                                onClick={onClick}
                                selected={selectedEntity === beam}
                                viewNewPos={true}
                            />
                        ))}
                        {viewNewPos && nodes.map(node => (
                            <UINode
                                key={node.id}
                                node={node}
                                mode={uiMode}
                                drag={onDrag}
                                onClick={onClick}
                                selected={selectedEntity === node}
                                viewNewPos={true}
                            />
                        ))}
                    </Layer>
                </Stage>
            </Box>

        </ScrollBar>



    )
}

export default withStyles(styles)(UIStage)