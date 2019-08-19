import * as React from 'react'
import { Theme, createStyles, withStyles, Button, ButtonGroup, Fab, Icon, Tooltip } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { AppBar } from 'src/components';
import { Build as CalcIcon, SaveAlt as SaveIcon, DeleteForever as ClearIcon } from '@material-ui/icons';
import { Btn } from 'src/components/Btns';
import { BtnProps } from 'src/components/Btns/btn';

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
    hundleSave?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    hundleClear?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    hundleCalculate?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
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
    const btns: BtnProps[] = [
        {
            title: "Сохранить ферму в кэш",
            onClick: hundleSave,
            icon: (<SaveIcon />)
        },
        {
            title: "Очистить холст",
            onClick: hundleClear,
            icon: (<ClearIcon />)
        }
    ]

    return (
        <AppBar
            className={classes.root}
        >
            {btns.map(b => (
                <Btn
                    title={b.title}

                    onClick={b.onClick}
                    icon={b.icon}
                    key={b.title}
                    onlyIcon={true}
                />)
            )}
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