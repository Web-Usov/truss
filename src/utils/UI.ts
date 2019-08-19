import { colors } from "src/static";
import Konva from "konva";
import { Stage } from "konva/types/Stage";
import { createMuiTheme } from "@material-ui/core";
import { TNode, TBeam } from "src/models/Truss";

export enum UIModes {
    none,
    move,
    addNode,
    addBeam,
    addBeamStart,
    delete
}
export const theme = createMuiTheme({
    palette: {
        primary: {
            dark: "#0A4467",
            main: "#1e779e",
            light: '#51A8D6'
        },
        secondary: {
            dark: "#a83e19",
            main: "#f15a24",
            light: "#F39B7C",
            // light:"#f0965d"
        },
        background: {
            default: 'linear-gradient(35deg, #6863bf 0%, #067d93 50%, #e68a68 100%)'
        }

    },
    overrides: {
        MuiTooltip: {
            tooltip: {
                fontSize: 14
            }
        }
    }
});
export const getNodeColor = (node: TNode): string => {

    if (node.isStatic) {
        if (node.fixation) return colors.fixedNode
        return colors.staticNode
    }
    return colors.node
}
export const getNodeStorkeColor = (node: TNode, mode: UIModes): string => {
    switch (mode) {
        case UIModes.move: {
            if (node.isStatic) return theme.palette.secondary.dark
            return theme.palette.primary.light
        }
        case UIModes.addBeam:
        case UIModes.addBeamStart: {
            return theme.palette.primary.light
        }
        default:
            return theme.palette.secondary.main
    }
}
export const getNodeStorkeWidth = (node: TNode, mode: UIModes): number => {
    switch (mode) {
        case UIModes.move: {
            if (node.isStatic) return 0
            return 2
        }
        case UIModes.addBeam:
        case UIModes.addBeamStart: {
            return 2
        }
        default:
            return 0
    }
}

export const getBeamColor = (beam: TBeam): string => {
    return colors.beam
}


export const nodeMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>, node: TNode, mode: UIModes): void => {
    const stage: typeof Stage & Konva.Stage = e.target.getStage()
    switch (mode) {
        case UIModes.delete:
            if (node.isStatic) {
                stage.container().style.cursor = 'default'
                break
            }
            stage.container().style.cursor = 'pointer'
            break
        case UIModes.none: {
            stage.container().style.cursor = 'pointer'
            break;
        }

        case UIModes.addBeam:
        case UIModes.addBeamStart: {
            stage.container().style.cursor = 'crosshair'
            break
        }
        case UIModes.move: {
            if (node.isStatic) {
                stage.container().style.cursor = 'default'
                break
            }
            stage.container().style.cursor = 'move'
            break
        }

        default: {
            break;
        }
    }

}
export const nodeMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    const stage: typeof Stage & Konva.Stage = e.target.getStage()
    if (stage) stage.container().style.cursor = 'default'
}

export const beamMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>, beam: TBeam, mode: UIModes): void => {
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
export const beamMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    const stage: typeof Stage & Konva.Stage = e.target.getStage()
    if (stage) stage.container().style.cursor = 'default'
}