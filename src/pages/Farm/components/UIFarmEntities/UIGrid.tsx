import * as React from 'react'
import { Line } from 'react-konva'

export interface UIGridProps {
    widthCell: number,
    heightCell: number,
    heightBox: number,
    widthBox: number

}
class UIGrid extends React.Component<UIGridProps>{
    private countOfX: number = this.props.widthBox / this.props.widthCell
    private countOfY: number = this.props.heightBox / this.props.heightCell
    constructor(props: UIGridProps){
        super(props)
    }
    shouldComponentUpdate(nextProps: Readonly<UIGridProps>, nextState: Readonly<{}>){
        return nextProps.widthBox !== this.props.widthBox
    }
    viewRows() {
        const rows = []
        for (let index = 0; index < this.countOfY; index++) {
            rows.push(<Line
                points={[
                    0,
                    index * this.props.heightCell,
                    this.props.widthBox,
                    index * this.props.heightCell,

                ]}
                stroke="#ddd"
                strokeWidth={1}
                key={index}
            />)
        }
        return rows
    }

    viewColumns() {
        const columns = []
        for (let index = 0; index < this.countOfX; index++) {

            columns.push(<Line
                points={[
                    index * this.props.widthCell,
                    0,
                    index * this.props.widthCell,
                    this.props.heightBox,

                ]}
                stroke="#ddd"
                strokeWidth={1}
                key={index}
            />)

        }
        return columns
    }
    render() {
        console.log("pop");

        return (
            <React.Fragment>
                {this.viewColumns()}
                {this.viewRows()}

            </React.Fragment>
        )
    }
}
export default UIGrid