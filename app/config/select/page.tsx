"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchConfigList, setSelectedConfigId } from "@/lib/configClient";

export default function ConfigSelectPage() {
    const router = useRouter();
    const [configs, setConfigs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadConfigs = async () => {
            try {
                const result = await fetchConfigList();

                if (cancelled) return;

                setConfigs(result);
            } catch {
                if (!cancelled) {
                    setError("Failed to load configs");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadConfigs();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleSelect = (configId: string) => {
        setSelectedConfigId(configId);
        router.replace("/mobile");
    };

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f5f7ff,#eef2ff_45%,#f8fafc_100%)] px-6 py-10 text-slate-950">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col justify-center">
                <div className="mb-8 max-w-xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                        Config select
                    </p>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        Pick a config to open the dashboard.
                    </h1>
                    <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                        Choose one of the available configs. Your selection will
                        be stored locally and you’ll be taken to the mobile
                        dashboard.
                    </p>
                </div>

                <section className="rounded-4xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
                    {loading ? (
                        <div className="px-4 py-8 text-sm text-slate-500">
                            Loading configs...
                        </div>
                    ) : error ? (
                        <div className="px-4 py-8 text-sm text-red-600">
                            {error}
                        </div>
                    ) : Object.keys(configs).length === 0 ? (
                        <div className="px-4 py-8 text-sm text-slate-500">
                            No configs found.
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(configs).map(
                                ([configId, configName]) => (
                                    <button
                                        key={configId}
                                        type="button"
                                        onClick={() => handleSelect(configId)}
                                        className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                                    >
                                        <div>
                                            <div className="text-lg font-semibold text-slate-900">
                                                {configName}
                                            </div>
                                            <div className="mt-1 text-sm text-slate-500">
                                                {configId}
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-400 transition group-hover:text-slate-700">
                                            Select
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
