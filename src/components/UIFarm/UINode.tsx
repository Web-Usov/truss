import * as React from 'react'
import { Circle, Text } from 'react-konva'
import Konva from 'konva'
import { ClassNode } from 'src/models/Farm';

export interface IUINode {
    dragNode(node: ClassNode, e: Konva.KonvaEventObject<DragEvent>): void
    node: ClassNode
}

const UINode: React.FC<IUINode> = ({ node, dragNode }) => {
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
                radius={10}
                x={node.x}
                y={node.y}
                fill="#ddd"
                stroke="#888"
                strokeWidth={3}
                draggable
                _useStrictMode 
                onDragMove={(e) => dragNode(node, e)} />
        </React.Fragment>
    )
}

export default UINode