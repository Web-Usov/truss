import * as React from 'react'
import { Theme, createStyles, withStyles,  Card, CardContent, Typography, CardActions,  IconButton } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Node, Beam, Entity } from 'src/models/Farm';
import { Delete as DeleteIcon, Info as InfoEntityIcon } from '@material-ui/icons';
import { UIDrawer } from '.';

const styles = (theme: Theme) => createStyles({
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
            <Card>
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
        const { entity } = this.props

        return (
            <UIDrawer
                anchor="right"
                btnTitle="Информация об выбранном объекте"
                btnIcon={(<InfoEntityIcon/>)}
            >                
                {this.viewCard(entity)}
            </UIDrawer>
        )
    }

}

export default withStyles(styles)(UIEntityInfo)