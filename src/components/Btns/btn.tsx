import { Button, Fab, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';

export interface BtnProps {
    title?: string,
    todo: string,
    icon?: JSX.Element,
    disabled?: boolean,
    fab?: boolean,
    onlyIcon?: boolean
}
export const Btn: React.FC<BtnProps & ButtonProps & {
    onClickToAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, todo: string) => void
}> = (props) => {
    const {
        title = "",
        icon = (<React.Fragment />),
        disabled = false,
        onClickToAction,
        todo,
        className,
        fab = false,
        size,
        onlyIcon = false
    } = props
    if (fab) return (
        <Tooltip title={title} >
            <Fab


                size={size}
                color="secondary"
                onClick={(e) => onClickToAction(e, todo)}
                disabled={disabled}
                className={className}
                style={{
                    marginLeft: 5,
                    marginRight: 5
                }}>

                {icon}
            </Fab>

        </Tooltip>
    )
    return (
        <Tooltip title={title}>
            <Button
                size={size}
                color="secondary"
                variant="contained"
                onClick={(e) => onClickToAction(e, todo)}
                disabled={disabled}
                className={className}
                style={{
                    marginLeft: 5,
                    marginRight: 5
                }}>
                {icon}
                {!onlyIcon && title}
            </Button>

        </Tooltip>
    )
}

export default Btn