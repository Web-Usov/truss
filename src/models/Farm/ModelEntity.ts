export interface IEntity {
    id?: number
    x?: number
    y?: number
    angle?: number
    name?: string
    newX?: number
    newY?: number
}

export class Entity implements IEntity {
    id: number
    x: number;
    y: number;
    angle: number;
    name: string;
    newX: number;
    newY: number;
    constructor(props: IEntity) {
        this.id = Date.now()+Math.random()
        this.x = props.x || 0
        this.y = props.y || 0
        this.angle = props.angle || 0
        this.name = props.name || this.id + ""
        this.newX = this.x
        this.newY = this.y
    }
}
