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
export type Tab = 'calendar' | 'moves' | 'settings';

// Body part category for UI display
export type BodyPartCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';

// Mapping from Japanese category names to color keys
export const CATEGORY_COLOR_MAP: Record<string, BodyPartCategory> = {
  '胸': 'chest',
  'Chest': 'chest',
  '背中': 'back',
  'Back': 'back',
  '脚': 'legs',
  'Legs': 'legs',
  '肩': 'shoulders',
  'Shoulders': 'shoulders',
  '腕': 'arms',
  'Arms': 'arms',
  '腹筋': 'core',
  'Core': 'core',
  '有酸素': 'cardio',
  'その他': 'chest', // Default to chest for "other"
};