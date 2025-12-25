// @ts-ignore
import tasksData from './data/tasks.json';

export type TaskStatus = 'done' | 'in-progress' | 'todo' | 'delayed';

export interface GanttTask {
    id: string;
    name: string;
    startDay: number;
    duration: number;
    status: TaskStatus;
    startDate?: string;
    endDate?: string;
    dependencies?: string[];
    owner?: string;
    category?: string;
}

export const MOCK_DATA: GanttTask[] = tasksData as GanttTask[];
