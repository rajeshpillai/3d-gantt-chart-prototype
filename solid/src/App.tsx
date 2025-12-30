import { type Component } from 'solid-js';
import { ThemeProvider } from './ThemeContext';
import ThreeScene from './components/Three/ThreeScene';
import GanttBars from './components/Gantt/GanttBars';
import TimeAxisVanilla from './components/Gantt/TimeAxisVanilla';
import TaskLabelsVanilla from './components/Gantt/TaskLabelsVanilla';
import Header from './components/Layout/Header';
import './App.css';

const App: Component = () => {
  return (
    <ThemeProvider>
      <div class="app">
        <Header />

        {/* Main Content */}
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <ThreeScene>
            <GanttBars />
            <TimeAxisVanilla />
            <TaskLabelsVanilla />
          </ThreeScene>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
