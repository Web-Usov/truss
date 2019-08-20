import { Box, createStyles, makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow, Theme, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TrussCalcData } from 'src/models/Truss/TTypes';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // width: '100%',
            overflowX: 'auto',
            paddingTop: theme.spacing(2)
        },
        table: {
            minWidth: 450,
        },
        tableBox: {
            marginBottom: theme.spacing(2)
        },
        title: {
            padding: theme.spacing(2),
        },
    }),
);

interface Props extends TrussCalcData { }


const UICalcData: React.FC<Props> = observer((props) => {
    const classes = useStyles(props);
    const { Vi, P, LinkNodes, G } = props

    const viewVi = (vi: typeof props.Vi) => {
        const rows: string[][] = []
        vi.forEach((n, i) => {
            rows.push([
                (i + 1).toString(),
                n.x.toFixed(4),
                n.y.toFixed(4)
            ])
        })
        return viewTable("Перемещения узлов", ['Узел', 'По оси X (мм)', 'По оси Y (мм)'], rows)
    }
    const viewP = (p: typeof props.P, beams: typeof props.LinkNodes) => {
        const rows: string[][] = []
        p.forEach((b, i) => {
            rows.push([
                `${beams[i].x + 1} - ${beams[i].y + 1}`,
                b[0][0].toFixed(0),
            ])
        })
        return viewTable("Усилия в стержнях", ['Стержень', 'Усилие (H)'], rows)
    }

    const viewTable = (title: string, head: string[], rows: string[][]) => {
        return <Paper className={classes.tableBox}>
            <Typography variant="h6" className={classes.title}>
                {title}
            </Typography>
            <Table className={classes.table}>
                {viewHead(head)}
                <TableBody>
                    {rows.map(row => viewBodyRow(row))}
                </TableBody>
            </Table>
        </Paper>
    }

    return (
        <Box className={classes.root}>
            <Paper className={classes.tableBox}>
                <Typography variant="h6" className={classes.title}>
                    G: {Math.round(G)} (Н·мм)
                </Typography>
            </Paper>
            {viewP(P, LinkNodes)}
            {viewVi(Vi)}
        </Box>
    );
})

const viewHead = (cells: string[]) => {
    return <TableHead>
        <TableRow>
            {cells.map(cell => (<TableCell key={cell}>{cell}</TableCell>))}
        </TableRow>
    </TableHead>
}
const viewBodyRow = (cells: string[]) => {
    return <TableRow >
        {cells.map(cell => (<TableCell key={cell}>{cell}</TableCell>))}
    </TableRow>
}

export default UICalcData