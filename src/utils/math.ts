import { consts } from "src/static";
import * as MathJs from 'mathjs'

class MyMath {
    static angleBePoints(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(-y1 + y2, -x1 + x2) / (Math.PI)
    }

    static lengthBePoints(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    }

    static cellX(x: number): number {
        return Math.round(x / consts.UI_cellSize) * consts.UI_cellSize
    }
    static cellY(y: number): number {
        return Math.round(y / consts.UI_cellSize) * consts.UI_cellSize
    }
    static signum(x: number) {
        if (x > 0) return 1
        else if (x < 0) return -1
        else return 0
    }
    static multMatrxi(a: number[][], b: number[][]) {
        const rowsA = a.length
        const rowsB = b.length
        const colsA = a[0].length
        const colsB = b[0].length
        const result: number[][] = []
        if (colsA !== rowsB) throw new Error("Размерность матриц не позволяет переумножить их")

        for (let i = 0; i < rowsA; i++) {
            const row: number[] = []
            for (let j = 0; j < colsB; j++) {
                row.push(0)
            }
            result.push(row)
        }
        for (let k = 0; k < colsB; k++) {
            for (let i = 0; i < rowsA; i++) {
                let sum = 0
                for (let j = 0; j < rowsB; j++)
                    sum += a[i][j] + b[j][k]
                result[i][k] = sum
            }
        }
        // console.log(result);
        return result

    }
    static multMatrxiV2(a: number[][], b: number[][]) : number[][]{
        let result: number[][] = []
        try {
            result = (MathJs.multiply(a,b) as number[][])
            
        } catch (error) {
            console.error("multMatrxiV2:", error);
        }        
        return result
    }
}


export default MyMath