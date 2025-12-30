const fs = require('fs');
const path = require('path');

const tasks = [];
const phases = ['Planning', 'Requirement Analysis', 'Design', 'Prototyping', 'Development', 'Testing', 'Deployment', 'Maintenance'];
const owners = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];

const PROJECT_START_DATE = new Date('2025-04-01');
const PROJECT_END_DATE = new Date('2026-03-30');
const MAX_DAYS = Math.ceil((PROJECT_END_DATE - PROJECT_START_DATE) / (1000 * 60 * 60 * 24));

let currentDayOffset = 0;

for (let i = 1; i <= 100000; i++) {
    // Random duration: mostly short (1-10 days), some long (30-90 days)
    let duration;
    if (Math.random() > 0.9) {
        // 10% chance of a long task (1-3 months)
        duration = Math.floor(Math.random() * 60) + 30;
    } else {
        duration = Math.floor(Math.random() * 10) + 1;
    }

    // Start day logic: mostly sequential but with some parallelism
    // Occasionally jump back or stay same to simulate parallel tracks
    if (Math.random() > 0.7) {
        // Parallel task, start slightly back or same time
        const backStep = Math.floor(Math.random() * 5);
        currentDayOffset = Math.max(0, currentDayOffset - backStep);
    } else {
        // Sequential, move forward
        const forwardStep = Math.floor(Math.random() * 3); // 0 to 2 days gap
        currentDayOffset += forwardStep;
    }

    // Ensure we don't go past the end date too much, although 1000 tasks might naturally exceed.
    // If we want to strictly fit 1000 tasks in 365 days, we need high parallelism.
    // Let's constrain the startDay to be within range randomly to fill the year.
    // Actually, a purely random spread might be better for "realistic" large data filling a year.

    // Alternative approach: Random distribution over the year
    const startDay = Math.floor(Math.random() * (MAX_DAYS - duration));

    // Calculate actual dates
    const startDateObj = new Date(PROJECT_START_DATE);
    startDateObj.setDate(startDateObj.getDate() + startDay);

    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(endDateObj.getDate() + duration);

    const phase = phases[i % phases.length];

    // Dependencies
    const dependencies = [];
    if (i > 5 && Math.random() > 0.8) {
        // Pick a random previous task
        const randomPrev = Math.floor(Math.random() * (i - 1)) + 1;
        dependencies.push(String(randomPrev));
    }

    tasks.push({
        id: String(i),
        name: `${phase} - Task ${i}`,
        startDay: startDay,
        duration: duration,
        startDate: startDateObj.toISOString().split('T')[0],
        endDate: endDateObj.toISOString().split('T')[0],
        status: Math.random() > 0.7 ? 'in-progress' : (Math.random() > 0.4 ? 'done' : 'todo'),
        owner: owners[i % owners.length],
        dependencies: dependencies.length > 0 ? dependencies : undefined,
        category: phase
    });
}

// Sort by startDay to make Gantt look reasonable
tasks.sort((a, b) => a.startDay - b.startDay);

const outputPath = path.join(__dirname, 'src', 'data', 'tasks.json');
fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
console.log(`Generated ${tasks.length} tasks to ${outputPath}`);
