import TEntity from "./TEntity";
import { ITForce } from "./TTypes";

class TForce extends TEntity{
    
    private _value : number;
    public get value() : number {
        return this._value;
    }
    
    private _angle : 0 | 90;
    public get angle() : 0 | 90 {
        return this._angle;
    }
    
    constructor(props:ITForce = {}){
        super(props)
        const {value,angle} = props
        this._angle = angle || 0
        this._value = value || 0
    }
}

export default TForce