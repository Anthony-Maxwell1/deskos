"use client";

import { Dashboard } from "@/components/Dashboard";
import { LayoutProvider, useLayout } from "@/context/layoutContext";
import { ThemeProvider } from "@/context/themeContext";
import {
    fetchConfig,
    fetchConfigList,
    getSelectedConfigId,
    saveConfig,
    setSelectedConfigId
} from "@/lib/configClient";
import { TileRegistry, PanelRegistry, RegistryNode } from "@/lib/tiles";
import type { ConfigValue } from "@/lib/configTypes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RegistryBrowser = ({
    nodes,
    onStartDrag
}: {
    nodes: RegistryNode[];
    onStartDrag: (
        node: RegistryNode,
        initialMouse: { x: number; y: number }
    ) => void;
}) => (
    <ul className="ml-2">
        {nodes.map(n => {
            const Component = n.component;

            return (
                <li key={n.id} className="mb-1">
                    <div
                        className="cursor-pointer rounded p-1 hover:bg-gray-200"
                        onMouseDown={e => {
                            e.preventDefault();
                            onStartDrag(n, { x: e.clientX, y: e.clientY });
                        }}
                    >
                        {Component ? (
                            <Component />
                        ) : (
                            <span className="font-semibold">{n.label}</span>
                        )}
                    </div>

                    {n.children && (
                        <RegistryBrowser
                            nodes={n.children}
                            onStartDrag={onStartDrag}
                        />
                    )}
                </li>
            );
        })}
    </ul>
);

