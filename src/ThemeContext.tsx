import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { THEMES, METRICS } from './theme';
import type { ThemePreset, ThemeColors } from './theme';

interface ThemeContextType {
    preset: ThemePreset;
    colors: ThemeColors;
    metrics: typeof METRICS;
    setPreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [preset, setPreset] = useState<ThemePreset>('metaverse');

    const value = {
        preset,
        colors: THEMES[preset],
        metrics: METRICS,
        setPreset
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
