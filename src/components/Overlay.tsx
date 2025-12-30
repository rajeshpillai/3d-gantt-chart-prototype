import React from 'react';
import type { ViewMode } from '../App';
import { Layers, Box, History, Activity } from 'lucide-react';

interface OverlayProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

const Overlay: React.FC<OverlayProps> = ({ viewMode, setViewMode }) => {
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
            padding: '20px'
        }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                padding: '10px 20px',
                borderRadius: '15px',
                border: '1px solid rgba(255,255,255,0.1)',
                pointerEvents: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif' }}>PRO[Peak] CRM 3D</h1>
                </div>
                <div style={{ display: 'flex', gap: '8px', color: 'white', alignItems: 'center', pointerEvents: 'auto' }}>
                    <button
                        onClick={() => setViewMode('perspective')}
                        style={{
                            background: viewMode === 'perspective' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `1px solid ${viewMode === 'perspective' ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: 'white',
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
                            background: viewMode === 'pipeline' ? 'rgba(255, 0, 85, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `1px solid ${viewMode === 'pipeline' ? '#ff0055' : 'rgba(255,255,255,0.2)'}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: 'white',
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
                            background: viewMode === 'kanban' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `1px solid ${viewMode === 'kanban' ? '#00ff88' : 'rgba(255,255,255,0.2)'}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: 'white',
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
                            background: viewMode === 'audit' ? 'rgba(155, 89, 182, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `1px solid ${viewMode === 'audit' ? '#9b59b6' : 'rgba(255,255,255,0.2)'}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: 'white',
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
                            background: viewMode === 'topology' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: `1px solid ${viewMode === 'topology' ? '#e74c3c' : 'rgba(255,255,255,0.2)'}`,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: 'white',
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

                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 12px' }}></div>
                    <span>Project Alpha</span>
                    <span style={{ opacity: 0.5 }}>|</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </header>

            <div style={{ marginTop: 'auto', color: 'white', opacity: 0.5, fontSize: '0.8rem' }}>
                Left Click + Drag to Rotate • Right Click + Drag to Pan • Scroll to Zoom
            </div>
        </div>
    );
};

export default Overlay;
