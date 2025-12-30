export type ThemePreset = 'metaverse' | 'cyberpunk' | 'midnight' | 'matrix' | 'arctic';

export interface ThemeColors {
    background: string;
    primary: string;
    secondary: string;
    tertiary: string;
    glass: string;
    glassHigh: string;
    text: {
        main: string;
        muted: string;
    };
    grid: string;
    success: string;
    warning: string;
    danger: string;
}

export const THEMES: Record<ThemePreset, ThemeColors> = {
    metaverse: {
        background: '#050505',
        primary: '#00d4ff',
        secondary: '#ff0055',
        tertiary: '#ffcc00',
        glass: 'rgba(255, 255, 255, 0.1)',
        glassHigh: 'rgba(255, 255, 255, 0.2)',
        text: { main: '#ffffff', muted: '#888888' },
        grid: '#222222',
        success: '#00ff88',
        warning: '#ffaa00',
        danger: '#ff0033'
    },
    cyberpunk: {
        background: '#0a001a', // Deep purple
        primary: '#ff00ff',    // Neon Magenta
        secondary: '#00ffff',  // Neon Cyan
        tertiary: '#ffff00',   // Neon Yellow
        glass: 'rgba(255, 0, 255, 0.1)',
        glassHigh: 'rgba(255, 0, 255, 0.2)',
        text: { main: '#ffffff', muted: '#ff00ff' },
        grid: '#3d002e',
        success: '#00ff00',
        warning: '#ffff00',
        danger: '#ff0000'
    },
    midnight: {
        background: '#000814', // Deep midnight blue
        primary: '#4361ee',    // Royal blue
        secondary: '#7209b7',  // Purple
        tertiary: '#4cc9f0',   // Sky blue
        glass: 'rgba(67, 97, 238, 0.1)',
        glassHigh: 'rgba(67, 97, 238, 0.2)',
        text: { main: '#ffffff', muted: '#4361ee' },
        grid: '#1b263b',
        success: '#2ec4b6',
        warning: '#f6bd60',
        danger: '#e63946'
    },
    matrix: {
        background: '#000000',
        primary: '#00ff00',    // Bright green
        secondary: '#003300',  // Dark green
        tertiary: '#33cc33',   // Mid green
        glass: 'rgba(0, 255, 0, 0.05)',
        glassHigh: 'rgba(0, 255, 0, 0.15)',
        text: { main: '#00ff00', muted: '#003300' },
        grid: '#001a00',
        success: '#00ff00',
        warning: '#66ff66',
        danger: '#ff6666'
    },
    arctic: {
        background: '#f8f9fa', // Off-white
        primary: '#0077b6',    // Steel blue
        secondary: '#00b4d8',  // Sky blue
        tertiary: '#90e0ef',   // Light blue
        glass: 'rgba(0, 0, 0, 0.05)',
        glassHigh: 'rgba(0, 0, 0, 0.1)',
        text: { main: '#03045e', muted: '#0077b6' },
        grid: '#e9ecef',
        success: '#40916c',
        warning: '#f4a261',
        danger: '#e76f51'
    }
};

export const METRICS = {
    barHeight: 0.5,
    barDepth: 0.5,
    rowHeight: 1.2,
    dayWidth: 1.0,
    textScale: 0.3
};

// Default export for convenience, but we'll use THEMES in App.tsx
export const THEME = {
    colors: THEMES.metaverse,
    metrics: METRICS
};
