import * as React from 'react'
import { Circle, Text } from 'react-konva'
import Konva from 'konva'
import { Node } from 'src/models/Farm';
import { UIModes } from './UIPanel';

export interface UINodeProps {
    drag(e: Konva.KonvaEventObject<DragEvent>,node: Node): void
    onClick(e: Konva.KonvaEventObject<MouseEvent>,node:Node):void
    node: Node,
    mode:UIModes,
    selected:boolean
}

const UINode: React.FC<UINodeProps> = ({ node, drag, mode, onClick,selected }) => {
    return (
        <React.Fragment>
            <Text
                x={node.x - node.name.length*4}
                y={node.y-30}
                text={node.name}
                _useStrictMode 
            />
               
            <Circle

                key={node.id}
                radius={selected ? 8 : 6}
                x={node.x}
                y={node.y}
                fill="#ddd"
                stroke="#888"
                strokeWidth={selected ? 2 : 0}
                draggable={mode === UIModes.drag || mode === UIModes.dragNode}
                _useStrictMode 
                shadowBlur={5}
                onDragMove={(e) => drag(e,node)} 
                onClick={(e) => onClick(e,node)}
            />
        </React.Fragment>
    )
}

export default UINode