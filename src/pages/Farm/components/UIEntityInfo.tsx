import * as React from 'react'
import { Theme, createStyles, withStyles, Typography, IconButton, Box, Divider } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Delete as DeleteIcon, Info as InfoEntityIcon } from '@material-ui/icons';
import { Sidebar } from 'src/components';
import { Entity } from 'src/models/Farm/ModelEntity';
import { instanceOfNode, FarmNode, NodeFixation } from 'src/models/Farm/ModelNode';
import { instanceOfBeam, Beam } from 'src/models/Farm/ModelBeam';
import { Farm } from 'src/models/Farm/ModelFarm';
import { Force } from 'src/models/Farm/ModelForce';

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
    entity?: Entity | undefined,
    onDelete(entity: Entity): void
}

interface EntityInfoState {

}
const TextRow = ({ text, className }: { text: string, className?: string }) =>     (
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
            {text.map((str,i) => (
                <Typography variant="subtitle2" key={i}>
                    {str}
                </Typography>
            ))}
            <Divider />
        </React.Fragment>
    )
}
class UIEntityInfo extends React.PureComponent<EntityInfoProps, EntityInfoState>{
    constructor(props: EntityInfoProps) {
        super(props)
        this.state = {
        }
    }
    viewForceInfo(force: Force) {
        return (
            <TextRows text={[`Сила: ${force.value} H`, `Угол: ${force.angle}°`]} />
        )
    }
    viewFixationInfo(node: FarmNode) {
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
    NodeInfo(node: FarmNode) {
        const { classes, onDelete } = this.props
        console.log(node);
        
        return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    Узел {node.name}
                </Typography>
                <TextRows text={[`X: ${node.x}`,`Y: ${node.y}`]}/>
                {node.withNewPosition && (<TextRows text={[`ΔX: ${node.newX}`,`ΔY: ${node.newY}`]}/>)}
                {node.forceX && this.viewForceInfo(node.forceX)}
                {node.forceY && this.viewForceInfo(node.forceY)}
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
    BeamInfo(beam: Beam) {
        const { classes, onDelete } = this.props
        return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    Стержень {beam.name}
                </Typography>
                <TextRow text={`Длина: ${beam.length || Farm.getBeamLength(beam)}`}/>
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
    viewInfo(entity: Entity | undefined) {
        if (instanceOfNode(entity)) return this.NodeInfo(entity)
        else if (instanceOfBeam(entity)) return this.BeamInfo(entity)
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