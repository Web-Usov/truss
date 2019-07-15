import * as React from 'react'
import { Theme, createStyles, withStyles, Tooltip, Paper } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { WithStyles } from '@material-ui/styles';
import { ZoomOutMap as MoveIcon, MyLocation as AddNodeIcon, Delete as DeleteIcon, Power as ConnectIcon } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(1),
        display: "flex",
        borderBottomColor: theme.palette.grey[800],
        borderBottom: 'solid 2px'
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



export interface UIToolBarProps extends WithStyles<typeof styles> {
    selected: UIModes
    onSelect(mod: UIModes): void
}

const UIToolBar: React.FC<UIToolBarProps> = ({ onSelect, selected, classes }) => {
    const mods: IMode[] = [
        {
            name: "Move",
            mod: UIModes.move,
            icon: (<MoveIcon />)
        },
        {
            name: "Add Node",
            mod: UIModes.addNode,
            icon: (<AddNodeIcon />)
        },
        {
            name: "Add Beam",
            mod: UIModes.addBeam,
            icon: (<ConnectIcon />)
        },
        {
            name: "Delete",
            mod: UIModes.delete,
            icon: (<DeleteIcon />)
        }
    ]
    return (
        <div className={classes.root}>
            <Paper>
                <ToggleButtonGroup
                    value={selected}
                    exclusive
                    onChange={(e, value) => onSelect(value)}
                    size="small"
                >
                    {mods.map(item => (
                        <ToggleButton value={item.mod} key={item.name}>
                            <Tooltip title={item.name}>
                                {item.icon}
                            </Tooltip>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Paper>
        </div>
    )
}

export default withStyles(styles)(UIToolBar)