import { IEntity, Entity } from "./ModelEntity";
import { MyMath } from "src/utils";

export interface IBeam extends IEntity {
    length?: number
    startConnectedNodeID?: number
    endConnectedNodeID?: number
    newAngle?:number
}

export class Beam extends Entity {
    length: number
    startConnectedNodeID: number
    endConnectedNodeID: number
    newAngle:number
    constructor(props: IBeam) {
        super(props)
        this.length = props.length || 0
        this.startConnectedNodeID = props.startConnectedNodeID || 0
        this.endConnectedNodeID = props.endConnectedNodeID || 0
        this.newAngle = this.angle
    }

    connectNode(nodeID: number, place: 'start' | 'end'): void {
        switch (place) {
            case 'start':{
                this.startConnectedNodeID = nodeID
                break;
            }
            case 'end':{
                this.endConnectedNodeID = nodeID
                break;
            }
            default:
                break;
        }
    }
    removeNode(place: 'start' | 'end'): void {
        place === 'start' ?
        this.startConnectedNodeID = 0 :
        this.endConnectedNodeID = 0
    }
    getEndX():number{
        return this.x + (this.length * Math.cos(this.angle * Math.PI))
    }
    getEndY():number{
        return this.y + (this.length * Math.sin(this.angle * Math.PI))
    }
    moveStartPoint(x:number,y:number):void{
        const endX = this.getEndX()
        const endY = this.getEndY()
        this.x = x
        this.y = y
        this.angle = MyMath.angleBePoints(x,y, endX,endY)
        this.length = MyMath.lengthBePoints(x,y, endX,endY)
    }
    
    moveEndPoint(x:number,y:number):void{
        this.angle = MyMath.angleBePoints(this.x,this.y,x,y)
        this.length = MyMath.lengthBePoints(this.x,this.y,x,y)
    }
}