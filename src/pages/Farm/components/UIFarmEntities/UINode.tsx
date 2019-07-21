import * as React from 'react'
import { Circle, Stage } from 'react-konva'
import Konva from 'konva'
import { Node } from 'src/models/Farm';
import { UIModes } from '../UIToolPanel';
import theme from 'src/theme';
import { consts } from 'src/static';

export interface UINodeProps {
    drag(e: Konva.KonvaEventObject<DragEvent>, node: Node): void
    onClick(e: Konva.KonvaEventObject<MouseEvent>, node: Node): void
    node: Node,
    mode: UIModes,
    selected: boolean
}

const UINode: React.FC<UINodeProps> = ({ node, drag, mode, onClick, selected }) => {

    const size = consts.UI_nodeSize

    const hundleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>, mode: UIModes) => {
        const stage: Stage & Konva.Stage = e.target.getStage()

        switch (mode) {
            case UIModes.delete:
            case UIModes.none: {
                stage.container().style.cursor = 'pointer'
                break
            }

            case UIModes.addBeam:
            case UIModes.addBeamStart: {
                stage.container().style.cursor = 'crosshair'
                break
            }
            case UIModes.move: {
                stage.container().style.cursor = 'move'
                break
            }

            default: {
                break;
            }
        }

    }
    const hundleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>, mode: UIModes) => {
        const stage: Stage & Konva.Stage = e.target.getStage()
        stage.container().style.cursor = 'default'
    }
    const getStorkeColor = (mode: UIModes):string => {
        switch (mode) {
            case UIModes.addBeam:
            case UIModes.addBeamStart:
            case UIModes.move:{
                return theme.palette.primary.light
            }
            default:
                return theme.palette.secondary.main
        }
    }
    const getStorkeWidth = (mode :UIModes):number => {
        switch (mode) {
            case UIModes.addBeam:
            case UIModes.addBeamStart:
            case UIModes.move:{
                return 2
            }
            default:
                return 0
        }

    }
    return (
        <React.Fragment
            key={node.id}>
            {/* <Text
                x={node.x - node.name.length*4}
                y={node.y-30}
                text={node.name}
                _useStrictMode 
            /> */}

            <Circle
                className="MyCircle"
                radius={size}
                x={node.x}
                y={node.y}
                fill={theme.palette.secondary.main}
                shadowBlur={selected ? 8 : 2}
                stroke={getStorkeColor(mode)}
                strokeWidth={getStorkeWidth(mode)}
            />
            <Circle

                radius={size * 2}
                x={node.x}
                y={node.y}
                draggable={mode === UIModes.move}
                _useStrictMode
                onDragMove={(e) => drag(e, node)}
                onClick={(e) => onClick(e, node)}
                onMouseEnter={(e) => hundleMouseEnter(e, mode)}
                onMouseLeave={(e) => hundleMouseLeave(e, mode)}
            />
        </React.Fragment>
    )
}

export default UINode