import * as React from 'react'
import { Theme, createStyles, withStyles, Tooltip, Paper } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { WithStyles } from '@material-ui/styles';
import { ZoomOutMap as MoveIcon, MyLocation as AddNodeIcon, Delete as DeleteIcon, Power as ConnectIcon } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    root: {
        position: 'absolute',
        padding: theme.spacing(1),
        bottom:theme.spacing(4),
        left: "50%",
        transform: 'translateX(-50%)',
        backgroundColor: theme.palette.primary.main,
    },
    modsBtnGroup: {

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
                color="primary"
                value={selected}
                exclusive
                onChange={(e, value) => onSelect(value)}
                size="medium"
                className={classes.modsBtnGroup}
            >
                {mods.map(item => (
                    <ToggleButton
                        value={item.mod}
                        key={item.name}
                        color="secondory"

                    >
                        <Tooltip title={item.name}>
                            {item.icon}
                        </Tooltip>
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Paper>
    )
}

export default withStyles(styles)(UIToolPanel)