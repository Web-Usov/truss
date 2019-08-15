import { Badge, Box, Collapse, createStyles, Divider, List, ListItem, ListItemIcon, ListItemText, Theme, withStyles } from '@material-ui/core';
import { Brightness1 as CircleIcon, ExpandLess, ExpandMore, GpsNotFixed as NodeIcon, List as TreePanelIcon, Timeline as BeamIcon } from '@material-ui/icons';
import { WithStyles } from '@material-ui/styles';
import * as React from 'react';
import { Sidebar } from 'src/components';
import { Beam } from 'src/models/Farm/ModelBeam';
import { Entity } from 'src/models/Farm/ModelEntity';
import { FarmNode, instanceOfNode } from 'src/models/Farm/ModelNode';
import { UI } from 'src/utils';

const styles = (theme: Theme) => createStyles({
    nested: {
        paddingLeft: theme.spacing(6)
    },
})

interface TreePanelProps extends WithStyles<typeof styles> {
    nodes: FarmNode[],
    beams: Beam[]
    selectedEntity: Entity | undefined
    onSelect(entity: Entity): void
}

interface TreeState {
    tabs: Map<string, boolean>,
    open: boolean,

}

class UITreePanel extends React.PureComponent<TreePanelProps, TreeState>{
    constructor(props: TreePanelProps) {
        super(props)
        this.state = {
            open: false,
            tabs: new Map()
        }
        this.openTab = this.openTab.bind(this)
        this.viewListItem = this.viewListItem.bind(this)
    }
    componentWillMount() {
        const { tabs } = this.state
        tabs.set('Узлы', true)
        tabs.set('Стержни', true)
        this.setState({ tabs: new Map(tabs) })
    }
    openTab(tab: string): void {
        const { tabs } = this.state
        tabs.set(tab, !tabs.get(tab))
        this.setState({ tabs: new Map(tabs) })
    }
    viewListItem(entityArray: Entity[], title: string, icon?: JSX.Element) {
        const { selectedEntity, classes, onSelect } = this.props
        const { tabs } = this.state
        return (
            <Box>
                <ListItem button onClick={() => this.openTab(title)}>
                    {icon && (
                        <ListItemIcon>
                            <Badge badgeContent={entityArray.length} color="secondary">
                                {icon}
                            </Badge>
                        </ListItemIcon>
                    )}
                    <ListItemText primary={title} />
                    {tabs.get(title) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={tabs.get(title)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {entityArray.map(item => (
                            <ListItem
                                button
                                className={classes.nested}
                                key={item.id}
                                selected={selectedEntity === item}
                                onClick={(e) => onSelect(item)}
                            >
                                {instanceOfNode(item) && (
                                    <ListItemIcon>
                                        <CircleIcon style={{ color: UI.getNodeColor(item) }} />
                                    </ListItemIcon>
                                )}
                                <ListItemText primary={item.name} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
                <Divider />
            </Box>
        )
    }
    render() {
        const { nodes, beams } = this.props
        beams.sort((a: Beam, b: Beam) => {
            return a.name > b.name ? 1 : -1
        })
        return (
            <Sidebar
                anchor="left"
                title="Структура проекта"
                btnIcon={(<TreePanelIcon />)}
            >

                {this.viewListItem(nodes, 'Узлы', (<NodeIcon />))}
                {this.viewListItem(beams, 'Стержни', (<BeamIcon />))}

            </Sidebar>
        )
    }

}

export default withStyles(styles)(UITreePanel)