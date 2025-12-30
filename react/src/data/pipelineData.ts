export type DealSource = 'india-mart' | 'web' | 'internal';

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
    source: DealSource;
}

export const STAGES: Stage[] = [
    { id: 'lead', name: 'Lead', position: [0, 0, 0], color: '#00d4ff' },
    { id: 'qualified', name: 'Qualified', position: [10, 0, 0], color: '#00ff88' },
    { id: 'proposal', name: 'Proposal', position: [20, 0, 0], color: '#ffaa00' },
    { id: 'negotiation', name: 'Negotiation', position: [30, 0, 0], color: '#ff0055' },
    { id: 'closed', name: 'Closed', position: [40, 0, 0], color: '#ffffff' },
];

const SOURCES: DealSource[] = ['india-mart', 'web', 'internal'];
const STAGE_IDS = STAGES.map(s => s.id);
const COMPANIES = ['TechCorp', 'SecureNet', 'InnovateAI', 'GlobalBiz', 'DataGen', 'AppWorks', 'BaseLayer', 'CloudSoft', 'NexusSystems', 'QuantumSolutions'];
const OWNERS = ['Alice', 'Bob', 'Charlie', 'Dana'];

// Generate 250 deals
const generateDeals = (count: number): Deal[] => {
    const deals: Deal[] = [];
    for (let i = 1; i <= count; i++) {
        // Biased distribution: more leads, fewer closed deals
        const stageChance = Math.random();
        let stageId = 'lead';
        if (stageChance > 0.4) stageId = 'qualified';
        if (stageChance > 0.7) stageId = 'proposal';
        if (stageChance > 0.85) stageId = 'negotiation';
        if (stageChance > 0.95) stageId = 'closed';

        deals.push({
            id: i.toString(),
            name: `Project ${String.fromCharCode(65 + (i % 26))}${i}`,
            company: COMPANIES[i % COMPANIES.length],
            value: Math.floor(Math.random() * 100000) + 10000,
            stageId: stageId,
            probability: stageId === 'closed' ? 1.0 : stageId === 'negotiation' ? 0.8 : stageId === 'proposal' ? 0.6 : stageId === 'qualified' ? 0.3 : 0.1,
            owner: OWNERS[i % OWNERS.length],
            source: SOURCES[i % SOURCES.length]
        });
    }
    return deals;
};

export const DEALS: Deal[] = generateDeals(250);
