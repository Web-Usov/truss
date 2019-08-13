// import favicon from './images/favicon.ico'
import path from 'path'
import ogImage from './images/ogImage.png'
import bridgeIcon_1 from './images/icon.png'
import bridgeIcon_2 from './images/bridge.png'
import airBridge from './images/airBridge.png'
import FixationIcon from './images/fixation.svg'

// Strings
export const str = {
    url: process.env.PUBLIC_URL,
    title: "Truss - ферма для каждого",
    description: "Ферма (farm или truss) — стержневая система в строительной механике, остающаяся геометрически неизменяемой после замены её жёстких узлов шарнирными.",
    favicon: path.resolve(__dirname, "favicon.ico")
}

// UI
export const UI = {
    cellSize: 45,
    MMinCell: 200,
    koefOfNewPos:100,
    nodeSize: 0,
    beamSize: 0,
    koefOnGrid: 0,
    sidebarWidth: 240,

}
UI.nodeSize = UI.cellSize / 3
UI.beamSize = UI.cellSize / 7
UI.koefOnGrid = UI.MMinCell / UI.cellSize

export const canvas = {
    width: 2500,
    height: 1500
}


// Images
export const img = {
    ogImage,
    bridgeIcon_1,
    bridgeIcon_2,
    airBridge,
    FixationIcon
}