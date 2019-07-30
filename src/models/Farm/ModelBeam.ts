import { IEntity, Entity, createEntity } from "./ModelEntity";

export interface IBeam extends IEntity {
    length?: number
    startConnectedNodeID?: string
    endConnectedNodeID?: string
    endX?: number,
    endY?: number
}

// export class Beam extends Entity {
//     length: number
//     startConnectedNodeID: string | undefined
//     endConnectedNodeID: string | undefined
//     newAngle:number
//     endX:number
//     endY:number
//     constructor(props: IBeam) {
//         super(props)
//         this.length = props.length || 0
//         this.startConnectedNodeID = props.startConnectedNodeID || undefined
//         this.endConnectedNodeID = props.endConnectedNodeID || undefined
//         this.newAngle = this.angle
//         this.endX = props.endX || this.x
//         this.endY = props.endY || this.y
//     }

// connectNode(nodeID: string, place: 'start' | 'end'): void {
//     switch (place) {
//         case 'start':{
//             this.startConnectedNodeID = nodeID
//             break;
//         }
//         case 'end':{
//             this.endConnectedNodeID = nodeID
//             break;
//         }
//         default:
//             break;
//     }
// }
// removeNode(place: 'start' | 'end'): void {
//     place === 'start' ?
//     this.startConnectedNodeID = "" :
//     this.endConnectedNodeID = ""
// }
// moveStartPoint(x:number,y:number):void{

//     this.x = x
//     this.y = y
// }

// moveEndPoint(x:number,y:number):void{
//     this.endX = x
//     this.endY = y
// }
// }

export interface Beam extends Entity {
    length: number
    startConnectedNodeID: string | undefined
    endConnectedNodeID: string | undefined
    endX: number
    endY: number
}
export const createBeam = (props: IBeam = {}): Beam => {
    const { length, startConnectedNodeID, endConnectedNodeID, endX, endY } = props
    const entity = createEntity(props)
    const bram: Beam = {
        ...entity,
        type: "beam",
        length: length || 0,
        startConnectedNodeID: startConnectedNodeID,
        endConnectedNodeID: endConnectedNodeID,
        endX: endX || entity.x || 0,
        endY: endY || entity.y || 0,
    }
    return bram
}


export const instanceOfBeam = (object: any): object is Beam => object && object.type === 'beam';
