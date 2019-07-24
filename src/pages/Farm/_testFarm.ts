import { Farm } from "src/models/Farm";

export default ()  => {
    const farm = new Farm()
    let node = farm.addNode(1000,560 + 40,0,"",true)
    if(node) {
        farm.connectForceToNode(node, 0 , 100)
        farm.connectForceToNode(node, 90 , 100)
    }
    node = farm.addNode(1200,760,0,"",true)
    if(node) {
        farm.connectForceToNode(node, 0 , -100)
        farm.connectForceToNode(node, 90 , -100)
    }
    
    return farm
}