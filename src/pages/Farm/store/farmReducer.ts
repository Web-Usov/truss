
import * as FarmTypes from './farmTypes'
import { Beam } from 'src/models/Farm/ModelBeam';
import { Force } from 'src/models/Farm/ModelForce';
import { FarmNode } from 'src/models/Farm/ModelNode';

export interface IFarmStore {
    nodes:FarmNode[],
    beams:Beam[],
    forces:Force[]
}

export const defaultState: IFarmStore = {
    nodes:[],
    beams:[],
    forces:[]
}

export const reducer = (state: IFarmStore = defaultState, action: FarmTypes.FarmActions): IFarmStore => {
    switch (action.type) {
        // Add
        case FarmTypes.ADD_NODE : {
            const {node} = action
            return {
                ...state,
                nodes : [
                    ...state.nodes,
                    node
                ]
            }
            
        }
        case FarmTypes.ADD_BEAM : {
            const {beam} = action
            return {
                ...state,
                beams : [
                    ...state.beams,
                    beam
                ]
            }            
        }
        case FarmTypes.ADD_FORCE : {
            const {force} = action
            return {
                ...state,
                forces : [
                    ...state.forces,
                    force
                ]
            }            
        }
        // Edit
        case FarmTypes.EDIT_NODE : {
            return {
                ...state,
                nodes : state.nodes.map(item => {
                    if(item.id === action.node.id){      
                        // const node : Node = {
                        //     ...item,
                        //     ...action.node
                        // }
                        return {
                                ...item,
                                ...action.node
                            }
                    }
                    return item
                })
            }            
        }
        case FarmTypes.EDIT_BEAM : {
            return {
                ...state,
                beams : state.beams.map(item => {
                    if(item.id === action.beam.id){ 
                        return {
                            ...item,
                            ...action.beam
                        }   
                    }
                    return item
                })
            }            
        }
        // Delete
        case FarmTypes.DELETE_ENTITY : {
            return {
                beams : state.beams.filter(item => item.id !== action.id),
                nodes : state.nodes.filter(item => item.id !== action.id),
                forces : state.forces.filter(item => item.id !== action.id),
            }            
        }
        default:
            return state;
    }
}

