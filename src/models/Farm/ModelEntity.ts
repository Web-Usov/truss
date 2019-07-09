
export interface IFarmEntity {
    id?: number
    x?: number
    y?: number
    angle?: number
    name?: string
    newX?: number
    newY?: number
}


export class ClassFarmEntity implements IFarmEntity {
    id: number
    x: number;
    y: number;
    angle: number;
    name: string;
    newX: number;
    newY: number;
    // x:number = 0,y:number = 0,angle:number = 0, name:string = ""
    constructor(props: IFarmEntity) {
        this.id = Date.now()
        this.x = props.x || 0
        this.y = props.y || 0
        this.angle = props.angle || 0
        this.name = props.name || this.id+""
        this.newX = this.x
        this.newY = this.y
    }
}
