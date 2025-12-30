import { createContext, useContext, createSignal, createMemo } from 'solid-js';
import type { JSX } from 'solid-js';
import { THEMES, METRICS, type ThemePreset, type ThemeColors } from './theme';

interface ThemeContextType {
    preset: () => ThemePreset;
    colors: () => ThemeColors;
    metrics: typeof METRICS;
    setPreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType>();

export function ThemeProvider(props: { children: JSX.Element }) {
    const [preset, setPreset] = createSignal<ThemePreset>('metaverse');

    const colors = createMemo(() => THEMES[preset()]);

    const value: ThemeContextType = {
        preset,
        colors,
        metrics: METRICS,
        setPreset
    };

    return (
        <ThemeContext.Provider value={value}>
            {props.children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
