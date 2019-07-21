import * as React from 'react'
import { Theme, createStyles, withStyles, AppBar, Toolbar} from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';

const styles = (theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    }
})




export interface UIToolBarProps extends WithStyles<typeof styles> {
    
}

const UIToolBar: React.FC<UIToolBarProps> = ({  classes }) => {
    
    return (
        <AppBar 
            position="fixed" 
            className={classes.appBar}
            color="primary">
            <Toolbar >
               
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(styles)(UIToolBar)