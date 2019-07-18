import * as React from 'react'
import { Theme, createStyles, withStyles,  Card, CardContent, Typography, CardActions,  IconButton } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Node, Beam, Entity } from 'src/models/Farm';
import { Delete as DeleteIcon } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width: 250,
        borderLeftColor: theme.palette.grey[600],
        borderLeft: "solid 2px",
        overflowY: 'auto',
    },
    card: {
        //   minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
})




interface EntityInfoProps extends WithStyles<typeof styles> {
    entity?: Entity | undefined,
    onDelete(entity:Entity):void
}

interface EntityInfoState {

}

class UIEntityInfo extends React.PureComponent<EntityInfoProps, EntityInfoState>{
    constructor(props: EntityInfoProps) {
        super(props)
        this.state = {

        }
    }
    getTypeStr(entity: Entity):string{
        if(entity instanceof Node) return "Узел"
        else if(entity instanceof Beam) return "Луч"
        else return "Элемент"
    }
    viewCard(entity: Entity | undefined) {
        const { classes,onDelete } = this.props
        if(entity) return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {this.getTypeStr(entity)}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {entity.name}
                    </Typography>                    
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="Delete" onClick={() => onDelete(entity)}>
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
    render() {
        const { classes,entity } = this.props

        return (
            <div className={classes.root}>
                {this.viewCard(entity)}
            </div>
        )
    }

}

export default withStyles(styles)(UIEntityInfo)