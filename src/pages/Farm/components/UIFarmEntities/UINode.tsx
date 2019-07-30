import * as React from 'react'
import { Circle, Stage, Text, Group, Arrow, Line } from 'react-konva'
import Konva from 'konva'
import { FarmNode } from 'src/models/Farm/ModelNode';
import { UIModes } from '../UIToolPanel';
import theme from 'src/theme';
import { consts } from 'src/static';
import { Force } from 'src/models/Farm/ModelForce';
import { KonvaEventObject } from 'konva/types/Node';

const size = consts.UI_nodeSize
interface UINodeProps {
    node: FarmNode,
    drag(e: Konva.KonvaEventObject<DragEvent>, node: FarmNode): void
    onClick(e: Konva.KonvaEventObject<MouseEvent>, node: FarmNode): void
    mode: UIModes,
    selected: boolean
}
class UINode extends React.Component<UINodeProps>{
    constructor(props: UINodeProps) {
        super(props)
        this.hundleMouseEnter = this.hundleMouseEnter.bind(this)
        this.hundleMouseLeave = this.hundleMouseLeave.bind(this)
        this.getStorkeColor = this.getStorkeColor.bind(this)
        this.getStorkeWidth = this.getStorkeWidth.bind(this)
        this.getFillColor = this.getFillColor.bind(this)
        this.viewForce = this.viewForce.bind(this)
    }
    hundleMouseEnter(e: Konva.KonvaEventObject<MouseEvent>, mode: UIModes) {
        const stage: typeof Stage & Konva.Stage = e.target.getStage()
        const { node } = this.props

        switch (mode) {
            case UIModes.delete:
                if (node.isStatic) {
                    stage.container().style.cursor = 'default'
                    break
                }
                stage.container().style.cursor = 'pointer'
                break
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
    hundleMouseLeave(e: Konva.KonvaEventObject<MouseEvent>) {
        const stage: typeof Stage & Konva.Stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'default'
    }
    getStorkeColor(): string {
        const { mode, node } = this.props
        switch (mode) {
            case UIModes.move: {
                if (node.isStatic) return theme.palette.secondary.dark
                return theme.palette.primary.light
            }
            case UIModes.addBeam:
            case UIModes.addBeamStart: {
                return theme.palette.primary.light
            }
            default:
                return theme.palette.secondary.main
        }
    }
    getStorkeWidth(): number {
        const { mode } = this.props
        const { node } = this.props
        switch (mode) {
            case UIModes.move: {
                if (node.isStatic) return 0
                return 2
            }
            case UIModes.addBeam:
            case UIModes.addBeamStart: {
                return 2
            }
            default:
                return 0
        }

    }
    getFillColor(): string {
        const { node } = this.props
        if (node.isStatic) {
            if (node.isFixed) return theme.palette.secondary.dark
            return theme.palette.secondary.light
        }
        return theme.palette.secondary.main

    }
    viewForce(force: Force) {
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
                    rotation={force.value > 0 ? force.angle : 180 + force.angle}
                />
                <Text
                    x={force.angle === 0 ? (force.value > 0 ? consts.UI_cellSize / 3 : -consts.UI_cellSize) : consts.UI_cellSize / 3}
                    y={force.angle === 90 ? (force.value > 0 ? consts.UI_cellSize / 3 : -consts.UI_cellSize / 2) : -consts.UI_cellSize / 1.5}
                    text={force.value + "H"}
                />
            </React.Fragment>

        )
    }
    viewFixation(angle: 0 | 90) {

        const {node} = this.props
        return (<Group
                x={0}
                y={0}
                rotation={angle}
            >
            <Line
                points={[
                    0, 0,
                    0, consts.UI_cellSize,
                    -consts.UI_cellSize / 2,  consts.UI_cellSize,
                    consts.UI_cellSize / 2,  consts.UI_cellSize,
                ]}
                stroke={theme.palette.grey[300]}
                strokeWidth={size / 4}
                shadowBlur={2}
            />
            <Circle
                radius={size / 2}
                fill={theme.palette.grey[500]}
                x={0}
                y={consts.UI_cellSize - (size/1.7)}
            />
        </Group>)
    }
    shouldComponentUpdate(nextProps: UINodeProps) {
        return (
            nextProps.node !== this.props.node ||
            nextProps.mode !== this.props.mode ||
            nextProps.selected !== this.props.selected
        )
    }
    render() {
        const { onClick, mode, selected, node } = this.props

        return (
            <Group
                x={node.x}
                y={node.y}
                _useStrictMode
                onClick={(e: any) => onClick(e, node)}
            >
                {node.forceX && this.viewForce(node.forceX)}
                {node.forceY && this.viewForce(node.forceY)}
                {node.isFixed === 'x' && this.viewFixation(90)}
                {node.isFixed === 'y' && this.viewFixation(0)}
                {node.isFixed === 'xy' && this.viewFixation(90)}
                {node.isFixed === 'xy' && this.viewFixation(0)}
                <Circle
                    radius={size}
                    x={0}
                    y={0}
                    fill={this.getFillColor()}
                    shadowBlur={selected ? 8 : 2}
                    stroke={this.getStorkeColor()}
                    strokeWidth={this.getStorkeWidth()}

                    hitStrokeWidth={size * 2}
                />
                <Circle
                    radius={size}
                    x={node.x - node.x}
                    y={node.y - node.y}
                    onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                        e.target.to({
                            x: 0,
                            y: 0,
                        })
                    }}
                    hitStrokeWidth={size * 2}
                    draggable={mode === UIModes.move && !node.isStatic}
                    onMouseEnter={(e: any) => this.hundleMouseEnter(e, mode)}
                    onMouseLeave={(e: any) => this.hundleMouseLeave(e)}
                    onDragMove={(e: KonvaEventObject<DragEvent>) => this.props.drag(e, node)}
                />
            </Group>
        )
    }
}

export default UINode