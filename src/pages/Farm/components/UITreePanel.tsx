import * as React from 'react'
import { Theme, createStyles, withStyles, Tooltip, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Collapse, Paper } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Node, Beam, Entity } from 'src/models/Farm';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width:250,
        borderRightColor:theme.palette.grey[600],
        borderRight:"solid 2px",
        overflowY: 'auto',
    },
    list: {

    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
})




interface TreePanelProps extends WithStyles<typeof styles> {
    nodes: Node[],
    beams: Beam[]
    // onSelect(entity: Entity | number): void
}

interface TreeState {
    openedNodes:boolean,
    openedBeams:boolean,

}

class UITreePanel extends React.PureComponent<TreePanelProps, TreeState>{
    constructor(props: TreePanelProps) {
        super(props)
        this.state = {
            openedNodes:true,
            openedBeams:true
        }
        this.clickTab = this.clickTab.bind(this)
    }

    clickTab(tab: string): void {
        switch (tab) {
            case 'nodes':
                return this.setState((state) => ({
                    openedNodes:!state.openedNodes
                }))
            case 'beams':
                return this.setState((state) => ({
                    openedBeams:!state.openedBeams
                }))      
            default:
                return;
        }
    }
    render() {
        const { classes, nodes, beams } = this.props
        const { openedBeams, openedNodes } = this.state
        const { clickTab: openTab } = this
        return (
            <div className={classes.root}> 
                <Paper>
                    <List
                        // subheader={<ListSubheader component="div" id="nested-list-subheader">
                        //     Структура проекта
                        // </ListSubheader>}
                        className={classes.list}
                    >
                        <ListItem button onClick={() => openTab('nodes')}>
                            <ListItemText primary="Узлы" />
                            {openedNodes? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openedNodes} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {nodes.map(item => (
                                    <ListItem button className={classes.nested} key={item.id}>
                                        <ListItemText primary={item.id} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>

                        <ListItem button onClick={() => openTab('beams')}>
                            <ListItemText primary="Лучи" />
                            {openedBeams? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openedBeams} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {beams.map(item => (
                                    <ListItem button className={classes.nested} key={item.id}>
                                        <ListItemText primary={item.id} />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                    </List>

                </Paper>
            </div>


        )
    }

}

export default withStyles(styles)(UITreePanel)