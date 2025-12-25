# 3D Gantt Chart Prototype

A premium 3D Gantt Chart visualization built with React, Three.js, and React Three Fiber. This prototype demonstrates a spatial approach to project management timelines using modern web technologies.

![3D Gantt Chart](https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2370&auto=format&fit=crop) 
*(Note: Replace with actual screenshot)*

## Features

-   **3D Spatial Visualization**: Tasks are rendered as 3D bars in a timeline space.
-   **Glassmorphism Aesthetic**: Premium visual style with neon accents and glass-like materials.
-   **Interactive Scene**:
    -   Orbit controls (Rotate, Pan, Zoom)
    -   Hover effects on tasks
-   **Dependency Tracking**: Visual lines connecting dependent tasks.
-   **Dark Mode**: Optimized for low-light viewing.

## Tech Stack

-   **Framework**: React 19 + Vite
-   **Language**: TypeScript
-   **3D Engine**: Three.js
-   **React 3D Library**: React Three Fiber (@react-three/fiber)
-   **Helpers**: React Three Drei (@react-three/drei)
-   **Styling**: CSS Modules / Vanilla CSS for global styles

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rajeshpillai/3d-gantt-chart-prototype.git
    cd 3d-gantt-chart-prototype
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser at `http://localhost:5173`.

## Controls

-   **Left Click + Drag**: Rotate the scene.
-   **Right Click + Drag**: Pan the camera.
-   **Scroll**: Zoom in/out.
-   **Hover**: View task details (Name, Status).

## Project Structure

```
src/
├── components/
│   ├── Scene.tsx       # Main 3D Canvas setup
│   ├── GanttChart.tsx  # Logic for rendering bars and dependencies
│   ├── GanttBar.tsx    # Individual 3D task bar component
│   └── Overlay.tsx     # 2D HTML/CSS UI Overlay (HUD)
├── theme.ts            # Centralized design tokens (colors, dimensions)
├── mockData.ts         # Sample project data
└── App.tsx             # Root component
```

## License

MIT
