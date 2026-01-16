// backend/db.ts
import { Worker, Job, Skill } from './types';

// In-memory mock data
let workers: Worker[] = [];
let jobs: Job[] = [
  { id: "1", title: "House Wiring", requiredSkills: ["Electrical Wiring"] },
  { id: "2", title: "Switch Installation", requiredSkills: ["Switch Repair"] },
];

// Functions to interact with workers
export function addWorker(worker: Worker) {
  workers.push(worker);
  return worker;
}

export function getWorkerById(id: string): Worker | undefined {
  return workers.find(w => w.id === id);
}

// Functions to interact with jobs
export function getAllJobs(): Job[] {
  return jobs;
}

// Optional: function to match worker skills to jobs
export function matchJobsForWorker(worker: Worker): Job[] {
  return jobs.filter(job =>
    job.requiredSkills.every(rs =>
      worker.skills.some(s => s.name === rs)
    )
  );
}
