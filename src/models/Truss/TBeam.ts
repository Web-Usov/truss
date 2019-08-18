import { action, computed, observable } from "mobx";
import { MyMath } from "src/utils";
import TEntity from "./TEntity";
import TNode from "./TNode";
import { ICoord, ITBeam } from "./TTypes";

class TBeam extends TEntity {
    private _entity: TEntity

    @observable private _startConnectedNode: TNode | null;
    @computed public get startConnectedNode(): TNode | null {
        return this._startConnectedNode;
    }

    @observable private _endConnectedNode: TNode | null;
    @computed public get endConnectedNode(): TNode | null {
        return this._endConnectedNode;
    }
    // Coord 
    @computed public get coord(): ICoord {
        if (this._startConnectedNode) {
            return this._startConnectedNode.coord
        } else {
            return this._entity.coord
        }
    }

    @observable private _endCoord: ICoord;
    @computed public get endCoord(): ICoord {
        if (this._endConnectedNode) {
            return this._endConnectedNode.coord
        } else return this._endCoord
    }

    @computed public get dCoord(): ICoord {
        if (this._startConnectedNode) {
            return this._startConnectedNode.dCoord
        } else return this._entity.dCoord
    }

    @computed public get dEndCoord(): ICoord {
        if (this._endConnectedNode) {
            return this._endConnectedNode.dCoord
        } else return this._entity.dCoord
    }
    // # Coord 


    @observable private _startForce: number;
    @computed public get startForce(): number {
        return this._startForce;
    }
    public set startForce(v: number) {
        this._startForce = v;
    }


    @observable private _endForce: number;
    @computed public get endForce(): number {
        return this._endForce;
    }
    public set endForce(v: number) {
        this._endForce = v;
    }

    @computed public get name() {
        if (this._startConnectedNode && this._endConnectedNode) {
            const n1 = this._startConnectedNode.name
            const n2 = this._endConnectedNode.name
            if (n1 < n2) return `${n1} - ${n2}`
            else return `${n2} - ${n1}`
        } else return "..."
    }

    constructor(props: ITBeam = {}) {
        super(props)
        const { dCoord, startConnectedNode, endConnectedNode, coord, endCoord,  startForce, endForce } = props
        this._entity = {
            ...this,
            coord: coord || { x: 0, y: 0 },
            dCoord: dCoord || { x: 0, y: 0 }
        }
        this._startConnectedNode = startConnectedNode || null
        this._endConnectedNode = endConnectedNode || null
        this._endCoord = endCoord || this.coord
        this._startForce = startForce || 0
        this._endForce = endForce || 0

    }

    @action public connectStartNode(node: TNode) {
        this._startConnectedNode = node
    }
    @action public connectEndNode(node: TNode) {
        this._endConnectedNode = node
    }
    @action public removeStartNode() {
        this._startConnectedNode = null
    }
    @action public removeEndNode() {
        this._endConnectedNode = null
    }
    @action public moveTo(x: number, y: number) {
        if (this._startConnectedNode) return
        this.coord.x = x
        this.coord.y = y
    }
    @action public moveEndTo(x: number, y: number) {
        if (this._endConnectedNode) return
        this._endCoord.x = x
        this._endCoord.y = y
    }
    @computed public get length() {
        const l = MyMath.lengthBePoints(this.coord.x, this.coord.y, this.endCoord.x, this.endCoord.y)
        return Math.round(l)
    }
}

export default TBeam