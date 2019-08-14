import { Beam } from 'src/models/Farm/ModelBeam';
import { FarmNode } from 'src/models/Farm/ModelNode'
import {observable} from 'mobx'
class FarmStore {
    @observable nodes: Map<string, FarmNode>
    @observable beams: Map<string, Beam>
    constructor() {
        this.nodes = new Map()
        this.beams = new Map()        
    }
}
export default FarmStore