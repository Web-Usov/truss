import * as React from 'react'

export enum UIModes {
    none,
    drag,
    addNode,
    dragNode,
    addBeam,
    addBeamStart,
    addBeamEnd,
    dragBeam,
    delete
}

const mods = [
    {
        name: "None",
        mod: UIModes.none
    },
    {
        name: "Drag",
        mod: UIModes.drag
    },
    {
        name: "Add Node",
        mod: UIModes.addNode
    },
    {
        name: "Add Beam",
        mod: UIModes.addBeam
    },
    {
        name:"Delete",
        mod:UIModes.delete
    }
]

export interface UIPanelProps {
    selected: UIModes
    onSelect(mod: UIModes): void
}

const UIPanel: React.FC<UIPanelProps> = ({ onSelect, selected }) => {
    return (
            <ul style={{
                position:'absolute'
            }}>
                {mods.map((item, i) => (
                    <li key={i}>
                        <label>
                            <span>{item.name}</span>
                            <input
                                type="radio"
                                name="UiMode"
                                value={item.mod}
                                checked={selected === item.mod}
                                onChange={(e) => onSelect(item.mod)} />
                        </label>
                    </li>
                ))}
            </ul>

    )
}

export default UIPanel