import * as React from 'react'
import { Circle, Text, Line } from 'react-konva'
import Konva from 'konva'
import { Node } from 'src/models/Farm';
import { UIModes } from './UIPanel';
import { Beam } from 'src/models/Farm/ModelBeam';

export interface UIBeamProps {
    drag(e: Konva.KonvaEventObject<DragEvent>, beam: Beam): void
    onClick(e: Konva.KonvaEventObject<MouseEvent>, beam: Beam): void
    beam: Beam,
    mode: UIModes,
    selected: boolean
    withStartNode?: boolean
    withEndNode?: boolean
}

const UIBeam: React.FC<UIBeamProps> = ({ beam, drag, mode, onClick, selected }) => {
    return (
        <React.Fragment>
            {/* <Circle

                radius={10}
                x={beam.x}
                y={beam.y}
                fill="#ddd"
                stroke="#888"
                strokeWidth={selected ? 6 : 3}
                draggable={mode === UIModes.drag || mode === UIModes.dragBeam}
                _useStrictMode 
                onDragMove={(e) => drag(e,beam)} 
                onClick={(e) => onClick(e,beam)}
            /> */}
            {/* <Text
                x={beam.x - beam.name.length * 4}
                y={beam.y - 30}
                text={beam.name}
                _useStrictMode
            /> */}
            <Line
                // x={beam.x}
                // y={beam.y}
                points={[
                    beam.x,
                    beam.y,
                    beam.x + (beam.length * Math.cos(beam.angle * Math.PI)),
                    beam.y + (beam.length * Math.sin(beam.angle * Math.PI ))
                ]}
                stroke='#bbb'
                strokeWidth={4}
                onClick={(e) => onClick(e,beam)}

            />

        </React.Fragment>
    )
}

export default UIBeam