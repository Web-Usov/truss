import * as React from 'react'
import { Line } from 'react-konva'
import Konva from 'konva'
import { Beam } from 'src/models/Farm/ModelBeam';
import { consts } from 'src/static';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';

interface UIBeamProps {
    onClick(e: Konva.KonvaEventObject<MouseEvent>, beam: Beam): void
    mode: UIModes,
    selected: boolean,
    beam: Beam,
    viewNewPos?: boolean
}

class UIBeam extends React.Component<UIBeamProps>{

    shouldComponentUpdate(nextProps: UIBeamProps) {
        const { beam, mode, selected } = this.props
        return (
            nextProps.beam !== beam ||
            nextProps.mode !== mode ||
            nextProps.selected !== selected
        )
    }
    render() {
        const { onClick, mode, selected, beam, viewNewPos } = this.props
        const size = consts.UI.beamSize

        let points: number[] = [
            beam.x / consts.UI.koefOnGrid,
            beam.y / consts.UI.koefOnGrid,
            beam.endX / consts.UI.koefOnGrid,
            beam.endY / consts.UI.koefOnGrid
        ]
        if (viewNewPos)
            points = [
                beam.newX / consts.UI.koefOnGrid,
                beam.newY / consts.UI.koefOnGrid,
                beam.newEndX / consts.UI.koefOnGrid,
                beam.newEndY / consts.UI.koefOnGrid
            ]

        return (
            <Line
                opacity={viewNewPos ? 0.3 : 1}
                points={points}
                stroke={UI.getBeamColor(beam)}
                strokeWidth={size}
                shadowBlur={selected && !viewNewPos ? 8 : 2}

                hitStrokeWidth={viewNewPos ? 0 : size * 4}
                onClick={viewNewPos ? () => { } : (e: any) => onClick(e, beam)}
                onMouseEnter={viewNewPos ? () => { } : (e: any) => UI.beamMouseEnter(e, beam, mode)}
                onMouseLeave={viewNewPos ? () => { } : (e: any) => UI.beamMouseLeave(e)}
            />
        )

    }
}
export default UIBeam