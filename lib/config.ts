import { JSONFilePreset } from "lowdb/node";
import { NextResponse } from "next/server";
import type { ConfigValue, Configs } from "./configTypes";

type DbData = {
    configs: Configs;
};

const defaultData: DbData = { configs: {} };
const db = await JSONFilePreset("db.json", defaultData);

export async function readConfigs() {
    await db.read();

    return db.data?.configs ?? {};
}

export async function listConfigNames() {
    const configs = await readConfigs();
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(configs)) {
        if (value && typeof value === "object" && "name" in value) {
            result[key] = String((value as Record<string, unknown>).name);
        }
    }

    return result;
}

export async function readConfig(key: string) {
    const configs = await readConfigs();

    return configs[key] ?? null;
}

export async function writeConfig(key: string, value: ConfigValue) {
    await db.read();
    db.data = db.data || defaultData;
    db.data.configs[key] = value;
    await db.write();
}

export async function handleSetConfigRequest(request: Request) {
    try {
        const { key, value } = await request.json();
        await writeConfig(key, value);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Failed to write config" },
            { status: 500 }
        );
    }
}

export async function handleListConfigRequest() {
    try {
        return NextResponse.json(await listConfigNames());
    } catch {
        return NextResponse.json(
            { error: "Failed to read configs" },
            { status: 500 }
        );
    }
}

export async function handleGetConfigRequest(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json({ error: "Missing key" }, { status: 400 });
        }

        const config = await readConfig(key);

        if (!config) {
            return NextResponse.json(
                { error: "Config not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(config);
    } catch {
        return NextResponse.json(
            { error: "Failed to read config" },
            { status: 500 }
        );
    }
}
