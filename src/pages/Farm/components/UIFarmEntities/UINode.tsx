import * as React from 'react'
import { Circle, Stage, Text, Group, Arrow } from 'react-konva'
import Konva from 'konva'
import { Node } from 'src/models/Farm';
import { UIModes } from '../UIToolPanel';
import theme from 'src/theme';
import { consts } from 'src/static';
import { Force } from 'src/models/Farm/ModelForce';

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
                if (node.isStatic) {
                    stage.container().style.cursor = 'default'
                    break
                } 
            case UIModes.none: {
                stage.container().style.cursor = 'pointer'
                break;
            }

            case UIModes.addBeam:
            case UIModes.addBeamStart: {
                stage.container().style.cursor = 'crosshair'
                break
            }
            case UIModes.move: {
                if (node.isStatic) {
                    stage.container().style.cursor = 'default'
                    break
                }
                stage.container().style.cursor = 'move'
                break
            }

            default: {
                break;
            }
        }

    }
    const hundleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage: Stage & Konva.Stage = e.target.getStage()
        if(stage) stage.container().style.cursor = 'default'
    }
    const getStorkeColor = (): string => {
        switch (mode) {
            case UIModes.move:
                if (node.isStatic) return theme.palette.secondary.dark
            case UIModes.addBeam:
            case UIModes.addBeamStart: {
                return theme.palette.primary.light
            }
            default:
                return theme.palette.secondary.main
        }
    }
    const getStorkeWidth = (): number => {
        switch (mode) {
            case UIModes.move:
                if (node.isStatic) return 0
            case UIModes.addBeam:
            case UIModes.addBeamStart: {
                return 2
            }
            default:
                return 0
        }

    }
    const getFillColor = (): string => {
        if (node.isStatic) return theme.palette.secondary.dark
        return theme.palette.secondary.main

    }
    const viewForce = (force: Force) => {
        return (
            <React.Fragment>

                <Arrow
                    points={[
                        0,
                        0,
                        consts.UI_cellSize,
                        0,
                    ]}
                    stroke={theme.palette.grey[300]}
                    strokeWidth={size / 3}
                    shadowBlur={2}
                    pointerLength={consts.UI_cellSize / 10}
                    pointerWidth={consts.UI_cellSize / 10}
                    hitStrokeWidth={size * 2}

                    // lineCap='round'
                    // lineJoin='round'
                    rotation={force.value > 0 ? force.angle : 180 + force.angle}
                />
                <Text
                    x={force.angle === 0 ? (force.value > 0 ? consts.UI_cellSize / 3 : -consts.UI_cellSize) : consts.UI_cellSize / 3 }
                    y={force.angle === 90 ? (force.value > 0 ? consts.UI_cellSize / 3 : -consts.UI_cellSize / 2) : -consts.UI_cellSize / 1.5 }
                    text={force.value + "H"}
                />
            </React.Fragment>

        )
    }
    return (
        <React.Fragment>
            <Group
                x={node.x}
                y={node.y}
            >
                {node.forceX && viewForce(node.forceX)}
                {node.forceY && viewForce(node.forceY)}
                <Circle
                    className="MyCircle"
                    radius={size}
                    x={0}
                    y={0}
                    fill={getFillColor()}
                    shadowBlur={selected ? 8 : 2}
                    stroke={getStorkeColor()}
                    strokeWidth={getStorkeWidth()}

                    hitStrokeWidth={size * 2}
                    draggable={mode === UIModes.move && !node.isStatic}
                    _useStrictMode
                    onDragMove={(e) => drag(e, node)}
                    onClick={(e) => onClick(e, node)}
                    onMouseEnter={(e) => hundleMouseEnter(e, mode)}
                    onMouseLeave={(e) => hundleMouseLeave(e)}
                />

                {/* <Text
                x={node.x - node.name.length*4}
                y={node.y-30}
                text={node.name}
                _useStrictMode 
            /> */}
            </Group>


        </React.Fragment>
    )
}

export default UINode