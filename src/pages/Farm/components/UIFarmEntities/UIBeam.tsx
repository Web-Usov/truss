import * as React from 'react'
import { Line, Stage } from 'react-konva/lib/ReactKonvaCore'
import Konva from 'konva'
import { UIModes } from '../UIToolPanel';
import { Beam } from 'src/models/Farm/ModelBeam';
import theme from 'src/theme';
import { consts } from 'src/static';

interface UIBeamProps {
    onClick(e: Konva.KonvaEventObject<MouseEvent>, beam: Beam): void
    mode: UIModes,
    selected: boolean,
    beam: Beam
}

class UIBeam extends React.Component<UIBeamProps>{

    constructor(props: UIBeamProps) {
        super(props)
        this.hundleMouseEnter = this.hundleMouseEnter.bind(this)
        this.hundleMouseLeave = this.hundleMouseLeave.bind(this)
    }
    hundleMouseEnter(e: Konva.KonvaEventObject<MouseEvent>, mode: UIModes) {
        const stage: typeof Stage & Konva.Stage = e.target.getStage()

        switch (mode) {
            case UIModes.delete:
            case UIModes.none: {
                stage.container().style.cursor = 'pointer'
                break
            }

            default: {
                break
            }
        }

    }
    hundleMouseLeave(e: Konva.KonvaEventObject<MouseEvent>) {
        const stage: typeof Stage & Konva.Stage = e.target.getStage()
        if (stage) stage.container().style.cursor = 'default'
    }
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
                stroke={theme.palette.secondary.light}
                strokeWidth={size}
                shadowBlur={selected ? 8 : 2}

                hitStrokeWidth={size * 4}
                onClick={(e: any) => onClick(e, beam)}
                onMouseEnter={(e: any) => this.hundleMouseEnter(e, mode)}
                onMouseLeave={(e: any) => this.hundleMouseLeave(e)}
            />
        )

    }
}
export default UIBeam