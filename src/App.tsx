import Scene from './components/Scene';
import Overlay from './components/Overlay';

function App() {
    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
            <Scene />
            <Overlay />
        </div>
    );
}

export default App;
