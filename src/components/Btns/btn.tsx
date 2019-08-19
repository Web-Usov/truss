import * as React from 'react'
import { Button, Fab, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';

export interface BtnProps {
    title?: string,
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    icon?: JSX.Element,
    disabled?: boolean,
    fab?: boolean,
    onlyIcon?: boolean
}
export const Btn: React.FC<BtnProps & ButtonProps> = ({
    title = "",
    icon = (<React.Fragment />),
    disabled = false,
    onClick,
    className,
    fab = false,
    size,
    onlyIcon = false
}) => {
    if (fab) return (
        <Tooltip title={title} >
            <Fab
                size={size}
                color="secondary"
                onClick={onClick}
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
                onClick={onClick}
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