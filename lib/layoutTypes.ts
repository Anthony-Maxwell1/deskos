export type Anchor = "left" | "right" | "top" | "bottom";

export type TileInstance = {
    id: string;
    registryId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    props: Record<string, any>;
    specialEffects?: string[]; // e.g. ["shake", "glow"]
};

export type PanelInstance = {
    id: string;
    registryId: string;
    anchor: Anchor;
    size: number;
    props: Record<string, any>;
};

export type Page = {
    id: string;
    tiles: TileInstance[];
    panels: PanelInstance[];
};

export type GridSize = {
    cols: number;
    rows: number;
};
