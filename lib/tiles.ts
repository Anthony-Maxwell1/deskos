import { ComponentType } from "react";

/* =======================
   Registry Types
======================= */

export type RegistryNode = {
    id: string;
    label: string;
    children?: RegistryNode[];
    component?: ComponentType<any>;
    defaultProps?: Record<string, any>;
};

export type RegistryRoot = RegistryNode[];

/* =======================
   Example Components
======================= */

/* =======================
   Tile Registry
======================= */

import { apps } from "@/lib/apps";

export let TileRegistry: Array<RegistryNode> = []

for (const appKey in apps) {
    const app = apps[appKey as keyof typeof apps];
    if (app.widgets.length > 0) {
        TileRegistry.push({
            id: appKey,
            label: app.name,
            children: app.widgets.map(widget => ({
                id: widget.id,
                label: widget.name,
                component: widget.component,
                defaultProps: widget.defaultProps,
            })),
        });
    }
}

export const PanelRegistry: RegistryRoot = []; // eh not implemented for now