import * as React from 'react'
import { Theme, createStyles, withStyles, Fab, Drawer, Tooltip } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Close as CloseIcon } from '@material-ui/icons';

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
    drawer: {
        position: 'relative'
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toogleIcon: {
        position: 'absolute',
        top: theme.spacing(10),
        zIndex: theme.zIndex.drawer + 1
    },
    toolbar: theme.mixins.toolbar,
})




interface SidebarProps extends WithStyles<typeof styles> {
    anchor: 'left' | 'right',
    btnTitle? : string,
    btnIcon : JSX.Element
}

interface SidebarState {
    open: boolean,
    viewTooltip: boolean

}

class Sidebar extends React.PureComponent<SidebarProps, SidebarState>{
    constructor(props: SidebarProps) {
        super(props)
        this.state = {
            open: false,
            viewTooltip: false
        }
        this.switchDrawer = this.switchDrawer.bind(this)
    }
    switchDrawer() {
        this.setState(
            {
                open: !this.state.open,
                viewTooltip: false
            }
        )
    }
    
    changeViewtooltip(flag: boolean) {
        this.setState({ viewTooltip: flag })
    }
    render() {
        const { classes,children, btnTitle: btnTitile, btnIcon, anchor } = this.props
        const { open, viewTooltip } = this.state
        return (
            <React.Fragment>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    open={open}
                    anchor={anchor}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
                    {children}
                </Drawer>
                <Tooltip
                    title={btnTitile}
                    open={btnTitile !== undefined && viewTooltip && !open}
                    onOpen={() => this.changeViewtooltip(true)}
                    onClose={() => this.changeViewtooltip(false)}>
                    <Fab
                        style={{
                            left: anchor === 'left' ? !open ? 15 : drawerWidth + 15 : "auto",
                            
                            right: anchor === 'right' ? !open ? 15 : drawerWidth + 15 : "auto"
                        }}
                        color="secondary"
                        size="medium"
                        className={classes.toogleIcon}
                        onClick={this.switchDrawer}
                    >
                        {open ? <CloseIcon /> : btnIcon}
                    </Fab>
                </Tooltip>
            </React.Fragment>
        )
    }

}

export default withStyles(styles)(Sidebar)