function ConfigEditorCanvas() {
    const {
        currentPage,
        gridSize,
        updateTile,
        saveState,
        addPanel,
        addTile,
        addPage,
        pages,
        setCurrentPage
    } = useLayout();

    const dashboardRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);
    const [draggingNode, setDraggingNode] = useState<RegistryNode | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [dragType, setDragType] = useState<"tile" | "panel" | null>(null);
    const [globalEditorOpen, setGlobalEditorOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!draggingNode) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (!dashboardRef.current) {
                setDraggingNode(null);
                setDragType(null);
                return;
            }

            const rect = dashboardRef.current.getBoundingClientRect();

            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (inside) {
                const relativeX = e.clientX - rect.left;
                const relativeY = e.clientY - rect.top;

                const col = Math.floor(
                    (relativeX / rect.width) * gridSize.cols
                );
                const row = Math.floor(
                    (relativeY / rect.height) * gridSize.rows
                );

                if (dragType === "tile") {
                    addTile({
                        id: crypto.randomUUID(),
                        registryId: draggingNode.id,
                        x: col,
                        y: row,
                        w: Math.max(1, Math.round(gridSize.cols / 4)),
                        h: Math.max(1, Math.round(gridSize.rows / 4)),
                        props: draggingNode.defaultProps ?? {}
                    });
                    saveState();
                }

                if (dragType === "panel") {
                    addPanel({
                        id: crypto.randomUUID(),
                        registryId: draggingNode.id,
                        anchor: "left",
                        size: 0.25,
                        props: draggingNode.defaultProps ?? {}
                    });
                    saveState();
                }
            }

            setDraggingNode(null);
            setDragType(null);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [draggingNode, dragType, gridSize, addTile, addPanel, saveState]);

    const startDrag = (node: RegistryNode, type: "tile" | "panel") => {
        setDraggingNode(node);
        setDragType(type);
    };

    let previewStyle: React.CSSProperties | undefined;

    if (draggingNode && dashboardRef.current && dragType === "tile") {
        const rect = dashboardRef.current.getBoundingClientRect();

        const col = Math.floor(
            (mousePos.x - rect.left) / (rect.width / gridSize.cols)
        );
        const row = Math.floor(
            (mousePos.y - rect.top) / (rect.height / gridSize.rows)
        );

        const cellWidth = rect.width / gridSize.cols;
        const cellHeight = rect.height / gridSize.rows;

        previewStyle = {
            position: "fixed",
            left: rect.left + col * cellWidth,
            top: rect.top + row * cellHeight,
            width: cellWidth * Math.max(1, Math.round(gridSize.cols / 4)),
            height: cellHeight * Math.max(1, Math.round(gridSize.rows / 4))
        };
    }

    if (!mounted) return null;

    return (
        <div className="relative flex min-h-160 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {globalEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
                        <h2 className="mb-4 text-xl font-bold">
                            Global Editor
                        </h2>
                        <input type="checkbox" id="movable" className="mr-3" />
                        <label htmlFor="movable" className="font-semibold">
                            Movable
                        </label>
                        <br />
                        <input type="checkbox" id="topBar" className="mr-3" />
                        <label htmlFor="topBar" className="font-semibold">
                            Top Bar
                        </label>
                        <br />
                        <button
                            className="mt-4 rounded bg-blue-500 px-3 py-1 text-white"
                            onClick={() => {
                                const movable = (
                                    document.getElementById(
                                        "movable"
                                    ) as HTMLInputElement
                                ).checked;

                                const topBar = (
                                    document.getElementById(
                                        "topBar"
                                    ) as HTMLInputElement
                                ).checked;

                                const newSpecialEffects = [
                                    movable ? "movable" : "",
                                    topBar ? "topBar" : ""
                                ].filter(Boolean);

                                for (const tile of currentPage?.tiles ?? []) {
                                    updateTile({
                                        id: tile.id,
                                        registryId: tile.registryId,
                                        x: tile.x,
                                        y: tile.y,
                                        w: tile.w,
                                        h: tile.h,
                                        props: tile.props,
                                        specialEffects: newSpecialEffects
                                    });
                                }

                                setGlobalEditorOpen(false);
                            }}
                        >
                            Save and close
                        </button>
                    </div>
                </div>
            )}

            <aside className="w-52 border-r border-slate-200 bg-slate-50 p-3">
                <button
                    onClick={addPage}
                    className="mb-3 w-full rounded bg-blue-600 p-2 text-white"
                >
                    + Page
                </button>

                <div className="space-y-1">
                    {pages.map(p => (
                        <button
                            key={p.id}
                            className="block w-full rounded border border-slate-200 bg-white p-2 text-left text-xs"
                            onClick={() => setCurrentPage(p.id)}
                        >
                            {p.id}
                        </button>
                    ))}
                </div>
            </aside>

            <main className="relative flex-1" ref={dashboardRef}>
                <Dashboard editable />
            </main>

            <aside className="w-72 overflow-auto border-l border-slate-200 bg-slate-50 p-3">
                <h3 className="font-bold">Tiles</h3>
                <RegistryBrowser
                    nodes={TileRegistry}
                    onStartDrag={(node, mouse) => {
                        setMousePos(mouse);
                        startDrag(node, "tile");
                    }}
                />

                <h3 className="mt-4 font-bold">Panels</h3>
                <RegistryBrowser
                    nodes={PanelRegistry}
                    onStartDrag={(node, mouse) => {
                        setMousePos(mouse);
                        startDrag(node, "panel");
                    }}
                />
            </aside>

            {draggingNode && dragType === "tile" && previewStyle && (
                <div
                    className="pointer-events-none fixed z-50 border-2 border-blue-500 bg-blue-200/60"
                    style={previewStyle}
                >
                    <span className="text-xs">{draggingNode.label}</span>
                </div>
            )}

            <button
                className="fixed bottom-6 right-6 z-40 rounded bg-red-600 px-3 py-1 text-white"
                onClick={() => {
                    setGlobalEditorOpen(true);
                }}
            >
                Global options
            </button>
        </div>
    );
}

