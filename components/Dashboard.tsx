"use client";

import { useLayout } from "@/context/layoutContext";
import { TileRegistry, PanelRegistry, RegistryNode } from "@/lib/tiles";
import { useState, useRef, useEffect } from "react";
import { CircleX, Ellipsis } from "lucide-react";
import { useTheme } from "@/context/themeContext";

const findRegistry = (id: string, nodes: RegistryNode[]): RegistryNode | null => {
    for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) {
            const found = findRegistry(id, n.children);
            if (found) return found;
        }
    }
    return null;
};

export const Dashboard = ({ editable = false }: { editable?: boolean }) => {
    const { currentPage, gridSize, removeTile, updateTile, saveState, removePanel } = useLayout();

    const { classes, topBar, extraHtml } = useTheme();

    const containerRef = useRef<HTMLDivElement>(null);
    const [resizingTile, setResizingTile] = useState<string | null>(null);
    const [movingTile, setMovingTile] = useState<string | null>(null);

    const [editorOpen, setEditorOpen] = useState(false);
    const [editorTile, setEditorTile] = useState<string | null>(null);

    useEffect(() => {
        // if (loading) return;

        // if (!user) {
        //     router.push("/signin");
        //     return;
        // }
        if (!movingTile || !currentPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const tile = currentPage.tiles.find((t) => t.id === movingTile);
            if (!tile) return;

            const cellWidth = rect.width / gridSize.cols;
            const cellHeight = rect.height / gridSize.rows;

            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;

            let newX = Math.round(relativeX / cellWidth);
            let newY = Math.round(relativeY / cellHeight);

            newX = Math.max(0, Math.min(gridSize.cols - tile.w, newX));
            newY = Math.max(0, Math.min(gridSize.rows - tile.h, newY));

            updateTile({
                ...tile,
                x: newX,
                y: newY,
            });
        };

        const handleMouseUp = () => {
            setMovingTile(null);
            saveState();
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [movingTile, currentPage, gridSize]);

    // IMPORTANT: hooks must run before any conditional return
    useEffect(() => {
        if (!resizingTile || !currentPage) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const tile = currentPage.tiles.find((t) => t.id === resizingTile);
            if (!tile) return;

            const cellWidth = rect.width / gridSize.cols;
            const cellHeight = rect.height / gridSize.rows;

            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;

            let newW = Math.round(relativeX / cellWidth) - tile.x;
            let newH = Math.round(relativeY / cellHeight) - tile.y;

            newW = Math.max(1, newW);
            newH = Math.max(1, newH);

            updateTile({
                ...tile,
                w: newW,
                h: newH,
            });
        };

        const handleMouseUp = () => {
            setResizingTile(null);
            saveState();
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [resizingTile, currentPage, gridSize]);

    const openTileMenu = (tileId: string) => {
        setEditorTile(tileId);
        setEditorOpen(true);
    };

    if (!currentPage) return <div className="p-4">No page selected</div>;

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-[url('/images/backgrounds/builtin/0001.png')] bg-cover"
        >
            {editable && editorOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">Edit Tile {editorTile}</h2>
                        <h3 className="font-semibold text-lg mb-1">Special Effects</h3>
                        <input type="checkbox" id="movable" className="mr-3" />
                        <label htmlFor="movable" className="font-semibold">
                            Movable
                        </label>
                        <br></br>
                        <input type="checkbox" id="topBar" className="mr-3" />
                        <label htmlFor="topBar" className="font-semibold">
                            Top Bar
                        </label>
                        <br></br>
                        {/* Tile editing form goes here */}
                        <button
                            className="mt-4 px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => {
                                const movable = (
                                    document.getElementById("movable") as HTMLInputElement
                                ).checked;
                                const topBar = (
                                    document.getElementById("topBar") as HTMLInputElement
                                ).checked;

                                const tile = currentPage.tiles.find((t) => t.id === editorTile);
                                if (!tile) return; // ⚠️ guard against undefined

                                const newSpecialEffects = [
                                    movable ? "movable" : "",
                                    topBar ? "topBar" : "",
                                ].filter(Boolean);
                                updateTile({
                                    id: tile.id,
                                    registryId: tile.registryId,
                                    x: tile.x,
                                    y: tile.y,
                                    w: tile.w,
                                    h: tile.h,
                                    props: tile.props,
                                    specialEffects: newSpecialEffects,
                                });

                                setEditorOpen(false);
                            }}
                        >
                            Save & Close
                        </button>
                    </div>
                </div>
            )}
            {/* GRID */}
            {editable && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                        gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
                    }}
                >
                    {Array.from({ length: gridSize.cols * gridSize.rows }).map((_, i) => (
                        <div key={i} className="border border-gray-200" />
                    ))}
                </div>
            )}

            {/* PANELS */}
            {currentPage.panels.map((panel) => {
                const def = findRegistry(panel.registryId, PanelRegistry);
                if (!def?.component) return null;
                const PanelComponent = def.component;

                const style: React.CSSProperties = { position: "absolute" };

                if (panel.anchor === "left" || panel.anchor === "right") {
                    style.width = `${panel.size * 100}%`;
                    style.height = "100%";
                    style[panel.anchor] = 0;
                } else {
                    style.height = `${panel.size * 100}%`;
                    style.width = "100%";
                    style[panel.anchor] = 0;
                }

                return (
                    <div key={panel.id} style={style}>
                        {/* delete */}
                        {editable && (
                            <button
                                className="absolute top-0 right-0 text-3xl z-10"
                                onClick={() => {
                                    removePanel(panel.id);
                                }}
                            >
                                <CircleX className="cursor-pointer" />
                            </button>
                        )}
                        <PanelComponent {...panel.props} />
                    </div>
                );
            })}

            {/* TILES */}
            {currentPage.tiles.map((tile) => {
                const def = findRegistry(tile.registryId, TileRegistry);
                if (!def?.component) return null;
                const TileComponent = def.component;

                let TopBarReplaced = topBar;
                if (topBar) {
                    TopBarReplaced = topBar.replace("{__TILE_TITLE__}", def.label || "");
                }

                const style: React.CSSProperties = {
                    position: "absolute",
                    left: `${(tile.x / gridSize.cols) * 100}%`,
                    top: `${(tile.y / gridSize.rows) * 100}%`,
                    width: `${(tile.w / gridSize.cols) * 100}%`,
                    height: `${(tile.h / gridSize.rows) * 100}%`,
                };

                return (
                    <div
                        key={tile.id}
                        style={style}
                        className={
                            (tile.specialEffects?.includes("topBar")
                                ? classes?.TileOuter
                                : classes?.TileOuterNoTopBar) + " relative group"
                        }
                    >
                        {/* delete */}
                        {editable && (
                            <button
                                className="absolute top-0 right-0 z-30 cursor-grab"
                                onClick={() => {
                                    removeTile(tile.id);
                                }}
                            >
                                <CircleX className="cursor-pointer" />
                            </button>
                        )}
                        {TopBarReplaced && tile.specialEffects?.includes("topBar") && (
                            <div dangerouslySetInnerHTML={{ __html: TopBarReplaced }} />
                        )}
                        {extraHtml && <div dangerouslySetInnerHTML={{ __html: extraHtml }} />}
                        <div className={classes?.Tile || "border bg-white shadow"}>
                            <TileComponent {...tile.props} />
                            {editable && (
                                <div
                                    className="absolute bottom-2 left-2 z-30"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openTileMenu(tile.id);
                                    }}
                                >
                                    <Ellipsis className="cursor-pointer z-50" />
                                </div>
                            )}
                        </div>
                        {/* resize handle */}
                        {editable && (
                            <div
                                className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize opacity-0 z-30"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setResizingTile(tile.id);
                                }}
                            />
                        )}
                        {(editable || tile.specialEffects?.includes("movable")) && (
                            <div
                                className={`absolute top-0 left-0 w-7 h-7 cursor-move opacity-0 z-30`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMovingTile(tile.id);
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
