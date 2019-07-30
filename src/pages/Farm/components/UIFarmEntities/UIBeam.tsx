import * as React from 'react'
import { Line } from 'react-konva/lib/ReactKonvaCore'
import Konva from 'konva'
import { Beam } from 'src/models/Farm/ModelBeam';
import { consts } from 'src/static';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';

interface UIBeamProps {
    onClick(e: Konva.KonvaEventObject<MouseEvent>, beam: Beam): void
    mode: UIModes,
    selected: boolean,
    beam: Beam
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
        const { onClick, mode, selected, beam } = this.props
        const size = consts.UI_beamSize
        return (
            <Line
                points={[
                    beam.x,
                    beam.y,
                    beam.endX,
                    beam.endY
                ]}
                stroke={UI.getBeamColor(beam)}
                strokeWidth={size}
                shadowBlur={selected ? 8 : 2}

                hitStrokeWidth={size * 4}
                onClick={(e: any) => onClick(e, beam)}
                onMouseEnter={(e: any) => UI.beamMouseEnter(e,beam, mode)}
                onMouseLeave={(e: any) => UI.beamMouseLeave(e)}
            />
        )

    }
}
export default UIBeam