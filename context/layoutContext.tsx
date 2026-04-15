"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GridSize, Page, TileInstance, PanelInstance } from "@/lib/layoutTypes";
import type { ConfigValue } from "@/lib/configTypes";
import {
    fetchConfig,
    getSelectedConfigId,
    isEmptyConfig
} from "@/lib/configClient";

type LayoutContextType = {
    pages: Page[];
    currentPageId: string | null;
    currentPage: Page | null;

    addPage(): void;
    removePage(id: string): void;
    setCurrentPage(id: string): void;

    addTile(tile: TileInstance): void;
    updateTile(tile: TileInstance): void;
    removeTile(id: string): void;

    addPanel(panel: PanelInstance): void;
    removePanel(id: string): void;

    saveState(): void;

    gridSize: GridSize;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

const getGridSize = (config?: ConfigValue | null): GridSize => {
    const gridSize = config?.gridSize;

    if (Array.isArray(gridSize)) {
        return {
            cols: Number(gridSize[0]) || 4,
            rows: Number(gridSize[1]) || 3
        };
    }

    return {
        cols: 4,
        rows: 3
    };
};

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();

    // Load initial pages from localStorage
    const [pages, setPages] = useState<Page[]>(() => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem("dashboard_pages");
        return stored ? JSON.parse(stored) : [];
    });

    const [currentPageId, setCurrentPageId] = useState<string | null>(null);
    const [config, setConfig] = useState<ConfigValue | null>(null);
    const [isConfigReady, setIsConfigReady] = useState(false);

    useEffect(() => {
        if (pathname?.startsWith("/config")) {
            setIsConfigReady(true);
            return;
        }

        setIsConfigReady(false);

        const selectedConfigId = getSelectedConfigId();

        if (!selectedConfigId) {
            router.replace("/config/select");
            return;
        }

        let cancelled = false;

        const loadConfig = async () => {
            try {
                const selectedConfig = await fetchConfig(selectedConfigId);

                if (cancelled) return;

                if (isEmptyConfig(selectedConfig)) {
                    router.replace("/config/select");
                    return;
                }

                setConfig(selectedConfig);
                setIsConfigReady(true);
            } catch {
                if (!cancelled) {
                    router.replace("/config/select");
                }
            }
        };

        void loadConfig();

        return () => {
            cancelled = true;
        };
    }, [pathname, router]);

    const currentPage = useMemo(
        () => pages.find(p => p.id === currentPageId) ?? null,
        [pages, currentPageId]
    );

    const gridSize = useMemo(() => getGridSize(config), [config]);

    if (!isConfigReady && pathname !== "/config/select") {
        return null;
    }

    const saveState = () => {
        // Update localStorage whenever pages change
        localStorage.setItem("dashboard_pages", JSON.stringify(pages));
    };

    /* Pages */
    const addPage = () => {
        const id = crypto.randomUUID();
        setPages(p => [...p, { id, tiles: [], panels: [] }]);
        setCurrentPageId(id);
        saveState();
    };

    const removePage = (id: string) => {
        setPages(p => p.filter(pg => pg.id !== id));
        if (currentPageId === id) setCurrentPageId(null);
        saveState();
    };

    /* Tiles */

    const addTile = (tile: TileInstance) => {
        if (!currentPage) return;
        setPages(p =>
            p.map(pg =>
                pg.id === currentPage.id
                    ? { ...pg, tiles: [...pg.tiles, tile] }
                    : pg
            )
        );
        saveState();
    };

    const updateTile = (tile: TileInstance) => {
        if (!currentPage) return;
        setPages(p =>
            p.map(pg =>
                pg.id === currentPage.id
                    ? {
                          ...pg,
                          tiles: pg.tiles.map(t =>
                              t.id === tile.id ? tile : t
                          )
                      }
                    : pg
            )
        );
        saveState();
    };

    const removeTile = (id: string) => {
        if (!currentPage) return;
        setPages(p => {
            const newPages = p.map(pg =>
                pg.id === currentPage.id
                    ? { ...pg, tiles: pg.tiles.filter(t => t.id !== id) }
                    : pg
            );
            localStorage.setItem("dashboard_pages", JSON.stringify(newPages));
            return newPages;
        });
    };

    /* Panels */

    const addPanel = (panel: PanelInstance) => {
        if (!currentPage) return;
        setPages(p =>
            p.map(pg => {
                if (pg.id !== currentPage.id) return pg;
                if (pg.panels.some(pn => pn.id === panel.id)) return pg;
                return { ...pg, panels: [...pg.panels, panel] };
            })
        );
        saveState();
    };

    const removePanel = (id: string) => {
        if (!currentPage) return;
        setPages(p =>
            p.map(pg =>
                pg.id === currentPage.id
                    ? {
                          ...pg,
                          panels: pg.panels.filter(pn => pn.id !== id)
                      }
                    : pg
            )
        );
        saveState();
    };

    return (
        <LayoutContext.Provider
            value={{
                pages,
                currentPageId,
                currentPage,
                addPage,
                removePage,
                setCurrentPage: setCurrentPageId,
                addTile,
                updateTile,
                removeTile,
                addPanel,
                removePanel,
                gridSize,
                saveState
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const ctx = useContext(LayoutContext);
    if (!ctx) throw new Error("useLayout must be used inside LayoutProvider");
    return ctx;
};
