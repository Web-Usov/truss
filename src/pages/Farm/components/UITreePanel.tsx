import * as React from 'react'
import { Theme, createStyles, withStyles, List, ListItem, ListItemText, Collapse, ListItemIcon, Divider, Badge } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import { GpsNotFixed as NodeIcon, Timeline as BeamIcon, List as TreePanelIcon, ExpandLess, ExpandMore } from '@material-ui/icons';
import { Sidebar } from 'src/components';
import { Entity } from 'src/models/Farm/ModelEntity';
import { Beam } from 'src/models/Farm/ModelBeam';
import { FarmNode } from 'src/models/Farm/ModelNode';

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
        tabs.set('Узлы', false)
        tabs.set('Стержни', false)
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
            <React.Fragment>
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
                                <ListItemText primary={item.id} />
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
                <Divider />
            </React.Fragment>
        )
    }
    render() {
        const { nodes, beams } = this.props
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