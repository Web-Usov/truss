class MyMath {
    static angleBePoints(x1:number, y1:number, x2:number, y2:number) :number {
        return Math.atan2(-y1 + y2, -x1 + x2) / (Math.PI)
    }
    
    static lengthBePoints(x1:number, y1:number, x2:number, y2:number) :number {
        return Math.sqrt(Math.pow(x1- x2, 2) + Math.pow(y1 - y2, 2))
    }
}


export default MyMath