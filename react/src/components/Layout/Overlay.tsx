import React from 'react';
import type { ViewMode } from '../../App';
import { Layers, Box, History, Activity, Share2, Palette } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { THEMES, type ThemePreset } from '../../theme';

interface OverlayProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const Overlay: React.FC<OverlayProps> = ({ viewMode, setViewMode }) => {
    const { preset, setPreset, colors } = useTheme();

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            color: colors.text.main
        }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: colors.background === '#ffffff' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                padding: '10px 20px',
                borderRadius: '15px',
                border: `1px solid ${colors.glassHigh}`,
                pointerEvents: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, color: colors.text.main, fontSize: '1.2rem', fontFamily: 'Inter, sans-serif' }}>PRO[Peak] CRM 3D</h1>

                    {/* Theme Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', border: `1px solid ${colors.glass}` }}>
                        <Palette size={14} color={colors.primary} />
                        <select
                            value={preset}
                            onChange={(e) => setPreset(e.target.value as ThemePreset)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: colors.text.main,
                                fontSize: '0.8rem',
                                outline: 'none',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {Object.keys(THEMES).map(t => (
                                <option key={t} value={t} style={{ background: '#222', color: 'white' }}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', color: colors.text.main, alignItems: 'center', pointerEvents: 'auto' }}>
                    <button
                        onClick={() => setViewMode('perspective')}
                        style={{
                            background: viewMode === 'perspective' ? `${colors.primary}22` : colors.glass,
                            border: `1px solid ${viewMode === 'perspective' ? colors.primary : colors.glassHigh}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: colors.text.main,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Layers size={16} />
                        3D Gantt
                    </button>

                    <button
                        onClick={() => setViewMode('pipeline')}
                        style={{
                            background: viewMode === 'pipeline' ? `${colors.secondary}22` : colors.glass,
                            border: `1px solid ${viewMode === 'pipeline' ? colors.secondary : colors.glassHigh}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: colors.text.main,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Box size={16} />
                        Sales Pipeline
                    </button>

                    <button
                        onClick={() => setViewMode('kanban')}
                        style={{
                            background: viewMode === 'kanban' ? `${colors.success}22` : colors.glass,
                            border: `1px solid ${viewMode === 'kanban' ? colors.success : colors.glassHigh}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: colors.text.main,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Layers size={16} />
                        Circular Kanban
                    </button>

                    <button
                        onClick={() => setViewMode('audit')}
                        style={{
                            background: viewMode === 'audit' ? `${colors.tertiary}22` : colors.glass,
                            border: `1px solid ${viewMode === 'audit' ? colors.tertiary : colors.glassHigh}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: colors.text.main,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <History size={16} />
                        Audit Trail
                    </button>

                    <button
                        onClick={() => setViewMode('topology')}
                        style={{
                            background: viewMode === 'topology' ? `${colors.danger}22` : colors.glass,
                            border: `1px solid ${viewMode === 'topology' ? colors.danger : colors.glassHigh}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: colors.text.main,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Activity size={16} />
                        Workload Heatmap
                    </button>

                    <button
                        onClick={() => setViewMode('galaxy')}
                        style={{
                            background: viewMode === 'galaxy' ? `${colors.primary}22` : colors.glass,
                            border: `1px solid ${viewMode === 'galaxy' ? colors.primary : colors.glassHigh}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: colors.text.main,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Share2 size={16} />
                        Dependency Galaxy
                    </button>

                    <div style={{ width: '1px', height: '20px', background: colors.glassHigh, margin: '0 12px' }}></div>
                    <span>Project Alpha</span>
                    <span style={{ opacity: 0.5 }}>|</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </header>

            <div style={{ marginTop: 'auto', color: colors.text.main, opacity: 0.5, fontSize: '0.8rem' }}>
                Left Click + Drag to Rotate • Right Click + Drag to Pan • Scroll to Zoom
            </div>
        </div>
    );
};

export default Overlay;
