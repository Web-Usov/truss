import { IFixedNodeCreate, ISimpleNodeCreate, IStaticNodeCreate } from "src/models/Truss/TTypes";

export interface TrussBase {
    name: string,
    id: string,
    fixedNodes: IFixedNodeCreate[],
    staticNodes: IStaticNodeCreate[],
    simpleNodes: ISimpleNodeCreate[]
}

export const t1: TrussBase = {
    name: "Base farm",
    id: "1",
    fixedNodes: [
        {
            x: 0,
            y: 0,
            fixation: 'xy',
        },
        {
            x: 3000,
            y: 0,
            fixation: 'y',
        }

    ],
    staticNodes: [
        {
            x: 1000,
            y: 0,
            forceY: 9000
        }
    ],
    simpleNodes: [

    ]
}

export const t2: TrussBase = {
    name: "Base farm #2",
    id: "2",
    fixedNodes: [
        {
            x: 2000,
            y: 0,
            fixation: 'xy',
        },
        {
            x: 3000,
            y: 0,
            fixation: 'xy',
        }

    ],
    staticNodes: [
        {
            x: 0,
            y: 0,
            forceY: 2000
        },
        {
            x: 1000,
            y: 0,
            forceY: 1000
        }
    ],
    simpleNodes: [

    ]
}
export const t3: TrussBase = {
    name: "Base farm #3",
    id: "3",
    fixedNodes: [
        {
            x: 0,
            y: 1000,
            fixation: 'xy',
        },
        {
            x: 1500,
            y: 1000,
            fixation: 'xy',
        }

    ],
    staticNodes: [
        {
            x: 0,
            y: 0,
            forceX: 1000
        },
        {
            x: 0,
            y: 2000,
            forceX: -1000
        }
    ],
    simpleNodes: [

    ]
}

export const t4: TrussBase = {
    name: "Base farm #4",
    id: "4",
    fixedNodes: [
        {
            x: 500,
            y: 1000,
            fixation: 'xy',
        },
        {
            x: 1500,
            y: 1000,
            fixation: 'xy',
        }

    ],
    staticNodes: [
        {
            x: 0,
            y: 0,
            forceX: 1000
        },
        {
            x: 0,
            y: 2000,
            forceX: -1500
        }
    ],
    simpleNodes: [

    ]
}

export const t5: TrussBase = {
    name: "Base farm #5",
    id: "5",
    fixedNodes: [
        {
            x: 0,
            y: 0,
            fixation: 'xy',
        },
        {
            x: 3000,
            y: 0,
            fixation: 'xy',
        }

    ],
    staticNodes: [
        {
            x: 1000,
            y: 0,
            forceY: -1000
        },
        {
            x: 2000,
            y: 0,
            forceY: 1000
        }
    ],
    simpleNodes: [

    ]
}
export const t6: TrussBase = {
    name: "Base farm #6",
    id: "6",
    fixedNodes: [
        {
            x: 0,
            y: 0,
            fixation: 'xy',
        },
        {
            x: 0,
            y: 1000,
            fixation: 'xy',
        }

    ],
    staticNodes: [
        {
            x: 2000,
            y: 500,
            forceY: 1000
        },
    ],
    simpleNodes: [

    ]
}
export const trusses: TrussBase[] = [t1, t2, t3, t4, t5, t6]
