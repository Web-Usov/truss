import { ICoord } from "./ModelFarm";
import { MyMath } from "src/utils";

export class FarmMath {
    static init() {

    }

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
    static IndexV_i(nodeV1: ICoord, nodeV2: ICoord): number[] {
        return [
            nodeV1.x,
            nodeV1.y,
            nodeV2.x,
            nodeV2.y
        ]
    }
    static K(n_dof: number, indexV: number[][], k_obs: number[][][]) {
        const K: number[][] = []

        for (let t = 0; t < n_dof; t++) {
            const row: number[] = []
            for (let r = 0; r < n_dof; r++) {
                row.push(0)
            }
            K.push(row)
        }

        for (let e = 0; e < indexV.length; e++) {
            for (let i = 0; i < 4; i++) {
                const A = indexV[e][i]
                if (A !== 0)
                    for (let j = 0; j < 4; j++) {
                        const B = indexV[e][j]
                        if (B !== 0)
                            K[B - 1][A - 1] = K[B - 1][A - 1] + k_obs[e][i][j]
                    }

            }
        }
        return K
    }
    static SquareRoot(_a: number[][], _b: number[]) {
        if (_a.length !== _b.length) {
            throw Error("SquareRoot - Массивы должны быть одинаковой длины")
        }

        const n = _b.length
        const a : number[][] = []
        const b : number[] = []
        const x: number[] = []
        const d: number[] = []
        const s: number[][] = []
        const y: number[] = []

        for (let i = 0; i < n + 1; i++) {
            const row: number[] = []
            for (let r = 0; r < n; r++) {
                row.push(0)
            }
            s.push(row)
            a.push(row)
            b.push(0)
            x.push(0)
            d.push(0)
            y.push(0)            
        }

        for (let j = 1; j <= n; j++) {
            for (let r = 0; r <= n; r++) {
                a[j][r] = _a[j-1][r-1]               
            }
            b[j] = _b[j-1]                  
        }

        d[1] = MyMath.signum(a[1][1]);
        s[1][1] = Math.sqrt(Math.abs(a[1][1]));
        for (let j = 2; j <= n; j++) {
            s[1][j] = a[1][j] / (s[1][1] * d[1]);
        }

        for (let i = 2; i <= n; i++) {
            let sum = 0;
            for (let k = 1; k <= i - 1; k++) {
                sum += s[k][i] * s[k][i] * d[k];
            }
            d[i] = MyMath.signum(a[i][i] - sum);
            s[i][i] = Math.sqrt(Math.abs(a[i][i] - sum));

            const l = 1 / (s[i][i] * d[i]);
            for (let j = i + 1; j <= n; j++) {
                let SDSsum = 0;
                for (let k = 1; k <= i - 1; k++) {
                    SDSsum += s[k][i] * d[k] * s[k][j];
                }
                s[i][j] = l * (a[i][j] - SDSsum);
            }
        }

        y[1] = b[1] / (s[1][1] * d[1]);

        for (let i = 2; i <= n; i++) {
            let sum = 0;

            for (let j = 1; j <= i - 1; j++) {
                sum += s[j][i] * d[j] * y[j];
            }

            y[i] = (b[i] - sum) / (s[i][i] * d[i]);
        }

        x[n] = y[n] / s[n][n];

        for (let i = n - 1; i >= 1; i--) {
            let sum = 0;

            for (let k = i + 1; k <= n; k++) {
                sum += s[i][k] * x[k];
            }

            x[i] = (y[i] - sum) / s[i][i];
        }

        const result : number[] = []
        x.forEach((item,i) => {
            if(i !== 0) result.push(item)
        })

        return result
    }

    static Vi(nodeV : ICoord[], Va:number[]){        
        const vi:ICoord[] = []
        for (let e = 0; e < nodeV.length; e++) {            
            const q : ICoord = {...nodeV[e]}
            q.x = q.x === 0 ? 0 : Va[q.x-1]
            q.y = q.y === 0 ? 0 : Va[q.y-1]
            vi.push(q)
        }
        return vi
    }
    static Vij(linkNodes : ICoord[], vi:ICoord[]){
        const vij:number[][][] = []
        for (let e = 0; e < linkNodes.length; e++) {            
            const n_start = linkNodes[e].x
            const n_ends = linkNodes[e].y
            
            vij.push([
                [vi[n_start].x],
                [vi[n_start].y],
                [vi[n_ends].x],
                [vi[n_ends].y],
            ])
        }
        return vij
    }
    static V_i(l:number[][], vij:number[][]){
        const v: number[][] = MyMath.multMatrxiV2(l ,vij)
        return v
    }
    static P_i(k:number[][], v:number[][]){
        const p: number[][] = MyMath.multMatrxiV2(k ,v)
        return p
    }
}