import * as React from 'react';
import { Line } from 'react-konva';

export interface UIGridProps {
    widthCell: number,
    heightCell: number,
    heightBox: number,
    widthBox: number

}

const viewColumns = (widthCell: number, heightBox: number, countOfX: number) => {
    const columns = []
    for (let index = 0; index < countOfX; index++) {

        columns.push(<Line
            points={[
                index * widthCell,
                0,
                index * widthCell,
                heightBox,

            ]}
            stroke="#ddd"
            strokeWidth={1}
            key={index}
        />)

    }
    return columns
}
const viewRows = (heightCell: number, widthBox: number, countOfY: number) => {
    const rows = []
    for (let index = 0; index < countOfY; index++) {
        rows.push(<Line
            points={[
                0,
                index * heightCell,
                widthBox,
                index * heightCell,

            ]}
            stroke="#ddd"
            strokeWidth={1}
            key={index}
        />)
    }
    return rows
}
const UIGrid: React.FC<UIGridProps> = ({ heightBox, heightCell, widthBox, widthCell }) => {
    const countOfX: number = widthBox / widthCell
    const countOfY: number = heightBox / heightCell
    console.log("UIGrid");

    return (
        <React.Fragment>
            {viewColumns(widthCell, heightBox, countOfX)}
            {viewRows(heightCell, widthBox, countOfY)}

        </React.Fragment>
    )
}
export default React.memo(UIGrid)