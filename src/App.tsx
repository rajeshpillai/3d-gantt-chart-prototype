import { useState } from 'react';
import Scene from './components/Scene';
import Overlay from './components/Overlay';

export type ViewMode = 'perspective' | 'horizontal';

function App() {
    const [viewMode, setViewMode] = useState<ViewMode>('perspective');
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <Scene viewMode={viewMode} isOpen={isOpen} />
            <Overlay viewMode={viewMode} setViewMode={setViewMode} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
}

export default App;
