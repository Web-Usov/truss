import { Box, createStyles, Theme, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import Konva from 'konva';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import ScrollBar from 'react-custom-scrollbars';
import { Layer, Stage } from 'react-konva';
import { TEntity } from 'src/models/Truss';
import { ITrussArray } from 'src/models/Truss/TTypes';
import { consts } from 'src/static';
import { UIModes } from 'src/utils/UI';
import { UIBeam, UINode } from '..';
import UIGrid from './UIGrid';

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

export interface UIStageProps extends ITrussArray, WithStyles<typeof styles> {
    uiMode: UIModes,
    selectedEntity: TEntity | null,
    stageHeight: number,
    stageWidth: number,
    onClick(e: Konva.KonvaEventObject<MouseEvent>, entity?: TEntity): void,
    onMouseMove(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>): void,
    onDrag(e: Konva.KonvaEventObject<DragEvent>, entity: TEntity): void,
    stage: React.RefObject<Stage & Konva.Stage>,
    viewNewPos: boolean,
}

const UIStage: React.FC<UIStageProps> = (observer(({ classes, stage, stageHeight, stageWidth, onClick, onMouseMove, onDrag, beams, nodes, uiMode, selectedEntity, viewNewPos }) => {
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
}))

export default withStyles(styles)(UIStage)