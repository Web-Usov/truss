import Konva from 'konva';
import { observer } from "mobx-react";
import * as React from 'react';
import { Line } from 'react-konva';
import { TBeam } from 'src/models/Truss';
import { consts } from 'src/static';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';

const size = consts.UI.beamSize
interface UIBeamProps {
    onClick?(e: Konva.KonvaEventObject<MouseEvent>, beam: TBeam): void
    mode?: UIModes,
    selected?: boolean,
    beam: TBeam,
    viewNewPos?: boolean
}
const UIBeam: React.FC<UIBeamProps> = observer(({
    onClick = () => { },
    mode = UI.UIModes.none,
    selected = false,
    beam,
    viewNewPos = false
}) => {
    let points: number[] = [
        beam.coord.x / consts.UI.koefOnGrid,
        beam.coord.y / consts.UI.koefOnGrid,
        beam.endCoord.x / consts.UI.koefOnGrid,
        beam.endCoord.y / consts.UI.koefOnGrid
    ]
    if (viewNewPos) {
        points = [
            (beam.coord.x + beam.dCoord.x * consts.UI.koefOfNewPos) / consts.UI.koefOnGrid,
            (beam.coord.y - beam.dCoord.y * consts.UI.koefOfNewPos) / consts.UI.koefOnGrid,
            (beam.endCoord.x + beam.dEndCoord.x * consts.UI.koefOfNewPos) / consts.UI.koefOnGrid,
            (beam.endCoord.y - beam.dEndCoord.y * consts.UI.koefOfNewPos) / consts.UI.koefOnGrid
        ]
    }
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
})
export default UIBeam