"use client";

// context/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import {
    defaultClasses,
    ClassMap,
    themes,
    defaultTopBar,
    defaultExtraHtml,
} from "@/lib/themeClasses";

type ThemeContextType = {
    classes: ClassMap;
    updateClass: (key: keyof ClassMap, value: string) => void;
    setClasses: (classes: ClassMap) => void;
    topBar: string;
    updateTopBar: (value: string) => void;
    fetchFromTheme: (themeKey: string) => void;
    extraHtml?: string;
    defaultExtraHtml?: string;
    updateExtraHtml?: (value: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    classes: defaultClasses,
    updateClass: () => {},
    setClasses: () => {},
    topBar: "",
    extraHtml: "",
    updateTopBar: () => {},
    fetchFromTheme: () => {},
    updateExtraHtml: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [classes, setClasses] = useState<ClassMap>(defaultClasses);
    const [topBar, setTopBar] = useState<string>(defaultTopBar);
    const [extraHtml, setExtraHtml] = useState<string>(defaultExtraHtml);

    const updateClass = (key: keyof ClassMap, value: string) => {
        setClasses((prev: any) => ({ ...prev, [key]: value }));
    };

    const updateTopBar = (value: string) => {
        setTopBar(value);
    };

    const updateExtraHtml = (value: string) => {
        setExtraHtml(value);
    };

    const fetchFromTheme = (themeKey: string) => {
        const theme = themes[themeKey as keyof typeof themes];
        if (theme) {
            setClasses(theme.classes);
            setTopBar(theme.TopBar || "");
            setExtraHtml(theme.extraHtml || "");
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                classes,
                updateClass,
                setClasses,
                topBar,
                extraHtml,
                updateTopBar,
                fetchFromTheme,
                updateExtraHtml,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
