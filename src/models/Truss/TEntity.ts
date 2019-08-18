import { action, computed, observable } from 'mobx';
import uuid from 'uuid';
import { ICoord, ITEntity } from './TTypes';

abstract class TEntity {
    private _id: string
    public get id(): string {
        return this._id;
    }

    @observable private _coord: ICoord
    @computed public get coord(): ICoord {
        return this._coord;
    }

    @observable private _name: string
    @computed public get name(): string {
        return this._name;
    }
    public set name(v: string) {
        this._name = v;
    }

    @observable private _dCoord: ICoord
    @computed public get dCoord(): ICoord {
        return this._dCoord;
    }
    public set dCoord(v: ICoord) {
        this._dCoord = v;
    }

    constructor({ coord, id, name, dCoord}: ITEntity = {}) {
        this._id = id || uuid()
        this._name = name || this._id
        this._coord = coord || { x: 0, y: 0 }
        this._dCoord = dCoord || { x: 0, y: 0 }
    }

    @action moveTo(x: number, y: number) {
        this._coord.x = x
        this._coord.y = y
    }
}

export default TEntity