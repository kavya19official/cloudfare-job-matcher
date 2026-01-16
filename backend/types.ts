// backend/types.ts

export interface Skill {
    name: string;
    confidence: number;
  }
  
  export interface Worker {
    id: string;
    name: string;
    skills: Skill[];
  }
  
  export interface Job {
    id: string;
    title: string;
    requiredSkills: string[];
  }
  