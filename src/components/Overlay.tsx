import React from 'react';
import type { ViewMode } from '../App';
import { Layers, Box } from 'lucide-react';

interface OverlayProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Overlay: React.FC<OverlayProps> = ({ viewMode, setViewMode, isOpen, setIsOpen }) => {
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
                    <div style={{ width: '30px', height: '30px', background: 'linear-gradient(45deg, #00d4ff, #ff0055)', borderRadius: '8px' }}></div>
                    <h1 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontFamily: 'Inter, sans-serif' }}>3D Gantt Chart</h1>
                </div>
                <div style={{ display: 'flex', gap: '20px', color: 'white', alignItems: 'center' }}>
                    <button
                        onClick={() => setViewMode(viewMode === 'perspective' ? 'horizontal' : 'perspective')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
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
                        {viewMode === 'perspective' ? <Box size={16} /> : <Layers size={16} />}
                        {viewMode === 'perspective' ? '3D View' : '2D View'}
                    </button>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            minWidth: '80px',
                            justifyContent: 'center'
                        }}
                    >
                        {isOpen ? 'Close Lid' : 'Open Lid'}
                    </button>

                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>
                    <span>Project Alpha</span>
                    <span style={{ opacity: 0.5 }}>|</span>
                    <span>May 15</span>
                </div>
            </header>

            <div style={{ marginTop: 'auto', color: 'white', opacity: 0.5, fontSize: '0.8rem' }}>
                Left Click + Drag to Rotate • Right Click + Drag to Pan • Scroll to Zoom
            </div>
        </div>
    );
};

export default Overlay;
