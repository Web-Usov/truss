import { Button, ListItemIcon, MenuItem, MenuList, Paper, Popover } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import * as React from 'react';
import { BtnProps } from './btn';

export interface MenuBtnProps {
    title: string,
    icon?: JSX.Element,
    items: BtnProps[],
}

export function MenuBtn(props: MenuBtnProps & ButtonProps & {
    onClickToAction: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, todo: string) => void
}) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    function handleClick(event: React.MouseEvent<HTMLElement>) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }


    function handleItemClick(e: React.MouseEvent, a: string) {
        props.onClickToAction(e as React.MouseEvent<HTMLButtonElement>, a)
        setAnchorEl(null);
    }

    function handleClose(e: React.MouseEvent) {

        setAnchorEl(null);
    }

    const { items, title } = props
    const open = Boolean(anchorEl);
    const id = open ? title : undefined;
    return (
        <div>
            <Button
                aria-describedby={id}
                size={props.size}
                aria-haspopup="menu"
                onClick={handleClick}
                color="secondary"
                variant={props.variant || "contained"}
                style={{
                    marginLeft: 5,
                    marginRight: 5,
                }}
            >{props.icon}  {props.title}</Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                keepMounted

            >
                <Paper onMouseLeave={handleClose}>
                    <MenuList>
                        {items.map(i => (
                            <MenuItem onClick={(e) => handleItemClick(e, i.todo)} disabled={i.disabled}>
                                {i.icon !== undefined && (<ListItemIcon>
                                    {i.icon}
                                </ListItemIcon>)}
                                {i.title}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>


            </Popover>
        </div>
    );
}
export default MenuBtn