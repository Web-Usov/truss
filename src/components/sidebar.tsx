import * as React from 'react'
import { Theme, createStyles, withStyles, Fab, Drawer, Tooltip, Typography, Divider } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import { UI } from 'src/static/const';


const styles = (theme: Theme) => createStyles({
    drawer: {
        position: 'relative'
    },
    drawerPaper: {
        width: UI.sidebarWidth,
    },
    toogleIcon: {
        position: 'absolute',
        top: theme.spacing(10),
        zIndex: theme.zIndex.drawer + 1
    },
    title:{
        padding:theme.spacing(1)
    },
    toolbar: theme.mixins.toolbar,
})




interface SidebarProps extends WithStyles<typeof styles> {
    anchor: 'left' | 'right',
    title? : string,
    btnIcon : JSX.Element
}

interface SidebarState {
    open: boolean,
    viewTooltip: boolean

}
const localStr = "Sidebar_state:"
class Sidebar extends React.PureComponent<SidebarProps, SidebarState>{
    constructor(props: SidebarProps) {
        super(props)
        this.state = {
            open: true,
            viewTooltip: false
        }
        this.switchDrawer = this.switchDrawer.bind(this)
    }
    componentWillMount(){
        if(this.props.title){
            const localState = localStorage.getItem(localStr+this.props.title)
            if(localState)
            this.setState({open: localState === "true"})
        }
    }
    switchDrawer() {
        localStorage.setItem(localStr+this.props.title,(!this.state.open ? "true" : "false"))
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
        const { classes,children, title, btnIcon, anchor } = this.props
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
                    
                    <Typography 
                        variant='body2'
                        align="center"
                        className={classes.title}>
                        {title}
                    </Typography>
                    <Divider/>
                    {children}
                </Drawer>
                <Tooltip
                    title={title}
                    open={title !== undefined && viewTooltip && !open}
                    onOpen={() => this.changeViewtooltip(true)}
                    onClose={() => this.changeViewtooltip(false)}>
                    <Fab
                        style={{
                            left: anchor === 'left' ? !open ? 15 : UI.sidebarWidth + 15 : "auto",
                            
                            right: anchor === 'right' ? !open ? 15 : UI.sidebarWidth + 15 : "auto"
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