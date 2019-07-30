import * as React from 'react'
import { Theme, createStyles, withStyles, Typography, IconButton, Box, Divider } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Delete as DeleteIcon, Info as InfoEntityIcon } from '@material-ui/icons';
import { Sidebar } from 'src/components';
import { Entity } from 'src/models/Farm/ModelEntity';
import { instanceOfNode } from 'src/models/Farm/ModelNode';
import { instanceOfBeam } from 'src/models/Farm/ModelBeam';

const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2)
    },
    subTitle: {
        fontSize: 14,
    },
    title: {
        marginBottom:theme.spacing(2)
    },
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
    getTypeStr(entity: Entity): string {
        if (instanceOfNode(entity)) return "Узел"
        else if (instanceOfBeam(entity)) return "Стержень"
        else return "Элемент"
    }
    viewInfo(entity: Entity | undefined) {
        const { classes, onDelete } = this.props
        if (entity) return (
            <Box className={classes.root}>
                <Typography className={classes.subTitle} color="textSecondary" gutterBottom>
                    {this.getTypeStr(entity)}
                </Typography>
                <Typography variant="h5" className={classes.title}>
                    {entity.name}
                </Typography>
                <IconButton aria-label="Delete" onClick={() => onDelete(entity)}>
                    <DeleteIcon />
                </IconButton>
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