import * as React from 'react'
import { IFarmStore } from './farmReducer';
import { Stage, Layer} from "react-konva"
import Konva from "konva"
import './style.css'
import { ClassFarm, ClassNode } from 'src/models/Farm';
import { UINode } from 'src/components/UIFarm';

export interface IFarmProps extends IFarmStore {
    incCounter: () => void
}
export interface IFarmState {
    stageWidth: number,
    stageHeight: number,
    farm: ClassFarm
}
export default class UIFarm extends React.Component<IFarmProps, IFarmState>{
    // private refStar: React.RefObject<Konva.Star>;
    constructor(props: IFarmProps) {
        super(props)

        this.state = {
            stageHeight: window.innerHeight * 0.75,
            stageWidth: window.innerWidth * 0.75,
            farm: new ClassFarm()
        }
        // this.refStar = React.createRef();
        this.addNode = this.addNode.bind(this)
        this.state.farm.addNode(100, 100, 0)
    }
    addNode(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target.getStage() === e.target) {

            const { layerX, layerY } = e.evt
            this.state.farm.addNode(layerX, layerY, 0)
            this.setState({ farm: this.state.farm })
        }

    }
    dragNode(node: ClassNode, e: Konva.KonvaEventObject<DragEvent>) {
        const farmNode = this.state.farm.getNode(node.id)
        farmNode.x = e.evt.layerX
        farmNode.y = e.evt.layerY
        this.setState({farm:this.state.farm})

    }
    render() {
        const { stageHeight, stageWidth } = this.state
        return (
            <div>
                <Stage
                    height={stageHeight}
                    width={stageWidth}
                    className="stage"
                    style={{
                        height: stageHeight + 'px',
                        width: stageWidth + 'px',
                    }}
                    onClick={this.addNode}
                >
                    <Layer className="layer">
                        {this.state.farm.nodes.map(node => (
                            <UINode
                                key={node.id}
                                node={node}
                                dragNode={this.dragNode.bind(this)} />
                            // <Circle
                            //     key={node.id}
                            //     radius={10}
                            //     x={node.x}
                            //     y={node.y}
                            //     fill="red"
                            //     draggable
                            //     onDragMove={this.dragNode}
                            // />
                        ))}
                    </Layer>
                </Stage>
            </div>
        )
    }
}