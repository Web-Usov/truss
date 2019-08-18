import * as React from 'react'
import { Circle,  Text, Group, Arrow, Line } from 'react-konva'
import Konva from 'konva'
import { FarmNode, NodeFixation } from 'src/models/Farm/ModelNode';
import { consts } from 'src/static';
import { Force } from 'src/models/Farm/ModelForce';
import { KonvaEventObject } from 'konva/types/Node';
import { UI } from 'src/utils';
import { UIModes } from 'src/utils/UI';

const size = consts.UI.nodeSize
interface UINodeProps {
    node: FarmNode,
    drag(e: Konva.KonvaEventObject<DragEvent>, node: FarmNode): void
    onClick(e: Konva.KonvaEventObject<MouseEvent>, node: FarmNode): void
    mode: UIModes,
    selected: boolean,    
    viewNewPos?:boolean
}
class UINode extends React.Component<UINodeProps>{
    refGroup: React.RefObject<Konva.Group>
    constructor(props: UINodeProps) {
        super(props)
        this.viewForce = this.viewForce.bind(this)
        this.refGroup = React.createRef()
    }
    shouldComponentUpdate(nextProps: UINodeProps) {
        if(this.props.viewNewPos) return false
        return (
            nextProps.node !== this.props.node ||
            nextProps.mode !== this.props.mode ||
            nextProps.selected !== this.props.selected
        )
    }
    componentDidMount(){
        const {current:group} = this.refGroup
        const {node, viewNewPos} = this.props
        if(group && viewNewPos){
            group.to({
                x:node.newX / consts.UI.koefOnGrid,
                Y:node.newY / consts.UI.koefOnGrid
            })
        }
    }
    viewForce(force: Force) {
        const {viewNewPos } = this.props
        if(!viewNewPos)  return (
            <React.Fragment>
                <Arrow
                    points={[
                        0,
                        0,
                        consts.UI.cellSize,
                        0,
                    ]}
                    stroke={UI.theme.palette.grey[300]}
                    strokeWidth={size / 3}
                    shadowBlur={2}
                    pointerLength={consts.UI.cellSize / 10}
                    pointerWidth={consts.UI.cellSize / 10}
                    hitStrokeWidth={size * 2}
                    rotation={force.value > 0 ? force.angle : 180 + force.angle}
                />
                <Text
                    x={force.angle === 0 ? (force.value > 0 ? consts.UI.cellSize / 3 : -consts.UI.cellSize) : consts.UI.cellSize / 3}
                    y={force.angle === 90 ? (force.value > 0 ? consts.UI.cellSize / 3 : -consts.UI.cellSize / 2) : -consts.UI.cellSize / 1.5}
                    text={force.value + " H"}
                />
            </React.Fragment>

        )
    }
    viewFixation(angle: 0 | 90) {
        return (<Group
            x={0}
            y={0}
            rotation={angle}
        >
            <Line
                points={[
                    0, 0,
                    0, consts.UI.cellSize,
                    -consts.UI.cellSize / 2, consts.UI.cellSize,
                    consts.UI.cellSize / 2, consts.UI.cellSize,
                ]}
                stroke={UI.theme.palette.grey[300]}
                strokeWidth={size / 4}
                shadowBlur={2}
            />
            <Circle
                radius={size / 2}
                fill={UI.theme.palette.grey[500]}
                x={0}
                y={consts.UI.cellSize - (size / 1.7)}
            />
        </Group>)
    }
    render() {
        const { onClick, mode, selected, node, viewNewPos } = this.props
        const x =  node.x / consts.UI.koefOnGrid
        const y =  node.y / consts.UI.koefOnGrid
        
        // const x = viewNewPos ? node.newX / consts.UI.koefOnGrid : node.x / consts.UI.koefOnGrid
        // const y = viewNewPos ? node.newY / consts.UI.koefOnGrid : node.y / consts.UI.koefOnGrid
        if(viewNewPos){
            if(node.x === node.newX && node.y === node.newY)
            return <React.Fragment/>
        }

        return (
            <Group
            
                opacity={viewNewPos ? 0.3 : 1}
                x={x}
                y={y}
                _useStrictMode
                onClick={viewNewPos ? () => {} : (e: any) => onClick(e, node)}
                ref={this.refGroup}
                
            >
                {node.forceX && this.viewForce(node.forceX)}
                {node.forceY && this.viewForce(node.forceY)}
                {node.fixation === NodeFixation.X && this.viewFixation(90)}
                {node.fixation === NodeFixation.Y && this.viewFixation(0)}
                {node.fixation === NodeFixation.XY && this.viewFixation(90)}
                {node.fixation === NodeFixation.YX && this.viewFixation(0)}
                <Circle
                    radius={size}
                    x={0}
                    y={0}
                    fill={UI.getNodeColor(node)}
                    shadowBlur={selected && !viewNewPos ? 8 : 2}
                    stroke={UI.getNodeStorkeColor(node,mode)}
                    strokeWidth={UI.getNodeStorkeWidth(node, mode)}
                    hitStrokeWidth={viewNewPos ? 0 : size * 2}
                />
                <Text
                    x={-size}
                    y={-size / 2 - 1}
                    align="center"
                    fontSize={18}
                    fill="#fff"
                    shadowBlur={8}
                    fontFamily='Trebuchet MS'
                    width={size * 2}
                    verticalAlign="middle"
                    text={node.name}
                />
                <Circle
                    radius={size}
                    x={0}
                    y={0}
                    onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                        e.target.to({
                            x: 0,
                            y: 0,
                        })
                    }}
                    hitStrokeWidth={viewNewPos ? 0 : size * 2}
                    draggable={mode === UIModes.move && !node.isStatic && !viewNewPos}
                    onMouseEnter={viewNewPos ? () => {} : (e: any) => UI.nodeMouseEnter(e, node, mode)}
                    onMouseLeave={viewNewPos ? () => {} :(e: any) => UI.nodeMouseLeave(e)}
                    onDragMove={(e: KonvaEventObject<DragEvent>) => this.props.drag(e, node)}
                />
            </Group>
        )
    }
}
export default UINode