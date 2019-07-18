import * as React from 'react'
import { Line } from 'react-konva'
import Konva from 'konva'
import { UIModes } from './UIToolBar';
import { Beam } from 'src/models/Farm/ModelBeam';
import theme from 'src/theme';

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
            <Line
                points={[
                    beam.x,
                    beam.y,
                    beam.getEndX(),
                    beam.getEndY()
                ]}
                // stroke='#bbb'
                stroke={theme.palette.secondary.light}
                strokeWidth={6}
                shadowBlur={selected ? 8 : 2}
                onClick={(e) => onClick(e,beam)}
            />
        </React.Fragment>
    )
}

export default UIBeam