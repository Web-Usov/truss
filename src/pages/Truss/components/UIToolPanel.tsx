import { createStyles, Paper, Theme, withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { ToggleButtonGroup } from '@material-ui/lab';
import { WithStyles } from '@material-ui/styles';
import * as React from 'react';
import { ToggleBtn } from 'src/components/Btns';
import Btn from 'src/components/Btns/btn';
import { UIModes } from 'src/utils/UI';
import { modsButtons, toolsButtons } from '../actions/toolsPanel';


const styles = (theme: Theme) => createStyles({
    root: {
        position: 'absolute',
        padding: theme.spacing(1),
        bottom: theme.spacing(2),
        left: "50%",
        transform: 'translateX(-50%)',
        backgroundColor: fade(theme.palette.primary.light, 0.4),
        transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
        }
    },
    modsBtnGroup: {
        borderRadius: 0,
        backgroundColor: 'transparent',
        verticalAlign: "middle"
    },
    vHr: {
        display: "inline-block",
        width: 2,
        height: '100%',
        minHeight: 48,
        verticalAlign: "middle",
        backgroundColor: theme.palette.secondary.light,
        opacity: 0.5,
        marginRight: 10
    }
})


export interface IMode {
    title: string,
    mod: UIModes
    // icon: JSX.Element
    icon: React.ComponentType<SvgIconProps>
}



export interface UIToolPanelProps extends WithStyles<typeof styles> {
    selected: UIModes
    onSelect(mod: UIModes): void,
    onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>, a: string) => void
}

const UIToolPanel: React.FC<UIToolPanelProps> = ({ onSelect, selected, classes, onClick = () => { } }) => {

    return (
        <Paper className={classes.root}>
            <ToggleButtonGroup
                value={selected}
                exclusive
                onChange={(e, value) => onSelect(value)}
                size="medium"
                className={classes.modsBtnGroup}
            >
                {modsButtons.map(item => (
                    <ToggleBtn
                        key={item.mod}
                        value={item.mod}
                        selected={item.mod === selected}
                        icon={item.icon}
                        name={item.title}
                    />
                ))}
            </ToggleButtonGroup>
            <div className={classes.vHr} />
            {toolsButtons.map(b => (
                <Btn {...b}
                    onClickToAction={onClick}
                    fab={b.fab}
                    key={b.title}
                    size="medium" />
            ))}
        </Paper>
    )
}

export default withStyles(styles)(UIToolPanel)