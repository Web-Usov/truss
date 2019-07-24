import * as React from 'react'
import { Theme, createStyles, withStyles, Button } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { AppBar } from 'src/components';

const styles = (theme: Theme) => createStyles({
    root:{

    },
    btn:{
        marginLeft:theme.spacing(2),
        marginRight:theme.spacing(2)
    },
    grow:{
        flexGrow:1
    }
})

export interface UIHeaderProps extends WithStyles<typeof styles> {
    hundleSave?:(e: React.FormEvent<HTMLButtonElement>) => void,
    hundleClear?:(e: React.FormEvent<HTMLButtonElement>) => void
}

const UIHeader: React.FC<UIHeaderProps> = (
    { 
        classes, 
        hundleSave = (e) => {alert("Буедет реализовано в будущем")},
        hundleClear = (e) => {alert("Буедет реализовано в будущем")},
    }) => {

    return (
        <AppBar 
            className={classes.root}
        >
            <div className={classes.grow}/>
            <Button
                color="secondary"
                variant="contained"
                className={classes.btn}
                onClick={hundleSave}
            >
                Сохранить
            </Button>
            <Button
                color="secondary"
                variant="contained"
                className={classes.btn}
                onClick={hundleClear}
            >
                Очистить
            </Button>
        </AppBar>
    )
}

export default withStyles(styles)(UIHeader)