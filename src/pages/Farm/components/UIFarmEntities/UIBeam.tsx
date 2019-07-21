import * as React from 'react'
import { Line, Stage } from 'react-konva'
import Konva from 'konva'
import { UIModes } from '../UIToolPanel';
import { Beam } from 'src/models/Farm/ModelBeam';
import theme from 'src/theme';
import { consts } from 'src/static';

export interface UIBeamProps {
    onClick(e: Konva.KonvaEventObject<MouseEvent>, beam: Beam): void
    beam: Beam,
    mode: UIModes,
    selected: boolean
}

const UIBeam: React.FC<UIBeamProps> = ({ beam,  mode, onClick, selected }) => {
    const size = consts.UI_beamSize
    const hundleMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>, mode: UIModes) => {
        const stage: Stage & Konva.Stage = e.target.getStage()
    
        switch (mode) {
            case UIModes.delete:
            case UIModes.none:{            
                stage.container().style.cursor = 'pointer'
                break
            }

            default:{
                break
            }
        }
    
    }
    const hundleMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage: Stage & Konva.Stage = e.target.getStage()
        stage.container().style.cursor = 'default'
    }
    return (
        <React.Fragment>
            <Line
                points={[
                    beam.x,
                    beam.y,
                    beam.getEndX(),
                    beam.getEndY()
                ]}
                stroke={theme.palette.secondary.light}
                strokeWidth={size}
                shadowBlur={selected ? 8 : 2}
            />
            <Line
                points={[
                    beam.x,
                    beam.y,
                    beam.getEndX(),
                    beam.getEndY()
                ]}
                strokeWidth={size*4} 
                stroke="transparent"
                onClick={(e) => onClick(e,beam)}
                onMouseEnter={(e) => hundleMouseEnter(e, mode)}
                onMouseLeave={(e) => hundleMouseLeave(e)}
            />
        </React.Fragment>
    )
}

export default UIBeam