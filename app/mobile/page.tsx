import { Dashboard } from "@/components/Dashboard";
import { LayoutProvider } from "@/context/layoutContext";
import { ThemeProvider } from "@/context/themeContext";

export default function Mobile() {
    return (
        <ThemeProvider>
            <LayoutProvider>
                <Dashboard />
            </LayoutProvider>
        </ThemeProvider>
    );
}
