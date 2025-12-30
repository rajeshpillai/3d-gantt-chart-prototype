import { type Component } from 'solid-js';
import { ThemeProvider, useTheme } from './ThemeContext';
import ThreeScene from './components/Three/ThreeScene';
import GanttBars from './components/Gantt/GanttBars';
import TimeAxisVanilla from './components/Gantt/TimeAxisVanilla';
import TaskLabelsVanilla from './components/Gantt/TaskLabelsVanilla';
import Header from './components/Layout/Header';
import './App.css';

const AppContent: Component = () => {
  const theme = useTheme();

  return (
    <div
      class="app"
      style={{
        background: theme.colors().background,
        color: theme.colors().text.main,
        'min-height': '100vh',
        transition: 'background 0.3s ease'
      }}
    >
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
  );
};

const App: Component = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
