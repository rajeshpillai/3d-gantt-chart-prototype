# ProPeak CRM Metaverse Prototype

A state-of-the-art 3D Management Suite built with **React**, **Three.js**, and **React Three Fiber**. This prototype reimagines traditional CRM and Project Management interfaces as immersive spatial environments, designed for high-stakes decision-making and complex data analysis.

---

## 🌌 Core Visualizations

### 1. 📊 3D Gantt Chart (Spatial Timeline)
Traditional timelines lack depth. This view renders tasks as 3D glass bars in a spatial grid, allowing project managers to visualize overlapping constraints and buffer zones with physical intuition.
*   **Application:** Complex project scheduling, multi-track product launches.
*   **Aesthetic:** Neon glassmorphism with dynamic time-axis indicators.

### 2. 🌊 Sales Pipeline (Flow Dynamics)
Visualize deals moving through the sales funnel on a dark, reflective floor. Stages are rendered as glowing 3D panels, and deals are instanced meshes that react to hover and stage transitions.
*   **Application:** High-volume lead management, CRM sales ops.
*   **Feature:** `MeshReflectorMaterial` for a premium, high-tech "Command Center" feel.

### 3. 🕸️ Dependency Galaxy (Network Graph)
An orbital cloud of tasks where dependencies are rendered as "Beams of Light." 
*   **The "Bloodline" Interaction:** Clicking a node lights up its entire dependency chain (upstream and downstream) while fading unrelated nodes.
*   **Application:** Critical Path Analysis (CPA), identifying project bottlenecks, risk assessment.

### 4. 🧭 Circular Kanban (360° War Room)
A cylindrical layout that clusters tasks by status around a central pillar. It provides a "War Room" perspective where the user is at the center of the action.
*   **Application:** Daily stand-ups, active sprint monitoring.
*   **Innovation:** Opaque status-colored cards with high-contrast text for maximum readability.

### 5. 🌡️ Resource Topology (Workload Heatmap)
A 3D landscape of pillars representing team members across a 6-month horizon. 
*   **Heatmap Logic:** Pillars transition from Cyan (Available) to Yellow (Warning) to Red (At-Risk) based on task density.
*   **Application:** Resource leveling, preventing burnout, capacity planning.

### 6. 🕒 Time Travel Audit (Temporal Drift)
Stacked historical snapshots rendered as semi-transparent glass layers. 
*   **Drift Lines:** Vertical connections trace task progress across snapshots, highlighting where projects "slipped" from the baseline.
*   **Application:** Post-mortems, forensic auditing, project history review.

---

## 🛠 Tech Stack

-   **Frontend**: React 19 + Vite (Next-gen build speed)
-   **3D Core**: Three.js & React Three Fiber (Web GL)
-   **Scene Helpers**: React Three Drei (Post-processing, Bloom, Camera Controls)
-   **Icons**: Lucide React
-   **Performance**: Optimized with `instancedMesh` for rendering thousands of deals/nodes with 60fps stability.

---

## 🚀 Getting Started

### Installation

1.  Clone and enter the directory:
    ```bash
    git clone https://github.com/rajeshpillai/3d-gantt-chart-prototype.git
    cd 3d-gantt-chart-prototype
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Launch the immersive environment:
    ```bash
    npm run dev
    ```

### Controls
-   **Left Click + Drag**: Rotate (Orbit)
-   **Right Click + Drag**: Pan (Translate)
-   **Scroll**: Zoom (Depth)
-   **Single Click**: Interact with specific 3D objects (e.g., highlighting Dependency Bloodlines)

---

## 🎨 Design Philosophy
The prototype follows a **Premium Dark Tech** aesthetic. By using Bloom effects, reflective floors, and emissive materials, we turn dry project data into a visually arresting experience that keeps users engaged with their data.

---

## 📜 License
MIT
