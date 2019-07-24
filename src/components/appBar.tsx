import * as React from 'react'
import clsx from 'clsx'
import { Theme, createStyles, withStyles, AppBar, Toolbar } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { consts } from 'src/static';
import { Link } from 'react-router-dom';
import { AppBarProps } from '@material-ui/core/AppBar';

const styles = (theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
        marginRight: theme.spacing(4),
        marginLeft: theme.spacing(2),
        '& img': {
            width: 50,
            height: 'auto'
        }
    }
})

export interface UIToolBarProps extends WithStyles<typeof styles>, React.HTMLAttributes<HTMLDivElement> {
    color?: AppBarProps['color'],
    position?: AppBarProps['position'],
    withLogo?: boolean
}

const UIAppBar: React.FC<UIToolBarProps> = ({ classes, children, className, color, position, withLogo = true }) => {
    const viewLogo = () => {
        if (withLogo) return ((
            <Link
                to={'/'}
                className={classes.logo}
            >
                <img
                    alt="Logo Icon"
                    src={consts.bridgeIcon_2}
                />
            </Link>
        ))
    }
    return (
        <AppBar
            position={position || 'fixed'}
            className={clsx(classes.appBar, className)}
            color={color || 'primary'}>
            <Toolbar >
                {viewLogo()}
                {children}
            </Toolbar>
        </AppBar>
    )
}

export default withStyles(styles)(UIAppBar)