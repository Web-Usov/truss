import { FarmNode, NodeFixation } from "src/models/Farm/ModelNode";
import { Beam } from "src/models/Farm/ModelBeam";
import { FarmFactory } from "src/models/Farm/FarmFactory";

export default () => {
    let nodes: FarmNode[] = []
    let beams: Beam[] = []

    nodes = FarmFactory.createNodes(
        [
            {
                x: 0,
                y: 1000,
                fixation: NodeFixation.XY,
            },
            {
                x: 3000,
                y: 1000,
                fixation: NodeFixation.Y,
            }
        ],
        [
            {
                x: 1000,
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