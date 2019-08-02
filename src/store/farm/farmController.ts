import { Dispatch } from "redux";
import { AppState } from "src/store";
import * as actions from './farmActions'
import uuid from 'uuid'
import { Force, createForce } from "src/models/Farm/ModelForce";
import { IForce } from "src/models/Farm/ModelForce";
import { IBeam, Beam, createBeam, instanceOfBeam } from "src/models/Farm/ModelBeam";
import { INode, createNode, instanceOfNode, FarmNode } from "src/models/Farm/ModelNode";


/**
 * Add node to list
 * @param x coord
 * @param y coord
 * @param options props of INode
 * @return `beam` if the node is successfully added
 * @return `false` else
 */
export const addNode = (x: number, y: number, options?: INode) => (
    (dispatch: Dispatch, getState: () => AppState) => {

        const oldNode = getState().farm.nodes.find(item => item.x === x && item.y === y)
        if (oldNode) return false
        const id = uuid()
        if (!id) return false
        const node = createNode({
            ...options,
            id,
            x,
            y
        })
        dispatch(actions._addNode(node))
        return node
    }
)
/**
 * Add beam to list
 * @param options props of IBeam
 * @return `beam` if the beam is successfully added
 * @return `false` else
 */
export const addBeam = (options?: IBeam) => (
    (dispatch: Dispatch, getState: () => AppState) => {
        const id = uuid()
        if (!id) return false
        const beam = createBeam({
            ...options,
            id,
        })
        dispatch(actions._addBeam(beam))
        return beam
    }
)
/**
 * Connecting beam to chosen node
 * @param nodeID id chosen node
 * @param beamID id chosen beam
 * @return `true` if the beams is successfully  conected
 * @return `false` else
 */
export const connectBeamToNode = (nodeID: string, beamID: string, place: 'start' | 'end') => (
    (dispatch: Dispatch, getState: () => AppState) => {
        let node = getState().farm.nodes.find(i => i.id === nodeID)
        let beam = getState().farm.beams.find(i => i.id === beamID)
        if (node && beam) {
            node = createNode(node)
            beam = createBeam(beam)

            switch (place) {
                case 'start': {

                    beam.startConnectedNodeID = node.id
                    node.beamsID.push(beam.id)
                    
                    beam.x = node.x
                    beam.y = node.y
                    dispatch(actions._editNode(node))
                    dispatch(actions._editBeam(beam))
                    return true;
                }
                case 'end': {
                    const beamsOfNode = getState().farm.beams.filter(item => (node && node.beamsID.includes(item.id)))
                    const oldBeam = beamsOfNode.find(item =>
                        (node && beam && (
                            (item.startConnectedNodeID === beam.startConnectedNodeID && item.endConnectedNodeID === node.id) ||
                            (item.startConnectedNodeID === node.id && item.endConnectedNodeID === beam.startConnectedNodeID) ||
                            (item.id === beam.id && item.endConnectedNodeID === beam.id))
                        )
                    )

                    if (!oldBeam) {

                        node.beamsID.push(beam.id)
                        // beam.connectNode(node.id, "end")
                        beam.endConnectedNodeID = node.id
                        // beam.moveEndPoint(node.x, node.y)
                        beam.endX = node.x
                        beam.endY = node.y
                        dispatch(actions._editNode(node))
                        dispatch(actions._editBeam(beam))
                        return true
                    }
                    return false
                }
                default: return false
            }
        }
        return false

    }
)
export const addForceToNode = (nodeID: string, forceID: string, options?: IForce) => (dispatch: Dispatch, getState: () => AppState) => {
    let node: FarmNode | undefined | null = getState().farm.nodes.find(item => item.id === nodeID)
    if (!node) return false
    node = createNode(node)
    let force: Force | null = createForce({
        ...options,
        nodeID: node.id,
    })

    if (force.angle === 0) node.forceX = force
    else node.forceY = force
    dispatch(actions._editNode(node))
    dispatch(actions._addForce(force))
    node = null
    force = null

}
export const moveNode = (nodeOrId: string | FarmNode, x: number, y: number, ) => (
    (dispatch: Dispatch, getState: () => AppState) => {
        let node: FarmNode | undefined 
        if(typeof nodeOrId === 'string') 
            node = getState().farm.nodes.find(item => item.id === nodeOrId)
        else node = nodeOrId
        
        if (!node) return false
        if (node.isStatic) return false
        const _node = getState().farm.nodes.find(item => item.x === x && item.y === y)
        if (!_node) {
            // node = createNode({
            //     ...node,
            //     x,
            //     y
            // })
            node.x = x
            node.y = y
            let beam: Beam
            const beamsOfNode = getState().farm.beams.filter(item => (node && node.beamsID.includes(item.id)))
            beamsOfNode.forEach(item => {
                if (node) {
                    // beam = createBeam(item)
                    beam = item
                    if (beam.startConnectedNodeID === node.id) {
                        // beam.moveStartPoint(x, y)
                        beam.x = x
                        beam.y = y

                    } else if (item.endConnectedNodeID === node.id) {
                        // beam.moveEndPoint(x, y)
                        beam.endX = x
                        beam.endY = y
                    }
                    dispatch(actions._editBeam(beam))
                }
            })
            dispatch(actions._editNode(node))

            // beam = null
            return true
        }
        // node = null
        return false
    }
)

