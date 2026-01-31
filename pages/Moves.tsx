import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { EXERCISE_LIST } from '../constants';
import { useWorkoutStore } from '../store';
import { BodyPartCategory } from '../types';

// Body part color mapping
const BODY_PART_BG_COLORS: Record<BodyPartCategory, string> = {
  chest: 'bg-chest',
  back: 'bg-back',
  legs: 'bg-legs',
  shoulders: 'bg-shoulders',
  arms: 'bg-arms',
  core: 'bg-core',
  cardio: 'bg-cardio',
};

// Category tabs
const CATEGORIES = [
  { id: 'chest', label: 'Chest', japanese: '胸' },
  { id: 'shoulders', label: 'Sho...', japanese: '肩' },
  { id: 'arms', label: 'Arm', japanese: '腕' },
  { id: 'back', label: 'Back', japanese: '背中' },
  { id: 'legs', label: 'Leg', japanese: '脚' },
  { id: 'core', label: 'Abs', japanese: '腹筋' },
  { id: 'cardio', label: 'Aero', japanese: '有酸素' },
] as const;

// Map Japanese category names to category IDs
const CATEGORY_MAP: Record<string, BodyPartCategory> = {
  '胸': 'chest',
  '背中': 'back',
  '脚': 'legs',
  '肩': 'shoulders',
  '腕': 'arms',
  '腹筋': 'core',
  '有酸素': 'cardio',
  'その他': 'chest',
};

export const Moves: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BodyPartCategory>('chest');
  const { customExercises } = useWorkoutStore();

  // Filter exercises by category
  const filteredExercises = [
    ...EXERCISE_LIST.filter((ex) => {
      const category = CATEGORY_MAP[ex.category as string];
      return category === selectedCategory;
    }),
    ...customExercises.filter((ex) => {
      const category = CATEGORY_MAP[ex.category as string];
      return category === selectedCategory;
    }),
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Moves</h1>
        <button className="text-coral">
          <Plus size={28} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as BodyPartCategory)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${selectedCategory === category.id
                ? 'bg-white text-black'
                : 'bg-surface text-slate-400 hover:text-white'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Exercise List */}
      <div className="space-y-1">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center py-3 border-b border-slate-800"
            >
              <div
                className={`w-1 h-6 rounded-full mr-3 ${BODY_PART_BG_COLORS[selectedCategory]}`}
              />
              <span className="text-white">{exercise.name}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500">この部位の種目はまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
};
