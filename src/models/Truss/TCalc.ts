import { MyMath } from "src/utils";
import { ICoord, TrussCalcData, TrussCalcProps } from "./TTypes";

export class TrussCalc {

    private static farmCalcDebug = process.env.REACT_APP_FARM_CALC_DEBUG === "true" || true
    static async init(NodeCoord: ICoord[], NodeV: ICoord[], Forces: number[], LinkNodes: ICoord[], LinkLength: number[], props: TrussCalcProps = {}): Promise<TrussCalcData> {

        const area: number = props.area || 225 //Площадь стержней
        const ModUpr: number = props.modUpr || 72000 // Модуль упругости 

        const Kmest: number[][][] = [] // Матрица жесткости
        const Lambda0: ICoord[] = []
        const Lambda: number[][][] = []
        const Kobs: number[][][] = []
        const IndexV: number[][] = []
        let G: number

        let K: number[][] = []
        let Va: number[] = []
        let Vi: ICoord[] = []
        let Vij: number[][][] = []
        let V: number[][][] = []
        let P: number[][][] = []

        LinkNodes.forEach((beam, i) => {
            Kmest.push(this.Kmest_i(area, ModUpr, LinkLength[i]))

            const l_i = this.Lambda_i(NodeCoord[LinkNodes[i].x], NodeCoord[LinkNodes[i].y], LinkLength[i])
            Lambda0.push(l_i)
            Lambda.push([
                [l_i.x, l_i.y, 0, 0],
                [0, 0, l_i.x, l_i.y]
            ])
            Kobs.push(this.Kobs_i(area, ModUpr, LinkLength[i], Lambda0[i]))
            IndexV.push(this.IndexV_i(NodeV[LinkNodes[i].x], NodeV[LinkNodes[i].y]))
        })

        const N_Link = LinkNodes.length
        const N_Nodes = NodeV.length
        const N_DOF = Math.max(...NodeV.map(({ x, y }) => Math.max(x, y)))

        K = this.K(N_DOF, IndexV, Kobs)

        if (MyMath.getDetMatrix(K) < 1000) throw Error("Данная конструкция (статически неопределимая) является механизмом")

        Va = this.SquareRoot(K, Forces)
        Vi = this.Vi(NodeV, Va)
        Vij = this.Vij(LinkNodes, Vi)

        for (let i = 0; i < N_Link; i++) {
            V.push(this.V_i(Lambda[i], Vij[i]))
            P.push(this.P_i(Kmest[i], V[i]))
        }

        if (this.farmCalcDebug) {
            console.log("NodeCoord, LinkNodes, NodeV", NodeCoord, LinkNodes, NodeV);
            console.log("Kobs, Kmest", Kobs, Kmest);
            console.log("Lambda0, Lambda,", Lambda0, Lambda);
            console.log("IndexV", IndexV);
            console.log("N_Link, N_Nodes, N_DOF", N_Link, N_Nodes, N_DOF);
            console.log("K, Force", K, Forces);
            console.log("Va", Va);
            console.log("Vi", Vi);
            console.log("Vij", Vij);
            console.log("V", V);
            console.log("P", P);
        }
        G = this.G(LinkLength, P)
        return { P, LinkNodes, Vi, G }
    }

    private static Kmest_i(area: number, modUpr: number, length_i: number) {
        const mnoz = (area * modUpr) / length_i
        const result = []
        result.push([mnoz, -mnoz])
        result.push([-mnoz, mnoz])
        return result
    }
    private static Lambda_i(nodeCoordOfX: ICoord, nodeCoordOfY: ICoord, length_i: number): ICoord {
        const l_x = (nodeCoordOfY.x - nodeCoordOfX.x) / length_i
        const l_y = (nodeCoordOfY.y - nodeCoordOfX.y) / -length_i
        return { x: l_x, y: l_y }
    }
    private static Kobs_i(area: number, modUpr: number, length_i: number, l_i: ICoord) {
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
    private static IndexV_i(nodeV1: ICoord, nodeV2: ICoord): number[] {
        return [
            nodeV1.x,
            nodeV1.y,
            nodeV2.x,
            nodeV2.y
        ]
    }
    private static K(n_dof: number, indexV: number[][], k_obs: number[][][]) {
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
    private static SquareRoot(_a: number[][], _b: number[]) {
        if (_a.length !== _b.length) {
            throw Error("SquareRoot - Массивы должны быть одинаковой длины")
        }

        const n = _b.length
        const a: number[][] = []
        const b: number[] = []
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
                a[j][r] = _a[j - 1][r - 1]
            }
            b[j] = _b[j - 1]
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

        const result: number[] = []
        x.forEach((item, i) => {
            if (i !== 0) result.push(item)
        })

        return result
    }

    private static Vi(nodeV: ICoord[], Va: number[]) {
        const vi: ICoord[] = []
        for (let e = 0; e < nodeV.length; e++) {
            const q: ICoord = { ...nodeV[e] }
            q.x = q.x === 0 ? 0 : Va[q.x - 1]
            q.y = q.y === 0 ? 0 : Va[q.y - 1]
            vi.push(q)
        }
        return vi
    }
    private static Vij(linkNodes: ICoord[], vi: ICoord[]) {
        const vij: number[][][] = []
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
    private static V_i(l: number[][], vij: number[][]) {
        const v: number[][] = MyMath.multMatrxiV2(l, vij)
        return v
    }
    private static P_i(k: number[][], v: number[][]) {
        const p: number[][] = MyMath.multMatrxiV2(k, v)
        return p
    }
    private static G(LinkLength: number[], p: number[][][]): number {
        let sum = 0
        LinkLength.forEach((b, i) => {
            sum += b * Math.abs(p[i][0][0])
        })
        return sum
    }
}
export default TrussCalc