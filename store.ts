import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkoutSession, WorkoutExercise, Exercise, WorkoutSet } from './types';
import { v4 as uuidv4 } from 'uuid';

interface WorkoutState {
  // Current active workout
  currentWorkout: WorkoutSession | null;
  isWorkoutActive: boolean;
  
  // History
  history: WorkoutSession[];

  // Actions
  startWorkout: () => void;
  addExercise: (exercise: Exercise) => void;
  addSet: (exerciseInstanceId: string) => void;
  updateSet: (exerciseInstanceId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
  toggleSetComplete: (exerciseInstanceId: string, setId: string) => void;
  removeSet: (exerciseInstanceId: string, setId: string) => void;
  removeExercise: (exerciseInstanceId: string) => void;
  finishWorkout: (aiFeedback?: string) => void;
  cancelWorkout: () => void;
  deleteHistoryItem: (sessionId: string) => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentWorkout: null,
      isWorkoutActive: false,
      history: [],

      startWorkout: () => {
        set({
          isWorkoutActive: true,
          currentWorkout: {
            id: uuidv4(),
            date: new Date().toISOString(),
            exercises: [],
          },
        });
      },

      addExercise: (exercise) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newExercise: WorkoutExercise = {
          id: uuidv4(),
          exerciseId: exercise.id,
          name: exercise.name,
          sets: [
            { id: uuidv4(), weight: 20, reps: 10, completed: false }
          ],
        };

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: [...currentWorkout.exercises, newExercise],
          },
        });
      },

      addSet: (exerciseInstanceId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newExercises = currentWorkout.exercises.map((ex) => {
          if (ex.id === exerciseInstanceId) {
            const lastSet = ex.sets[ex.sets.length - 1];
            return {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: uuidv4(),
                  weight: lastSet ? lastSet.weight : 20,
                  reps: lastSet ? lastSet.reps : 10,
                  completed: false,
                },
              ],
            };
          }
          return ex;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: newExercises,
          },
        });
      },

      updateSet: (exerciseInstanceId, setId, field, value) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newExercises = currentWorkout.exercises.map((ex) => {
          if (ex.id === exerciseInstanceId) {
            return {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, [field]: value } : s
              ),
            };
          }
          return ex;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: newExercises,
          },
        });
      },

      toggleSetComplete: (exerciseInstanceId, setId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newExercises = currentWorkout.exercises.map((ex) => {
          if (ex.id === exerciseInstanceId) {
            return {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            };
          }
          return ex;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: newExercises,
          },
        });
      },

      removeSet: (exerciseInstanceId, setId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const newExercises = currentWorkout.exercises.map((ex) => {
          if (ex.id === exerciseInstanceId) {
            return {
              ...ex,
              sets: ex.sets.filter((s) => s.id !== setId),
            };
          }
          return ex;
        });

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: newExercises,
          },
        });
      },

      removeExercise: (exerciseInstanceId) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: currentWorkout.exercises.filter((ex) => ex.id !== exerciseInstanceId),
          },
        });
      },

      finishWorkout: (aiFeedback) => {
        const { currentWorkout, history } = get();
        if (!currentWorkout) return;

        const completedWorkout: WorkoutSession = {
          ...currentWorkout,
          date: new Date().toISOString(),
          aiFeedback: aiFeedback,
        };

        set({
          history: [completedWorkout, ...history],
          currentWorkout: null,
          isWorkoutActive: false,
        });
      },

      cancelWorkout: () => {
        set({
          currentWorkout: null,
          isWorkoutActive: false,
        });
      },

      deleteHistoryItem: (sessionId) => {
        const { history } = get();
        set({
          history: history.filter(h => h.id !== sessionId)
        });
      }
    }),
    {
      name: 'workout-storage',
    }
  )
);