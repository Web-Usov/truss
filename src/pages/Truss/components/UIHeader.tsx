import { createStyles, Theme, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import * as React from 'react';
import { AppBar } from 'src/components';
import { DisabledBtn, MenuBtn } from 'src/components/Btns';
import { headerMenu } from '../actions/header';
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
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, a: string) => void,
    disabled?: DisabledBtn
}

const UIHeader: React.FC<UIHeaderProps> = (
    {
        classes,
        onClick = () => { },
        disabled = {} as DisabledBtn
    }) => {

    return (
        <AppBar className={classes.root} >
            {headerMenu.map(m => {
                m.items.forEach(b => {
                    b.disabled = disabled[b.todo] === true
                })
                return (
                    <MenuBtn {...m} key={m.title} onClickToAction={onClick} size={"medium"} />
                )
            })}
            <div className={classes.grow} />
        </AppBar>
    )
}

export default withStyles(styles)(UIHeader)