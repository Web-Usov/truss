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
    hundleClear?:(e: React.FormEvent<HTMLButtonElement>) => void,
    hundleCalculate?:(e: React.FormEvent<HTMLButtonElement>) => void,
    disabled?:boolean
}

const UIHeader: React.FC<UIHeaderProps> = (
    { 
        classes, 
        hundleSave = (e) => {alert("Буедет реализовано в будущем")},
        hundleClear = (e) => {alert("Буедет реализовано в будущем")},
        hundleCalculate = (e) => {alert("Буедет реализовано в будущем")},
        disabled = false
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
                onClick={hundleCalculate}
                disabled={disabled}
            >
                Расчет
            </Button>
            <Button
                color="secondary"
                variant="contained"
                className={classes.btn}
                onClick={hundleSave}
                disabled={disabled}
            >
                Сохранить
            </Button>
            <Button
                color="secondary"
                variant="contained"
                className={classes.btn}
                onClick={hundleClear}
                disabled={disabled}
            >
                Очистить
            </Button>
        </AppBar>
    )
}

export default withStyles(styles)(UIHeader)