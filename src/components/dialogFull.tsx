
import { AppBar, Box, Dialog, IconButton, Slide, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        box: {
            backgroundColor: theme.palette.grey[300],
            width: "100%",
            height: '100%',
            padding: theme.spacing(4),
            overflowX: 'auto'
        },
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    }),
);

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface Props {
    title: string,
    open: boolean,
    handleClose: () => void,
    children?: React.ReactNode
}
export default function FullScreenDialog(props: Props) {
    const classes = useStyles(props);
    const { children, open, handleClose, title } = props
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box className={classes.box}>
                {children}
            </Box>
        </Dialog>
    )
}