import * as React from 'react'
import { Theme, createStyles, withStyles, Button, ButtonGroup, Fab, Icon, Tooltip } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { AppBar } from 'src/components';
import { Build as CalcIcon, SaveAlt as SaveIcon, DeleteForever as ClearIcon } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    root: {

    },
    btnIcon: {
        fontSize: 18,
        marginTop: 3,
        marginBottom: 3,
    },
    grow: {
        flexGrow: 1
    }
})

export interface UIHeaderProps extends WithStyles<typeof styles> {
    hundleSave?: (e: React.FormEvent<HTMLButtonElement>) => void,
    hundleClear?: (e: React.FormEvent<HTMLButtonElement>) => void,
    hundleCalculate?: (e: React.FormEvent<HTMLButtonElement>) => void,
    disabled?: boolean
}

const UIHeader: React.FC<UIHeaderProps> = (
    {
        classes,
        hundleSave = (e) => { alert("Буедет реализовано в будущем") },
        hundleClear = (e) => { alert("Буедет реализовано в будущем") },
        hundleCalculate = (e) => { alert("Буедет реализовано в будущем") },
        disabled = false
    }) => {
    const btns = [
        {
            text: "Расчет фермы",
            action: hundleCalculate,
            icon: (<CalcIcon className={classes.btnIcon} />)
        },
        {
            text: "Сохранить ферму в кэш",
            action: hundleSave,
            icon: (<SaveIcon className={classes.btnIcon} />)
        },
        {
            text: "Очистить холст",
            action: hundleClear,
            icon: (<ClearIcon className={classes.btnIcon} />)
        }
    ]
    const Btn = (text: string = "", action: (e: React.FormEvent<HTMLButtonElement>) => void, icon: JSX.Element) => (
        <Tooltip
            title={text}>
            <Button
                onClick={action}
                disabled={disabled}
            >{icon}</Button>
        </Tooltip>
    )

    return (
        <AppBar
            className={classes.root}
        >

            <ButtonGroup
                size="small"
                color="secondary"
                variant="contained">
                {btns.map(b => (
                    Btn(b.text, b.action, b.icon)
                ))}
            </ButtonGroup>
            <div className={classes.grow} />
            <Fab
                color="secondary"
                size="small">
                <Icon>priority_high</Icon>
            </Fab>
        </AppBar>
    )
}

export default withStyles(styles)(UIHeader)