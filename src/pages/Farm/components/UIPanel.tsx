import * as React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.primary.dark,
        padding: theme.spacing(2),
        display: "flex",
        flexDirection: "column",

    },
    ul: {
        padding: 0,
        '& li': {
            listStyle: 'none',
            '& label': {
                cursor: 'pointer',
                '& input':{
                    
            cursor:'pointer'
                }
            }
        }
    }
})

export enum UIModes {
    none,
    drag,
    addNode,
    dragNode,
    addBeam,
    addBeamStart,
    addBeamEnd,
    dragBeam,
    delete
}

const mods = [
    {
        name: "None",
        mod: UIModes.none
    },
    {
        name: "Drag",
        mod: UIModes.drag
    },
    {
        name: "Add Node",
        mod: UIModes.addNode
    },
    {
        name: "Add Beam",
        mod: UIModes.addBeam
    },
    {
        name: "Delete",
        mod: UIModes.delete
    }
]

export interface UIPanelProps extends WithStyles<typeof styles> {
    selected: UIModes
    onSelect(mod: UIModes): void
}

const UIPanel: React.FC<UIPanelProps> = ({ onSelect, selected, classes }) => {
    return (
        <div className={classes.root}>
            <ul className={classes.ul}>
                {mods.map((item, i) => (
                    <li key={i}>
                        <label>
                            <span>{item.name}</span>
                            <input
                                type="radio"
                                name="UiMode"
                                value={item.mod}
                                checked={selected === item.mod}
                                onChange={(e) => onSelect(item.mod)} />
                        </label>
                    </li>
                ))}
            </ul>
        </div>


    )
}

export default withStyles(styles)(UIPanel)