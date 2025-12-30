import { useState } from 'react';
import Scene from './components/Layout/Scene';
import Overlay from './components/Layout/Overlay';

export type ViewMode = 'perspective' | 'pipeline' | 'kanban' | 'audit' | 'topology' | 'galaxy';

function App() {
    const [viewMode, setViewMode] = useState<ViewMode>('perspective');

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <Scene viewMode={viewMode} />
            <Overlay viewMode={viewMode} setViewMode={setViewMode} />
        </div>
    );
}

export default App;
