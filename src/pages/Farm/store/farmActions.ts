import * as FarmTypes from "./farmTypes";
import {  Node, Beam, Entity, Force } from "src/models/Farm/";
import { IBeam } from "src/models/Farm/ModelBeam";
import { INode } from "src/models/Farm/ModelNode";

export const _addNode = (node : Node) : FarmTypes.FarmActions => ({
    type:FarmTypes.ADD_NODE,
    node
})

export const _addBeam = (beam: Beam) : FarmTypes.FarmActions => ({
    type:FarmTypes.ADD_BEAM,
    beam
})

export const _addForce = (force: Force) : FarmTypes.FarmActions => ({
    type:FarmTypes.ADD_FORCE,
    force
})

export const _editNode = (node: Node) : FarmTypes.FarmActions =>  ({
    type:FarmTypes.EDIT_NODE,
    node
})
export const _editBeam = (beam: Beam) : FarmTypes.FarmActions =>  ({
    type:FarmTypes.EDIT_BEAM,
    beam
})

export const _deleteEntity = (id: string) : FarmTypes.FarmActions =>  ({
    type:FarmTypes.DELETE_ENTITY,
    id
})