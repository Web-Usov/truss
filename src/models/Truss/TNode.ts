import TEntity from "./TEntity";
import { ITNode, NodeFixation } from "./TTypes";
import TForce from "./TForce";
import { observable, action, computed } from "mobx";

class TNode extends TEntity {
    @observable private _beamsID: string[];
    @computed public get beams(): string[] {
        return this._beamsID;
    }

    private _forceX: TForce | null;
    public get forceX(): TForce | null {
        return this._forceX;
    }

    private _forceY: TForce | null;
    public get forceY(): TForce | null {
        return this._forceY;
    }

    private _isStatic: boolean;
    public get isStatic(): boolean {
        return this._isStatic;
    }

    private _fixation: NodeFixation;
    public get fixation(): NodeFixation {
        return this._fixation;
    }

    constructor(props: ITNode = {}) {
        super(props)
        const { beamsID, forceX, forceY, isStatic, fixation } = props
        this._beamsID = beamsID || []
        this._forceX = forceX || null
        this._forceY = forceY || null
        this._isStatic = isStatic || false
        this._fixation = fixation || NodeFixation.None
    }

    @action public conncetBeam(id: string): boolean {
        if (this._beamsID.find(b => b === id)) return false
        this._beamsID.push(id)
        return true
    }

    @action public removeBeam(id: string): boolean {
        let res = false
        this._beamsID = this._beamsID.filter(b => {
            const flag = b !== id
            if (!flag) res = true
            return flag
        })
        return res
    }
}

export default TNode