function ConfigPageContent() {
    const router = useRouter();
    const [configs, setConfigs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeConfigId, setActiveConfigId] = useState<string>("");
    const [name, setName] = useState("");
    const [cols, setCols] = useState(4);
    const [rows, setRows] = useState(3);
    const [status, setStatus] = useState<string>("");

    const loadConfigList = async () => {
        const list = await fetchConfigList();
        setConfigs(list);
        return list;
    };

    const applyConfig = (id: string, value: ConfigValue | null) => {
        setActiveConfigId(id);
        setSelectedConfigId(id);
        setName(String(value?.name ?? id));

        const gridSize = Array.isArray(value?.gridSize)
            ? value.gridSize
            : [4, 3];
        setCols(Number(gridSize[0]) || 4);
        setRows(Number(gridSize[1]) || 3);
    };

    useEffect(() => {
        let cancelled = false;

        const bootstrap = async () => {
            try {
                const list = await loadConfigList();
                const selected = getSelectedConfigId();
                const firstId = Object.keys(list)[0] ?? "";
                const candidate =
                    selected && list[selected] ? selected : firstId;

                if (!candidate || cancelled) {
                    setLoading(false);
                    return;
                }

                const value = await fetchConfig(candidate);
                if (!cancelled) {
                    applyConfig(candidate, value);
                    setLoading(false);
                }
            } catch {
                if (!cancelled) {
                    setStatus("Failed to load configs");
                    setLoading(false);
                }
            }
        };

        void bootstrap();

        return () => {
            cancelled = true;
        };
    }, []);

    const handlePick = async (id: string) => {
        setStatus("");
        const value = await fetchConfig(id);
        applyConfig(id, value);
    };

    const handleCreate = async () => {
        setStatus("");
        const base = (name.trim() || "config")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
        const id = `${base || "config"}-${crypto.randomUUID().slice(0, 8)}`;

        const value: ConfigValue = {
            name: name.trim() || "Untitled Config",
            gridSize: [Math.max(1, cols), Math.max(1, rows)]
        };

        setSaving(true);
        try {
            await saveConfig(id, value);
            const list = await loadConfigList();
            setConfigs(list);
            applyConfig(id, value);
            setStatus("Created config");
        } catch {
            setStatus("Failed to create config");
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!activeConfigId) {
            setStatus("Pick or create a config first");
            return;
        }

        setSaving(true);
        setStatus("");

        const value: ConfigValue = {
            name: name.trim() || activeConfigId,
            gridSize: [Math.max(1, cols), Math.max(1, rows)]
        };

        try {
            await saveConfig(activeConfigId, value);
            const list = await loadConfigList();
            setConfigs(list);
            setStatus("Saved config");
        } catch {
            setStatus("Failed to save config");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f2f7ff,#edf5ff_35%,#f8fafc_100%)] p-6 text-slate-900">
            <div className="mx-auto flex w-full max-w-350 flex-col gap-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_60px_rgba(15,23,42,0.08)]">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                                Config studio
                            </p>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Create, choose, and edit configs
                            </h1>
                        </div>
                        <button
                            type="button"
                            className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
                            onClick={() => router.push("/mobile")}
                        >
                            Open mobile
                        </button>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <p className="mb-2 text-sm font-semibold text-slate-700">
                                Existing configs
                            </p>
                            <div className="max-h-52 space-y-2 overflow-auto">
                                {Object.keys(configs).length === 0 ? (
                                    <div className="text-sm text-slate-500">
                                        No configs found.
                                    </div>
                                ) : (
                                    Object.entries(configs).map(
                                        ([id, label]) => (
                                            <button
                                                type="button"
                                                key={id}
                                                onClick={() => {
                                                    void handlePick(id);
                                                }}
                                                className={
                                                    "block w-full rounded border px-3 py-2 text-left text-sm " +
                                                    (activeConfigId === id
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-slate-200 bg-white")
                                                }
                                            >
                                                <div className="font-medium">
                                                    {label}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {id}
                                                </div>
                                            </button>
                                        )
                                    )
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <p className="mb-2 text-sm font-semibold text-slate-700">
                                Config fields
                            </p>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="flex flex-col gap-1 text-sm">
                                    Name
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="rounded border border-slate-300 bg-white px-2 py-1.5"
                                        placeholder="My config"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    Grid columns
                                    <input
                                        type="number"
                                        min={1}
                                        value={cols}
                                        onChange={e =>
                                            setCols(Number(e.target.value) || 1)
                                        }
                                        className="rounded border border-slate-300 bg-white px-2 py-1.5"
                                    />
                                </label>
                                <label className="flex flex-col gap-1 text-sm">
                                    Grid rows
                                    <input
                                        type="number"
                                        min={1}
                                        value={rows}
                                        onChange={e =>
                                            setRows(Number(e.target.value) || 1)
                                        }
                                        className="rounded border border-slate-300 bg-white px-2 py-1.5"
                                    />
                                </label>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleCreate();
                                    }}
                                    disabled={saving || loading}
                                    className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
                                >
                                    Create new
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        void handleSave();
                                    }}
                                    disabled={saving || loading}
                                    className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                                >
                                    Save selected
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/config/select")
                                    }
                                    className="rounded bg-white px-3 py-2 text-sm text-slate-700"
                                >
                                    Go to select page
                                </button>
                            </div>

                            {!!status && (
                                <p className="mt-3 text-sm text-slate-600">
                                    {status}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <ConfigEditorCanvas />
            </div>
        </main>
    );
}

export default function ConfigPage() {
    return (
        <ThemeProvider>
            <LayoutProvider>
                <ConfigPageContent />
            </LayoutProvider>
        </ThemeProvider>
    );
}
