// import favicon from './favicon.ico'
import ogImage from './ogImage.png'
import bridgeIcon_1 from './icon.png'
import bridgeIcon_2 from './bridge.png'
import airBridge from './airBridge.png'
import path from 'path'

// Strings
export const url = process.env.PUBLIC_URL
export const title = "Truss - ферма для каждого"
export const description = "Ферма (farm или truss) — стержневая система в строительной механике, остающаяся геометрически неизменяемой после замены её жёстких узлов шарнирными."
export const favicon = path.resolve(__dirname,"favicon.ico")

// UI
export const UI_cellSize = 40
export const UI_nodeSize = 10
export const UI_beamSize = 6


// Images
export {
    ogImage,
    bridgeIcon_1,
    bridgeIcon_2,
    airBridge
}