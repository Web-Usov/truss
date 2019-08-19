import * as React from 'react'
import { Theme, createStyles, withStyles, Paper } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab'
import { WithStyles } from '@material-ui/styles';
import { ZoomOutMap as MoveIcon, MyLocation as AddNodeIcon, Delete as DeleteIcon, Power as ConnectIcon } from '@material-ui/icons';
import { Build as CalcIcon, SaveAlt as SaveIcon, DeleteForever as ClearIcon } from '@material-ui/icons';

import { fade } from '@material-ui/core/styles';
import { ToggleBtn } from 'src/components/Btns';
import { UIModes } from 'src/utils/UI';
import Btn, { BtnProps } from 'src/components/Btns/btn';

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
        backgroundColor: 'transparent'
    },
})


export interface IMode {
    name: string,
    mod: UIModes
    icon: JSX.Element
}



export interface UIToolPanelProps extends WithStyles<typeof styles> {
    selected: UIModes
    onSelect(mod: UIModes): void,
    onClickCalc?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const UIToolPanel: React.FC<UIToolPanelProps> = ({ onSelect, selected, classes, onClickCalc = () => { } }) => {
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
    const btns: BtnProps[] = [
        {
            title: "Расчет фермы",
            onClick: onClickCalc,
            icon: (<CalcIcon />),
            fab: true
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
                    <ToggleBtn
                        key={item.mod}
                        value={item.mod}
                        selected={item.mod === selected}
                        icon={item.icon}
                        name={item.name}

                    />
                ))}
                {btns.map(b => (
                    <Btn title={b.title} icon={b.icon} onClick={b.onClick} fab={b.fab} key={b.title} />
                ))}
            </ToggleButtonGroup>
        </Paper>
    )
}

export default withStyles(styles)(UIToolPanel)