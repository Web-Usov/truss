import { action, computed, observable } from "mobx";
import TEntity from "./TEntity";
import { ITNode, NodeFixation } from "./TTypes";

class TNode extends TEntity {
    @observable private _beamsID: string[];
    @computed public get beams(): string[] {
        return this._beamsID;
    }

    private _forceX: number;
    public get forceX(): number {
        return this._forceX;
    }
    public set forceX(v: number) {
        this._forceX = v
    }

    private _forceY: number;
    public get forceY(): number {
        return this._forceY;
    }
    public set forceY(v: number) {
        this._forceY = v
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
        this._forceX = forceX || 0
        this._forceY = forceY || 0
        this._isStatic = isStatic || false
        this._fixation = fixation || NodeFixation.none
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