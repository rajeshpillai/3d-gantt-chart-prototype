export interface Stage {
    id: string;
    name: string;
    position: [number, number, number];
    color: string;
}

export interface Deal {
    id: string;
    name: string;
    company: string;
    value: number;
    stageId: string;
    probability: number;
    owner: string;
}

export const STAGES: Stage[] = [
    { id: 'lead', name: 'Lead', position: [0, 0, 0], color: '#00d4ff' },
    { id: 'qualified', name: 'Qualified', position: [10, 0, 0], color: '#00ff88' },
    { id: 'proposal', name: 'Proposal', position: [20, 0, 0], color: '#ffaa00' },
    { id: 'negotiation', name: 'Negotiation', position: [30, 0, 0], color: '#ff0055' },
    { id: 'closed', name: 'Closed', position: [40, 0, 0], color: '#ffffff' },
];

export const DEALS: Deal[] = [
    { id: '1', name: 'Cloud Migration', company: 'TechCorp', value: 50000, stageId: 'lead', probability: 0.1, owner: 'Alice' },
    { id: '2', name: 'Security Audit', company: 'SecureNet', value: 25000, stageId: 'qualified', probability: 0.3, owner: 'Bob' },
    { id: '3', name: 'AI Integration', company: 'InnovateAI', value: 100000, stageId: 'proposal', probability: 0.6, owner: 'Alice' },
    { id: '4', name: 'ERP Implementation', company: 'GlobalBiz', value: 150000, stageId: 'negotiation', probability: 0.8, owner: 'Charlie' },
    { id: '5', name: 'Data Analytics', company: 'DataGen', value: 45000, stageId: 'closed', probability: 1.0, owner: 'Bob' },
    { id: '6', name: 'Mobile App', company: 'AppWorks', value: 30000, stageId: 'qualified', probability: 0.2, owner: 'Alice' },
    { id: '7', name: 'Infrastructure', company: 'BaseLayer', value: 75000, stageId: 'proposal', probability: 0.5, owner: 'Charlie' },
];
