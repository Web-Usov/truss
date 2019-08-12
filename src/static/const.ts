// import favicon from './images/favicon.ico'
import path from 'path'
import ogImage from './images/ogImage.png'
import bridgeIcon_1 from './images/icon.png'
import bridgeIcon_2 from './images/bridge.png'
import airBridge from './images/airBridge.png'
import FixationIcon from './images/fixation.svg'

// Strings
export const url = process.env.PUBLIC_URL
export const title = "Truss - ферма для каждого"
export const description = "Ферма (farm или truss) — стержневая система в строительной механике, остающаяся геометрически неизменяемой после замены её жёстких узлов шарнирными."
export const favicon = path.resolve(__dirname,"favicon.ico")

// UI
export const UI_cellSize = 45
export const UI_nodeSize = UI_cellSize / 3
export const UI_beamSize = UI_cellSize / 7
export const MMinCell = 200
export const SizeKoef = (MMinCell/UI_cellSize)

export const sidebarWidth = 240
export const canvasWidth  = 2500
export const canvasHeight = 1500


// Images
export {
    ogImage,
    bridgeIcon_1,
    bridgeIcon_2,
    airBridge,
    FixationIcon
}