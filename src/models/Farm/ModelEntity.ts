import uuid from 'uuid'

export interface IEntity {
    id?: string
    x?: number
    y?: number
    angle?: number
    name?: string
    newX?: number
    newY?: number
    type?:'entity' | 'node' | 'beam' | 'force',
    withNewPosition?: boolean
}
export interface Entity {    
    id: string
    x: number;
    y: number;
    angle: number;
    name: string;
    newX: number;
    newY: number;
    type:'entity' | 'node' | 'beam' | 'force',
    withNewPosition:boolean
}

export const createEntity = (props:IEntity = {}) :Entity => {
    const { x, y, name, angle, id, newX, newY, type, withNewPosition } = props
    const entity : Entity =  {
        id: id || uuid(),
        x: x || 0,
        y: y || 0,
        angle: angle || 0,
        name: name || "",
        newX: newX || x || 0,
        newY: newY || y || 0,
        type:type || 'entity',
        withNewPosition: withNewPosition || false
    }
    entity.name = name || entity.id
    return entity

}
export const instanceOfEntity = (object: any): object is Entity => object && object.type === 'entity';