import * as React from 'react'
import { Circle,  Text, Group, Arrow, Line } from 'react-konva'
import Konva from 'konva'
import { FarmNode } from 'src/models/Farm/ModelNode';
import theme from 'src/theme';
import { consts } from 'src/static';
import { Force } from 'src/models/Farm/ModelForce';
import { KonvaEventObject } from 'konva/types/Node';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';

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
        this.viewForce = this.viewForce.bind(this)
    }
    shouldComponentUpdate(nextProps: UINodeProps) {
        return (
            nextProps.node !== this.props.node ||
            nextProps.mode !== this.props.mode ||
            nextProps.selected !== this.props.selected
        )
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

        return (<Group
            x={0}
            y={0}
            rotation={angle}
        >
            <Line
                points={[
                    0, 0,
                    0, consts.UI_cellSize,
                    -consts.UI_cellSize / 2, consts.UI_cellSize,
                    consts.UI_cellSize / 2, consts.UI_cellSize,
                ]}
                stroke={theme.palette.grey[300]}
                strokeWidth={size / 4}
                shadowBlur={2}
            />
            <Circle
                radius={size / 2}
                fill={theme.palette.grey[500]}
                x={0}
                y={consts.UI_cellSize - (size / 1.7)}
            />
        </Group>)
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
                    fill={UI.getNodeColor(node)}
                    shadowBlur={selected ? 8 : 2}
                    stroke={UI.getNodeStorkeColor(node,mode)}
                    strokeWidth={UI.getNodeStorkeWidth(node, mode)}

                    hitStrokeWidth={size * 2}
                />
                <Text
                    x={-size}
                    y={-size / 2 - 1}
                    align="center"
                    fontSize={18}
                    fill="#fff"
                    shadowBlur={8}
                    // stroke="#555"
                    // strokeWidth={0.1}
                    fontFamily='Trebuchet MS'
                    width={size * 2}
                    verticalAlign="middle"
                    text={node.name}
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
                    onMouseEnter={(e: any) => UI.nodeMouseEnter(e, node, mode)}
                    onMouseLeave={(e: any) => UI.nodeMouseLeave(e)}
                    onDragMove={(e: KonvaEventObject<DragEvent>) => this.props.drag(e, node)}
                />
            </Group>
        )
    }
}
export default UINode