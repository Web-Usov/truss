import { ICoord } from "./ModelFarm";
import { MyMath } from "src/utils";

export class FarmMath {
    static Kmest_i(area: number, modUpr: number, length_i: number) {
        const mnoz = (area * modUpr) / length_i
        const result = []
        result.push([mnoz, -mnoz])
        result.push([-mnoz, mnoz])
        return result
    }
    static Lambda_i(nodeCoordOfX: ICoord, nodeCoordOfY: ICoord, length_i: number): ICoord {        
        const l_x = (nodeCoordOfY.x - nodeCoordOfX.x) / length_i
        const l_y = (nodeCoordOfY.y - nodeCoordOfX.y) / -length_i
        return { x: l_x, y: l_y }
    }
    static Kobs_i(area: number, modUpr: number, length_i: number, l_i: ICoord) {
        const mnoz = (area * modUpr) / length_i
        const LTxL: ICoord[] = [{ x: l_i.x * l_i.x, y: l_i.x * l_i.y }, { x: l_i.x * l_i.y, y: l_i.y * l_i.y }]
        const _LTxL: ICoord[] = [{ x: -l_i.x * l_i.x, y: -l_i.x * l_i.y }, { x: -l_i.x * l_i.y, y: -l_i.y * l_i.y }]
        const augmnet1 = []
        const augment2 = []
        for (let i = 0; i < 2; i++) {
            augmnet1.push({ x1: LTxL[i].x, y1: LTxL[i].y, x2: _LTxL[i].x, y2: _LTxL[i].y })
            augment2.push({ x1: _LTxL[i].x, y1: _LTxL[i].y, x2: LTxL[i].x, y2: LTxL[i].y })
        }
        const stack: { x1: number, y1: number, x2: number, y2: number }[] = Array.prototype.concat(augmnet1, augment2)
        const result = stack.map(({ x1, y1, x2, y2 }) => ([
            x1 * mnoz,
            y1 * mnoz,
            x2 * mnoz,
            y2 * mnoz
        ]))
        return result

    }
    static IndexV_i(nodeV1:ICoord, nodeV2:ICoord):number[]{
        return [
            nodeV1.x,
            nodeV1.y,
            nodeV2.x,
            nodeV2.y
        ]
    }
    static K(n_dof:number, n_link:number,indexV:number[][], k_obs:number[][][]){
        const K : number[][] = []

        for (let t = 0; t < n_dof; t++) {
            const row : number[] = []
            for (let r = 0; r < n_dof ; r++) {
                row.push(0)         
            }          
            K.push(row)
        }
        
        for (let e = 0; e < n_link; e++) {
            for (let i = 0; i < 4; i++) {
                const A = indexV[e][i]
                if(A !== 0)
                    for (let j = 0; j < 4; j++) {
                        const B = indexV[e][j]                  
                        if(B !== 0)
                            K[B-1][A-1] = K[B-1][A-1] + k_obs[e][i][j]                                 
                    }
                
            }        
        }
        return K
    }
    static SquareRoot(a : number[][],b : number[]){

        if(a.length !== b.length) {
            console.error("SquareRoot - Массивы должны быть одинаковой длины") 
            return
        }

        const n = b.length
        const x: number[] = []
        const d: number[] = []
        const s: number[][] = []
        const y: number[] = []
        a.forEach(i => {
            x.push(0)
            d.push(0)
            y.push(0)
            const buf : number [] = []
            a.forEach(i => {
                buf.push(0)
            })
            s.push(buf)
        })
        {
            x.push(0)
            d.push(0)
            y.push(0)
            const buf : number [] = []
            a.forEach(i => {
                buf.push(0)
                buf.push(0)
            })
            s.push(buf)
        }

        // for i = 1
        d[1] = MyMath.signum(a[0][0]);
        s[1][1] = Math.sqrt(Math.abs(a[0][0]));
        for (let j = 2; j <= n; j++) {
            s[1][j] = a[1][j] / (s[1][1] * d[1]);
        }

        // for i > 1
        //searching S and D matrix
        for (let i = 2; i <= n; i++) {
            let sum = 0;
            for (let k = 1; k <= i - 1; k++) {
                sum += s[k][i] * s[k][i] * d[k];
            }
            d[i] = MyMath.signum(a[i-1][i-1] - sum);
            s[i][i] = Math.sqrt(Math.abs(a[i-1][i-1] - sum));

            const l = 1 / (s[i][i] * d[i]);
            for (let j = i + 1; j <= n; j++) {
                let SDSsum = 0;
                for (let k = 1; k <= i - 1; k++) {
                    SDSsum += s[k][i] * d[k] * s[k][j];
                }
                s[i][j] = l * (a[i-1][j-1] - SDSsum);
            }
        }

        //solve of the system (s^t * d)y = b
        y[1] = b[1] / (s[1][1] * d[1]);

        for (let i = 2; i <= n; i++) {
            let sum = 0;

            for (let j = 1; j <= i - 1; j++) {
                sum += s[j][i] * d[j] * y[j];
            }

            y[i] = (b[i] - sum) / (s[i][i] * d[i]);
        }

        //solve of the system sx = y
        x[n] = y[n] / s[n][n];

        for (let i = n - 1; i >= 1; i--) {
            let sum = 0;

            for (let k = i + 1; k <= n; k++) {
                sum += s[i][k] * x[k];
            }

            x[i] = (y[i] - sum) / s[i][i];
        }

        //output
        x.forEach(item => console.log(item))
    }
}