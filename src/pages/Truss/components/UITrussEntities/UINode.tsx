import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Arrow, Circle, Group, Line, Text } from 'react-konva';
import { NodeFixation } from 'src/models/Farm/ModelNode';
import { TForce, TNode } from 'src/models/Truss';
import { consts } from 'src/static';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';

const size = consts.UI.nodeSize
interface UINodeProps {
    node: TNode,
    drag?(e: Konva.KonvaEventObject<DragEvent>, node: TNode): void
    onClick?(e: Konva.KonvaEventObject<MouseEvent>, node: TNode): void
    mode?: UIModes,
    selected?: boolean,
    viewNewPos?: boolean
}
const UINode: React.FC<UINodeProps> = (observer(({
    node,
    onClick = () => { },
    mode = UIModes.none,
    selected = false,
    viewNewPos = false,
    drag = () => { }
}) => {
    const viewForce = (force: TForce) => {
        if (!viewNewPos) return (
            <React.Fragment>
                <Arrow
                    points={[
                        0,
                        0,
                        consts.UI.cellSize,
                        0,
                    ]}
                    stroke={UI.theme.palette.grey[300]}
                    strokeWidth={size / 3}
                    shadowBlur={2}
                    pointerLength={consts.UI.cellSize / 10}
                    pointerWidth={consts.UI.cellSize / 10}
                    hitStrokeWidth={size * 2}
                    rotation={force.value > 0 ? force.angle : 180 + force.angle}
                />
                <Text
                    x={force.angle === 0 ? (force.value > 0 ? consts.UI.cellSize / 3 : -consts.UI.cellSize) : consts.UI.cellSize / 3}
                    y={force.angle === 90 ? (force.value > 0 ? consts.UI.cellSize / 3 : -consts.UI.cellSize / 2) : -consts.UI.cellSize / 1.5}
                    text={force.value + " H"}
                />
            </React.Fragment>
        )
    }
    const viewFixation = (angle: 0 | 90) => {
        return (<Group
            x={0}
            y={0}
            rotation={angle}
        >
            <Line
                points={[
                    0, 0,
                    0, consts.UI.cellSize,
                    -consts.UI.cellSize / 2, consts.UI.cellSize,
                    consts.UI.cellSize / 2, consts.UI.cellSize,
                ]}
                stroke={UI.theme.palette.grey[300]}
                strokeWidth={size / 4}
                shadowBlur={2}
            />
            <Circle
                radius={size / 2}
                fill={UI.theme.palette.grey[500]}
                x={0}
                y={consts.UI.cellSize - (size / 1.7)}
            />
        </Group>)
    }

    if (viewNewPos) {
        if (node.dCoord.x === 0 && node.dCoord.y === 0)
            return <React.Fragment />
    }

    const x = viewNewPos ? (node.coord.x + node.dCoord.x) / consts.UI.koefOnGrid : node.coord.x / consts.UI.koefOnGrid
    const y = viewNewPos ? (node.coord.y + node.dCoord.y) / consts.UI.koefOnGrid : node.coord.y / consts.UI.koefOnGrid

    return (
        <Group
            opacity={viewNewPos ? 0.3 : 1}
            x={x}
            y={y}
            _useStrictMode
            onClick={viewNewPos ? () => { } : (e: any) => onClick(e, node)}
        >
            {node.forceX && viewForce(node.forceX)}
            {node.forceY && viewForce(node.forceY)}
            {node.fixation === NodeFixation.X && viewFixation(90)}
            {node.fixation === NodeFixation.Y && viewFixation(0)}
            {node.fixation === NodeFixation.XY && viewFixation(90)}
            {node.fixation === NodeFixation.YX && viewFixation(0)}
            <Circle
                radius={size}
                x={0}
                y={0}
                fill={UI.getNodeColor(node)}
                shadowBlur={selected && !viewNewPos ? 8 : 2}
                stroke={UI.getNodeStorkeColor(node, mode)}
                strokeWidth={UI.getNodeStorkeWidth(node, mode)}
                hitStrokeWidth={viewNewPos ? 0 : size * 2}
            />
            <Text
                x={-size}
                y={-size / 2 - 1}
                align="center"
                fontSize={18}
                fill="#fff"
                shadowBlur={8}
                fontFamily='Trebuchet MS'
                width={size * 2}
                verticalAlign="middle"
                text={node.name}
            />
            <Circle
                radius={size}
                x={0}
                y={0}
                onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                    e.target.to({
                        x: 0,
                        y: 0,
                    })
                }}
                hitStrokeWidth={viewNewPos ? 0 : size * 2}
                draggable={mode === UIModes.move && !node.isStatic && !viewNewPos}
                onMouseEnter={viewNewPos ? () => { } : (e: any) => UI.nodeMouseEnter(e, node, mode)}
                onMouseLeave={viewNewPos ? () => { } : (e: any) => UI.nodeMouseLeave(e)}
                onDragMove={(e: KonvaEventObject<DragEvent>) => drag(e, node)}
            />
        </Group>
    )

}))

export default UINode