import type { ConfigValue } from "./configTypes";

export const selectedConfigStorageKey = "selected_config_id";

export const getSelectedConfigId = () => {
    if (typeof window === "undefined") return null;

    return window.localStorage.getItem(selectedConfigStorageKey);
};

export const setSelectedConfigId = (configId: string) => {
    window.localStorage.setItem(selectedConfigStorageKey, configId);
};

export const isEmptyConfig = (config: ConfigValue | null | undefined) => {
    return !config || Object.keys(config).length === 0;
};

export async function fetchConfigList() {
    const response = await fetch("/api/config/list");

    if (!response.ok) {
        throw new Error("Failed to load configs");
    }

    return (await response.json()) as Record<string, string>;
}

export async function fetchConfig(configId: string) {
    const response = await fetch(
        `/api/config/get?key=${encodeURIComponent(configId)}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to load config");
    }

    return (await response.json()) as ConfigValue;
}

export async function saveConfig(configId: string, value: ConfigValue) {
    const response = await fetch("/api/config/set", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: configId, value })
    });

    if (!response.ok) {
        throw new Error("Failed to save config");
    }
}
