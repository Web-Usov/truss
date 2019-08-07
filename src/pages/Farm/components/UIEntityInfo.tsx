import * as React from 'react'
import { Theme, createStyles, withStyles, Typography, IconButton, Box, Divider } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Delete as DeleteIcon, Info as InfoEntityIcon } from '@material-ui/icons';
import { Sidebar } from 'src/components';
import { Entity } from 'src/models/Farm/ModelEntity';
import { instanceOfNode, FarmNode, NodeFixation } from 'src/models/Farm/ModelNode';
import { instanceOfBeam } from 'src/models/Farm/ModelBeam';
import { Farm } from 'src/models/Farm/ModelFarm';
import { Force } from 'src/models/Farm/ModelForce';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2)
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    btnGroup:{
        marginTop:theme.spacing(2)
    }
})




interface EntityInfoProps extends WithStyles<typeof styles> {
    entity?: Entity | undefined,
    onDelete(entity: Entity): void
}

interface EntityInfoState {

}

class UIEntityInfo extends React.PureComponent<EntityInfoProps, EntityInfoState>{
    constructor(props: EntityInfoProps) {
        super(props)
        this.state = {

        }
    }
    viewForceInfo(force: Force) {
        return (
            <React.Fragment>
                <Typography variant="subtitle2">
                    Сила: {force.value} H
                </Typography>
                <Typography variant="subtitle2">
                    Угол: {force.angle}
                </Typography>
                <Divider />

            </React.Fragment>
        )
    }
    viewFixationInfo(node : FarmNode){
        switch (node.fixation) {
            case NodeFixation.X : return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        Фиксация по оси X
                    </Typography>
                    <Divider />    
                </React.Fragment>
            )
            case NodeFixation.Y : return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        Фиксация по оси Y
                    </Typography>
                    <Divider />    
                </React.Fragment>
            )
            case NodeFixation.XY : return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        Фиксация по оси X и Y
                    </Typography>
                    <Divider />    
                </React.Fragment>
            )
            default : return undefined
        }
    }
    viewInfo(entity: Entity | undefined) {
        const { classes, onDelete } = this.props
        if (instanceOfNode(entity)) return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    Узел {entity.name}
                </Typography>
                {entity.forceX && this.viewForceInfo(entity.forceX)}
                {entity.forceY && this.viewForceInfo(entity.forceY)}
                {this.viewFixationInfo(entity)} 
                <div className={classes.btnGroup}>
                    <IconButton
                        aria-label="Delete"
                        onClick={() => onDelete(entity)}
                    >
                        <DeleteIcon />
                    </IconButton>

                </div>
            </Box>
        )
        else if (instanceOfBeam(entity)) return (
            <Box className={classes.root}>
                <Typography variant="h6" className={classes.title}>
                    Стержень {entity.name}
                </Typography>
                <Typography variant="subtitle2">
                    Длина: {entity.length || Farm.getBeamLength(entity)}
                </Typography>
                <Divider />    
                <div className={classes.btnGroup}>
                    <IconButton
                        aria-label="Delete"
                        onClick={() => onDelete(entity)}
                    >
                        <DeleteIcon />
                    </IconButton>

                </div>
            </Box>
        )
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