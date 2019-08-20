import { Box, List, ListItem, ListItemText } from "@material-ui/core";
import * as React from "react";
import { TrussBase } from "../trussList";

interface Props {
    trusses: TrussBase[],
    onSelect: (value: string) => void
}
export default function UISelectTruss(props: Props) {
    const { trusses, onSelect } = props
    return (
        <Box>
            <List>
                {trusses.map(t => (
                    <ListItem button onClick={() => onSelect(t.id)} key={t.id}>
                        <ListItemText primary={t.name} />
                    </ListItem>
                ))}

            </List>
        </Box>
    )
}