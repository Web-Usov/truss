import * as React from 'react'
import { Theme, createStyles, withStyles, List, ListItem, ListItemText, Collapse, Fab, Drawer, ListItemIcon, Divider, IconButton, Tooltip } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { Node, Beam, Entity } from 'src/models/Farm';
import { Close as CloseIcon, List as TreePanelIcon, ExpandLess, ExpandMore } from '@material-ui/icons';
import { UIDrawer } from '.';

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
    nested: {
    },
})




interface TreePanelProps extends WithStyles<typeof styles> {
    nodes: Node[],
    beams: Beam[]
    selectedEntity: Entity | undefined
    onSelect(entity: Entity): void
}

interface TreeState {
    openedNodes: boolean,
    openedBeams: boolean,
    open: boolean,

}

class UITreePanel extends React.PureComponent<TreePanelProps, TreeState>{
    constructor(props: TreePanelProps) {
        super(props)
        this.state = {
            open: false,
            openedNodes: true,
            openedBeams: true,
        }
        this.switchTab = this.switchTab.bind(this)
    }
    switchTab(tab: string): void {
        switch (tab) {
            case 'nodes':
                return this.setState((state) => ({
                    openedNodes: !state.openedNodes
                }))
            case 'beams':
                return this.setState((state) => ({
                    openedBeams: !state.openedBeams
                }))
            default:
                return;
        }
    }
    render() {
        const { classes, nodes, beams, selectedEntity, onSelect } = this.props
        const { openedBeams, openedNodes, } = this.state
        const { switchTab: openTab } = this
        return (
            <UIDrawer
                anchor="left"
                btnTitle="Структура проекат"
                btnIcon={(<TreePanelIcon/>)}
            >
                <List>
                    <ListItem button onClick={() => openTab('nodes')}>
                        <ListItemText primary="Узлы" />
                        {openedNodes ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openedNodes} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {nodes.map(item => (
                                <ListItem
                                    button
                                    className={classes.nested}
                                    key={item.id}
                                    selected={selectedEntity === item}
                                    onClick={(e) => onSelect(item)}
                                >
                                    <ListItemText primary={item.id} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                    <Divider />

                    <ListItem button onClick={() => openTab('beams')}>
                        <ListItemText primary="Лучи" />
                        {openedBeams ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openedBeams} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {beams.map(item => (
                                <ListItem
                                    button
                                    className={classes.nested}
                                    key={item.id}
                                    selected={selectedEntity === item}
                                    onClick={(e) => onSelect(item)}
                                >
                                    <ListItemText primary={item.id} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </List>

            </UIDrawer>
        )
    }

}

export default withStyles(styles)(UITreePanel)