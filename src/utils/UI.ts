import { FarmNode } from "src/models/Farm/ModelNode";
import { colors } from "src/static";
import { Beam } from "src/models/Farm/ModelBeam";
import Konva from "konva";
import { Stage } from "konva/types/Stage";
import { createMuiTheme } from "@material-ui/core";

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
            dark:"#0A4467",
            main: "#1e779e",
            light:'#51A8D6'
        },
        secondary: {
            dark: "#a83e19",
            main: "#f15a24",
            light: "#F39B7C"
        },
        background:{
            default:'linear-gradient(35deg, #6863bf 0%, #067d93 50%, #e68a68 100%)'
        }  
        
    },
});
export const getNodeColor = (node: FarmNode):string => {
    
    if (node.isStatic) {
        if (node.fixation) return colors.fixedNode
        return colors.staticNode
    }
    return colors.node
}
export const getNodeStorkeColor = (node: FarmNode, mode : UIModes):string => {
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
export const getNodeStorkeWidth = (node: FarmNode, mode : UIModes): number =>  {
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

export const getBeamColor = (beam : Beam) : string => {
    return colors.beam
}


export const nodeMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>, node:FarmNode, mode: UIModes):void => {
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
export const nodeMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>):void => {
    const stage: typeof Stage & Konva.Stage = e.target.getStage()
    if (stage) stage.container().style.cursor = 'default'
}

export const beamMouseEnter = (e: Konva.KonvaEventObject<MouseEvent>, beam:Beam, mode: UIModes) :void =>  {
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
export const beamMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>) :void => {
    const stage: typeof Stage & Konva.Stage = e.target.getStage()
    if (stage) stage.container().style.cursor = 'default'
}