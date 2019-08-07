import { FarmNode, NodeFixation } from "src/models/Farm/ModelNode";
import { Beam } from "src/models/Farm/ModelBeam";
import { Farm } from "src/models/Farm/ModelFarm";

export default () => {
    let nodes: FarmNode[] = []
    let beams: Beam[] = []

    nodes = Farm.createNodes(
        [
            {
                x: 1000,
                y: 1000,
                fixation: NodeFixation.XY,
            },
            {
                x: 1300,
                y: 1000,
                fixation: NodeFixation.Y,
            }
        ],
        [
            {
                x: 1100,
                y: 1000,
                angle: 90,
                value: 9000
            }
        ],
        [
            // {
            //     x: 1000,
            //     y: 1000
            // }, {
            //     x: 700,
            //     y: 700
            // }, {
            //     x: 1000,
            //     y: 700
            // }
        ]
    )

    return { nodes, beams }
}