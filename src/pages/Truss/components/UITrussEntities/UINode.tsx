import * as React from 'react'
import { Circle,  Text, Group, Arrow, Line } from 'react-konva'
import Konva from 'konva'
import { consts } from 'src/static';
import { KonvaEventObject } from 'konva/types/Node';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';
import { TNode, TForce } from 'src/models/Truss';
import { NodeFixation } from 'src/models/Truss/TTypes';
import { observer } from 'mobx-react';

const size = consts.UI.nodeSize
interface UINodeProps {
    node: TNode,
    drag(e: Konva.KonvaEventObject<DragEvent>, node: TNode): void
    onClick(e: Konva.KonvaEventObject<MouseEvent>, node: TNode): void
    mode: UIModes,
    selected: boolean,    
    viewNewPos?:boolean
}
const UINode : React.FC<UINodeProps> = (observer((props) => {
    {
        const { onClick, mode, selected, node, viewNewPos,drag } = props
        const x =  node.coord.x / consts.UI.koefOnGrid
        const y =  node.coord.y / consts.UI.koefOnGrid
        console.log("Node "+node.id);
        if(viewNewPos){
            if(node.dCoord.x === 0 && node.dCoord.y === 0)
            return <React.Fragment/>
        }

        return (
            <Group
            
                opacity={viewNewPos ? 0.3 : 1}
                x={x}
                y={y}
                _useStrictMode
                onClick={viewNewPos ? () => {} : (e: any) => onClick(e, node)}
                
            >
                <Circle
                    radius={size}
                    x={0}
                    y={0}
                    fill={UI.getNodeColor(node)}
                    shadowBlur={selected && !viewNewPos ? 8 : 2}
                    stroke={UI.getNodeStorkeColor(node,mode)}
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
                    onMouseEnter={viewNewPos ? () => {} : (e: any) => UI.nodeMouseEnter(e, node, mode)}
                    onMouseLeave={viewNewPos ? () => {} :(e: any) => UI.nodeMouseLeave(e)}
                    onDragMove={(e: KonvaEventObject<DragEvent>) => drag(e, node)}
                />
            </Group>
        )
    }
}))
export default UINode