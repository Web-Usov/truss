import * as React from 'react'
import { Theme, createStyles, withStyles,  Paper } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab'
import { WithStyles } from '@material-ui/styles';
import { ZoomOutMap as MoveIcon, MyLocation as AddNodeIcon, Delete as DeleteIcon, Power as ConnectIcon } from '@material-ui/icons';

import { fade } from '@material-ui/core/styles';
import { MyToggleButton } from 'src/components';

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
        '&:hover':{
            backgroundColor: theme.palette.primary.light,
        }
    },
    modsBtnGroup: {
        borderRadius: 0,
        backgroundColor: 'transparent'
    }
})

export enum UIModes {
    none,
    move,
    addNode,
    addBeam,
    addBeamStart,
    delete
}
export interface IMode {
    name: string,
    mod: UIModes
    icon: JSX.Element
}



export interface UIToolPanelProps extends WithStyles<typeof styles> {
    selected: UIModes
    onSelect(mod: UIModes): void
}

const UIToolPanel: React.FC<UIToolPanelProps> = ({ onSelect, selected, classes }) => {
    const mods: IMode[] = [
        {
            name: "Перемещение",
            mod: UIModes.move,
            icon: (<MoveIcon />)
        },
        {
            name: "Добавить узел",
            mod: UIModes.addNode,
            icon: (<AddNodeIcon />)
        },
        {
            name: "Соединить узлы",
            mod: UIModes.addBeam,
            icon: (<ConnectIcon />)
        },
        {
            name: "Удалить",
            mod: UIModes.delete,
            icon: (<DeleteIcon />)
        }
    ]
    return (
        <Paper className={classes.root}>
            <ToggleButtonGroup
                value={selected}
                exclusive
                onChange={(e, value) => onSelect(value)}
                size="medium"
                className={classes.modsBtnGroup}
            >
                {mods.map(item => (
                    <MyToggleButton
                        key={item.mod}
                        value={item.mod}
                        selected={item.mod === selected}
                        icon={item.icon}
                        name={item.name}
                        
                    />
                ))}
            </ToggleButtonGroup>
        </Paper>
    )
}

export default withStyles(styles)(UIToolPanel)