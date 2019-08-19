import * as React from 'react'
import { Theme, createStyles, withStyles, Tooltip } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab'
import { WithStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { fade } from '@material-ui/core/styles';
import { ToggleButtonProps } from '@material-ui/lab/ToggleButton';


export interface ToggleBtnProps extends WithStyles<typeof styles> {
    selected: boolean,
    value?: any,
    name?: string,
    icon: JSX.Element
}
const styles = (theme: Theme) => createStyles({
    btn: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        borderRadius: '50% !important',
        border: `1px solid ${fade(theme.palette.action.active, 0.2)} !important`,
        transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
            duration: theme.transitions.duration.short,
        }),

        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.light,

        '&$selected': {
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
            }
        },
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
            '@media (hover: none)': {
                backgroundColor: theme.palette.secondary.main,
            },
            '&$disabled': {
                backgroundColor: theme.palette.secondary.main,
            },
        },
    },
    selected: {},
})





const MyToggleButton: React.FC<ToggleBtnProps & ToggleButtonProps> = ({ selected, classes, value, name, icon, ...other }) => {
    return (
        <ToggleButton
            key={name}
            value={value}
            className={clsx(
                classes.btn,
                {
                    [classes.selected]: selected,
                }
            )}
            {...other}

        >
            <Tooltip title={name}>
                {icon}
            </Tooltip>
        </ToggleButton>
    )
}
export const ToggleBtn = withStyles(styles)(MyToggleButton)
export default withStyles(styles)(MyToggleButton)