export type TaskStatus = 'done' | 'in-progress' | 'todo' | 'delayed';

export interface GanttTask {
    id: string;
    name: string;
    startDay: number; // For simplicity, 0-indexed day from project start
    duration: number; // In days
    status: TaskStatus;
    dependencies?: string[]; // IDs of tasks this depends on
    owner?: string;
}

export const MOCK_DATA: GanttTask[] = [
    { id: '1', name: 'Design Phase', startDay: 0, duration: 5, status: 'done', owner: 'Alice' },
    { id: '2', name: 'UI Design', startDay: 1, duration: 4, status: 'done', dependencies: ['1'], owner: 'Bob' },
    { id: '3', name: 'Backend Dev', startDay: 4, duration: 8, status: 'in-progress', dependencies: ['1'], owner: 'Charlie' },
    { id: '4', name: 'API Integration', startDay: 7, duration: 5, status: 'in-progress', dependencies: ['3'], owner: 'Dave' },
    { id: '5', name: 'Frontend Dev', startDay: 5, duration: 10, status: 'in-progress', dependencies: ['2'], owner: 'Eve' },
    { id: '6', name: 'Beta Testing', startDay: 14, duration: 4, status: 'todo', dependencies: ['4', '5'], owner: 'Frank' },
    { id: '7', name: 'User Testing', startDay: 18, duration: 3, status: 'todo', dependencies: ['6'], owner: 'Grace' },
    { id: '8', name: 'QA', startDay: 15, duration: 5, status: 'delayed', dependencies: ['5'], owner: 'Heidi' },
    { id: '9', name: 'Marketing Prep', startDay: 10, duration: 8, status: 'in-progress', owner: 'Ivan' },
    { id: '10', name: 'Product Launch', startDay: 22, duration: 2, status: 'todo', dependencies: ['7', '8', '9'], owner: 'Judy' },
];
