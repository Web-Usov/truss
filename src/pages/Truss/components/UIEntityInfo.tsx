import { Box, createStyles, Divider, IconButton, Theme, Typography, withStyles } from '@material-ui/core';
import { Delete as DeleteIcon, Info as InfoEntityIcon } from '@material-ui/icons';
import { WithStyles } from '@material-ui/styles';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Sidebar } from 'src/components';
import { TBeam, TEntity, TNode } from 'src/models/Truss';
import { NodeFixation } from 'src/models/Truss/TTypes';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    btnGroup: {
        marginTop: theme.spacing(2)
    }
})

interface EntityInfoProps extends WithStyles<typeof styles> {
    entity?: TEntity,
    onDelete?(entity: TEntity): void
}

interface EntityInfoState {

}
const TextRow = ({ text, className }: { text: string, className?: string }) => (
    <React.Fragment>
        <Typography variant="subtitle2">
            {text}
        </Typography>
        <Divider />
    </React.Fragment>
)
const TextRows = ({ text, className }: { text: string[], className?: string }) => {
    if (text.length === 0) return (<React.Fragment />)
    return (
        <React.Fragment>
            {text.map((str, i) => (
                <Typography variant="subtitle2" key={i}>
                    {str}
                </Typography>
            ))}
            <Divider />
        </React.Fragment>
    )
}
@observer
class UIEntityInfo extends React.PureComponent<EntityInfoProps, EntityInfoState>{
    constructor(props: EntityInfoProps) {
        super(props)
        this.state = {
        }
    }
    viewFixationInfo(node: TNode) {
        switch (node.fixation) {
            case NodeFixation.X: return (
                <TextRow text={"Фиксация по оси X"} />
            )
            case NodeFixation.Y: return (
                <TextRow text={"Фиксация по оси Y"} />
            )
            case NodeFixation.XY: return (
                <TextRow text={"Фиксация по осям Х и Y"} />
            )
            default: return undefined
        }
    }
    NodeInfo(node: TNode) {
        const { classes, onDelete = () => { } } = this.props
        return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    Узел {node.name}
                </Typography>
                <TextRows text={[`X: ${node.coord.x} мм`, `Y: ${node.coord.y} мм`]} />
                <TextRows text={[`ΔX: ${node.dCoord.x} мм`, `ΔY': ${node.dCoord.y} мм`]} />
                {node.forceX !== 0 && (<TextRow text={`Сила по оси Х: ${node.forceX} H`} />)}
                {node.forceY !== 0 && (<TextRow text={`Сила по оси Y: ${node.forceY} H`} />)}
                {this.viewFixationInfo(node)}
                <div className={classes.btnGroup}>
                    <IconButton
                        aria-label="Delete"
                        onClick={() => onDelete(node)}
                    >
                        <DeleteIcon />
                    </IconButton>

                </div>
            </Box>
        )
    }
    BeamInfo(beam: TBeam) {
        const { classes, onDelete = () => { } } = this.props
        return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    Стержень {beam.name}
                </Typography>
                <TextRow text={`Длина: ${beam.length} мм`} />
                <TextRows text={[`Усилия в стержне`, `В начале: ${beam.startForce} H`, `В конце: ${beam.endForce} H`]} />
                <div className={classes.btnGroup}>
                    <IconButton
                        aria-label="Delete"
                        onClick={() => onDelete(beam)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            </Box>
        )
    }
    viewInfo(entity: TEntity | undefined) {
        if (entity instanceof TNode) return this.NodeInfo(entity)
        else if (entity instanceof TBeam) return this.BeamInfo(entity)
    }
    render() {
        const { entity } = this.props
        return (
            <Sidebar
                anchor="right"
                title="Информация о выбранном объекте"
                btnIcon={(<InfoEntityIcon />)}
            >
                {this.viewInfo(entity)}
                <Divider />
            </Sidebar>
        )
    }

}

export default withStyles(styles)(UIEntityInfo)