export const moveBeam = (beamID: string, x: number, y: number, place: 'start' | 'end' = 'end') => (
    (dispatch: Dispatch, getState: () => AppState) => {
        let beam: Beam | undefined | null = getState().farm.beams.find(item => item.id === beamID)
        if (!beam) return false
        beam = createBeam(beam)
        if (place === 'start') {
            // beam.moveStartPoint(x,y)
            beam.x = x
            beam.y = y
        }
        else {
            // beam.moveEndPoint(x,y)
            beam.endX = x
            beam.endY = y
        }

        dispatch(actions._editBeam(beam))
        beam = null
        return true
    }
)

export const deleteEntity = (id: string) => (dispatch: Dispatch, getState: () => AppState) => {
    let entity: Beam | FarmNode | Force | undefined | null =
        getState().farm.beams.find(item => item.id === id) ||
        getState().farm.nodes.find(item => item.id === id) ||
        getState().farm.forces.find(item => item.id === id)

    if (entity && instanceOfNode(entity)) {
        if (entity.isStatic) return false
        const beamsOfNode = getState().farm.beams.filter(item => (entity && instanceOfNode(entity) && entity.beamsID.includes(item.id)))
        beamsOfNode.forEach(beam => {
            if (entity instanceof Node) {
                let _node: FarmNode | undefined | null
                if (beam.startConnectedNodeID === entity.id) {
                    _node = getState().farm.nodes.find(item => item.id === beam.endConnectedNodeID)
                }
                else {
                    _node = getState().farm.nodes.find(item => item.id === beam.startConnectedNodeID)
                }
                if (_node) {
                    _node = createNode(_node)
                    // _node.removeBeam(beam.id)
                    _node.beamsID = _node.beamsID.filter(id => id !== beam.id)
                    dispatch(actions._editNode(_node))
                }
                _node = null
                dispatch(actions._deleteEntity(beam.id))
            }
        })
        if (entity.forceX) dispatch(actions._deleteEntity(entity.forceX.id))
        if (entity.forceY) dispatch(actions._deleteEntity(entity.forceY.id))
        dispatch(actions._deleteEntity(entity.id))
        return true
    } else if (entity && instanceOfBeam(entity)) {
        [entity.startConnectedNodeID, entity.endConnectedNodeID].forEach(nodeID => {
            if (nodeID && nodeID.length > 0) {
                let _node = getState().farm.nodes.find(item => item.id === nodeID)
                if (_node && instanceOfBeam(entity)) {
                    _node = createNode(_node)
                    // _node.removeBeam(entity.id)
                    _node.beamsID = _node.beamsID.filter(id => {
                        if (entity) return id !== entity.id
                        return false
                    })
                    dispatch(actions._editNode(_node))
                }
            }
        })
        dispatch(actions._deleteEntity(entity.id))
        return true
    }
    return false
}