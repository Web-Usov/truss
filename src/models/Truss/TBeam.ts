import TEntity from "./TEntity";
import TNode from "./TNode";
import { ICoord,  ITBeam } from "./TTypes";
import { MyMath } from "src/utils";
import { observable, computed, action } from "mobx";

class TBeam extends TEntity{
    
    @observable private _startConnectedNode : TNode | null;
    @computed public get startConnectedNode() : TNode | null {
        return this._startConnectedNode;
    }    
    
    @observable private _endConnectedNode : TNode | null;
    @computed public get endConnectedNode() : TNode | null {
        return this._endConnectedNode;
    }    
    // Coord 
    // @observable private _coord: ICoord
    @computed public get coord(): ICoord {
        if(this._startConnectedNode){
            return this._startConnectedNode.coord
        }else return TEntity.bind(this).prototype.coord
    }

    @observable private _endCoord : ICoord;
    @computed public get endCoord() : ICoord {
        if(this._endConnectedNode){
            return this._endConnectedNode.coord
        }else return this._endCoord
    }
    
    // # Coord 
    @observable private _dEndCoord : ICoord;
    @computed public get dEndCoord() : ICoord {
        return this._dEndCoord;
    }
    public set dEndCoord(v : ICoord) {
        this._dEndCoord = v;
    }

    
    @observable private _startForce : number;
    @computed public get startForce() : number {
        return this._startForce;
    }
    public set startForce(v : number) {
        this._startForce = v;
    }
    
    
    @observable private _endForce : number;
    @computed public get endForce() : number {
        return this._endForce;
    }
    public set endForce(v : number) {
        this._endForce = v;
    }
    
    constructor(props:ITBeam = {}){
        super(props)
        const {startConnectedNode,endConnectedNode,coord,endCoord,dEndCoord,startForce,endForce} = props
        this._startConnectedNode = startConnectedNode || null
        this._endConnectedNode = endConnectedNode || null
        this._endCoord = endCoord || this.coord
        this._dEndCoord = dEndCoord || {x:0,y:0}
        this._startForce = startForce || 0
        this._endForce = endForce || 0
    }
    
    @action public connectStartNode(node:TNode){
        this._startConnectedNode = node
    }
    @action public connectEndNode(node:TNode){
        this._endConnectedNode = node
    }
    @action public removeStartNode(){
        this._startConnectedNode = null
    }
    @action public removeEndNode(){
        this._endConnectedNode = null
    }
    @action public moveTo(x:number,y:number){
        if(this._startConnectedNode) return
        TEntity.bind(this).prototype.moveTo(x,y)
    }
    @action public moveEndTo( x: number, y: number){
        if(this._endConnectedNode) return
        this._endCoord.x = x 
        this._endCoord.y = y 
    }
    @computed public get length(){
        return MyMath.lengthBePoints(this.coord.x,this.coord.y,this.endCoord.x,this.endCoord.y)
    }
}

export default TBeam