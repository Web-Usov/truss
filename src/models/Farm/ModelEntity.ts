import uuid from 'uuid'

export interface IEntity {
    id?: string
    x?: number
    y?: number
    angle?: number
    name?: string
    newX?: number
    newY?: number
    type?:'entity' | 'node' | 'beam' | 'force'
}

// export class Entity implements IEntity {
//     id: string
//     x: number;
//     y: number;
//     angle: number;
//     name: string;
//     newX: number;
//     newY: number;
//     constructor(props: IEntity) {
//         this.id =  props.id || uuid()
//         this.x = props.x || 0
//         this.y = props.y || 0
//         this.angle = props.angle || 0
//         this.name = props.name || this.id + ""
//         this.newX = this.x
//         this.newY = this.y
//     }
// }

export interface Entity {    
    id: string
    x: number;
    y: number;
    angle: number;
    name: string;
    newX: number;
    newY: number;
    type:'entity' | 'node' | 'beam' | 'force'
}

export const createEntity = (props:IEntity = {}) :Entity => {
    const { x, y, name, angle, id, newX, newY, type } = props
    const entity : Entity =  {
        id: id || uuid(),
        x: x || 0,
        y: y || 0,
        angle: angle || 0,
        name: name || "",
        newX: newX || x || 0,
        newY: newY || y || 0,
        type:type || 'entity'
    }
    entity.name = name || entity.id
    return entity

}
export const instanceOfEntity = (object: any): object is Entity => object && object.type === 'entity';