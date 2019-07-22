import * as React from 'react'
import { Line } from 'react-konva'

export interface UIGridProps {
    widthCell: number,
    heightCell: number,
    heightBox: number,
    widthBox: number

}

const UIGrid: React.FC<UIGridProps> = ({ widthCell, heightCell, heightBox, widthBox }) => {
    const countOfX: number = widthBox / widthCell
    const countOfY: number = heightBox / heightCell
    const viewRows = () => {
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

    const viewColumns = () => {
        const columns = []
        for (let index = 0; index < countOfX; index++) {

            columns.push(<Line
                points={[
                    index*widthCell,
                    0,
                    index*widthCell,
                    heightBox,

                ]}
                stroke="#ddd"
                strokeWidth={1}
                key={index}
            />)

        }
        return columns
    }
    return (
        <React.Fragment>
            {viewColumns()}
            {viewRows()}

        </React.Fragment>
    )
}

export default UIGrid