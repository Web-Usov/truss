import { Box, Dialog, DialogTitle } from '@material-ui/core';
import * as React from 'react';

export interface SimpleDialogProps {
    open: boolean;
    title: string,
    handleClose: (value: string) => void;
    children: React.ReactNode
}

export default function SimpleDialog(props: SimpleDialogProps) {
    const { handleClose, open, title, children } = props;
    return (
        <Dialog onClose={handleClose} aria-labelledby={title} open={open}>
            <DialogTitle id={title}>{title}</DialogTitle>
            <Box>
                {children}
            </Box>
        </Dialog>
    );
}
