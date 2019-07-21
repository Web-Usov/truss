import * as React from 'react'
import { Theme, createStyles, withStyles, Fab, Drawer, Tooltip } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Close as CloseIcon, List as TreePanelIcon, ExpandLess, ExpandMore, SvgIconComponent } from '@material-ui/icons';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

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
        top: theme.spacing(9),
        zIndex: theme.zIndex.drawer + 1
    },
    toolbar: theme.mixins.toolbar,
})




interface TreePanelProps extends WithStyles<typeof styles> {
    anchor: 'left' | 'right',
    btnTitle? : string,
    btnIcon : JSX.Element
}

interface TreeState {
    open: boolean,
    viewTooltip: boolean

}

class UIDrawer extends React.PureComponent<TreePanelProps, TreeState>{
    constructor(props: TreePanelProps) {
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
                            left: anchor === 'left' ? !open ? 10 : drawerWidth + 10 : "auto",
                            
                            right: anchor === 'right' ? !open ? 10 : drawerWidth + 10 : "auto"
                        }}
                        color="secondary"
                        size="small"
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

export default withStyles(styles)(UIDrawer)