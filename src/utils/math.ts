import { consts } from "src/static";

class MyMath {
    static angleBePoints(x1:number, y1:number, x2:number, y2:number) :number {
        return Math.atan2(-y1 + y2, -x1 + x2) / (Math.PI)
    }
    
    static lengthBePoints(x1:number, y1:number, x2:number, y2:number) :number {
        return Math.sqrt(Math.pow(x1- x2, 2) + Math.pow(y1 - y2, 2))
    }

    static cellX(x:number):number{        
        return  Math.round(x / consts.UI_cellSize) * consts.UI_cellSize
    }
    static cellY(y:number):number{        
        return  Math.round(y / consts.UI_cellSize) * consts.UI_cellSize
    }
    static signum(x:number){
        if(x > 0) return 1
        else if(x < 0 ) return -1
        else return 0
    }
}


export default MyMath