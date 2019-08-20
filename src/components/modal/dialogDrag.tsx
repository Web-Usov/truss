
import { Card, CardContent, CardHeader, IconButton, Theme } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { createStyles, makeStyles } from '@material-ui/styles';
import * as React from 'react';
import Draggable from 'react-draggable';
import { consts } from 'src/static';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // position: "absolute"
        },
        box: {
            overflowX: 'hidden',
            width: 500,
            position: "absolute",
            zIndex: theme.zIndex.modal,
            boxShadow: theme.shadows[10],
            left: consts.UI.sidebarWidth + 10,
            top: theme.spacing(9),
        },
        content: {
            backgroundColor: theme.palette.grey[300],
            overflowY: 'auto',
            maxHeight: window.innerHeight - 200
        }
    }),
);

interface Props {
    title: string,
    handleClose: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | {}, reason?: "backdropClick" | "escapeKeyDown") => void,
    open: boolean,
    children: React.ReactNode
}

export default function DraggableDialog(props: Props) {
    const { open, children, handleClose, title } = props
    const classes = useStyles(props);

    return (
        <Draggable bounds="parent" handle="#strong" >
            <Card className={classes.box} hidden={!open}>
                <CardHeader
                    id="strong"
                    action={
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    }
                    title={title}
                    style={{ cursor: "move" }}
                />
                <CardContent className={classes.content}>
                    {children}
                </CardContent>
            </Card>
        </Draggable>

    );
}