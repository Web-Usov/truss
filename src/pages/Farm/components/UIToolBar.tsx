import * as React from 'react'
import { Theme, createStyles, withStyles, Tooltip, Paper, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { WithStyles } from '@material-ui/styles';
import { ZoomOutMap as MoveIcon, MyLocation as AddNodeIcon, Delete as DeleteIcon, Power as ConnectIcon } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    modsBtnGroup:{
        marginLeft:theme.spacing(2),
        marginRight:theme.spacing(2),
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
        <AppBar 
            position="fixed" 
            className={classes.appBar}
            color="primary">
            <Toolbar >
                <ToggleButtonGroup 
                    color="primary"
                    value={selected}
                    exclusive
                    onChange={(e, value) => onSelect(value)}
                    size="small"
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
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(styles)(UIToolBar)