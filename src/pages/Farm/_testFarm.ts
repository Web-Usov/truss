import { FarmNode, createNode } from "src/models/Farm/ModelNode";
import { Beam } from "src/models/Farm/ModelBeam";
import { Force, createForce } from "src/models/Farm/ModelForce";

export default () => {
    const n : FarmNode[] = []
    const b : Beam[] = []
    const f : Force[] = []
    let force : Force
    let node  = createNode({
        x:1000,
        y:560,
        isStatic:true,
        isFixed:'xy'
    })    
    n.push(node)
    node = createNode({
        x:1200,
        y:640,
        isStatic:true,
    })
    force = createForce({
        nodeID:node.id,
        value:100,        
    })
    node.forceX = force
    n.push(node)
    f.push(force)
    // if(node) {
    //     farm.connectForceToNode(node, 0 , 100)
    //     farm.connectForceToNode(node, 90 , 100)
    // }
    // node = farm.addNode(1200,760,0,"",true)
    // if(node) {
    //     farm.connectForceToNode(node, 0 , -100)
    //     farm.connectForceToNode(node, 90 , -100)
    // }
    
    return {n,b,f}
}