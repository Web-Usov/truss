import { Action } from "redux";
import { Beam, Node, Force, Entity } from "src/models/Farm";
import { IBeam } from "src/models/Farm/ModelBeam";
import { INode } from "src/models/Farm/ModelNode";

export const DELETE_EN = "DELETE_EN"
export const ADD_NODE = "ADD_NODE"
export const ADD_BEAM = "ADD_BEAM"
export const ADD_FORCE = "ADD_FORCE"
export const DELETE_ENTITY = "DELETE_ENTITY"
export const EDIT_NODE = "EDIT_NODE"
export const EDIT_BEAM = "EDIT_BEAM"

// Add
export interface ActionAddNode extends Action {    
    type: typeof ADD_NODE,
    node:Node
}
export interface ActionAddBeam extends Action {    
    type: typeof ADD_BEAM,
    beam:Beam
}
export interface ActionAddForce extends Action {    
    type: typeof ADD_FORCE,
    force:Force
}
// Delete
export interface ActionDeleteEntity extends Action {    
    type: typeof DELETE_ENTITY,
    id:string
}
// Edit
export interface ActionEditNode extends Action {    
    type: typeof EDIT_NODE,
    node:Node
}
export interface ActionEditBeam extends Action {    
    type: typeof EDIT_BEAM,
    beam:Beam
}

export type FarmActions = (
    ActionAddNode | 
    ActionAddBeam |
    ActionAddForce |
    ActionDeleteEntity |
    ActionEditNode | 
    ActionEditBeam
);