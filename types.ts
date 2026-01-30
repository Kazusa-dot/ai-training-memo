export type BodyPart = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';

export interface Exercise {
  id: string;
  name: string;
  category: BodyPart;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string; // Unique instance ID for the workout
  exerciseId: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  exercises: WorkoutExercise[];
  aiFeedback?: string;
  durationMinutes?: number;
}

// Navigation types
export type Tab = 'record' | 'history' | 'stats';