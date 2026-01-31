import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { CalendarGrid, getDateKey } from '../components/CalendarGrid';
import { useWorkoutStore } from '../store';
import { BodyPartCategory, CATEGORY_COLOR_MAP, WorkoutSession, WorkoutExercise } from '../types';

// Body part color mapping for Tailwind classes
const BODY_PART_BG_COLORS: Record<BodyPartCategory, string> = {
  chest: 'bg-chest',
  back: 'bg-back',
  legs: 'bg-legs',
  shoulders: 'bg-shoulders',
  arms: 'bg-arms',
  core: 'bg-core',
  cardio: 'bg-cardio',
};

// Get greeting based on time of day
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning!';
  if (hour < 18) return 'Good Afternoon!';
  return 'Good Evening!';
};

// Calculate total volume for sets
const calculateVolume = (exercise: WorkoutExercise): number => {
  return exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
};

// Format volume with commas
const formatVolume = (volume: number): string => {
  return volume.toLocaleString();
};

// Get category from exercise name (lookup from EXERCISE_LIST or custom)
const getCategoryForExercise = (exerciseName: string, history: WorkoutSession[]): BodyPartCategory => {
  // Try to find the category from history or default mappings
  // For now, we'll use a simple mapping based on common exercise names
  const lowerName = exerciseName.toLowerCase();

  if (lowerName.includes('bench') || lowerName.includes('ベンチ') || lowerName.includes('胸') ||
      lowerName.includes('dip') || lowerName.includes('ディップ') || lowerName.includes('fly') ||
      lowerName.includes('chest') || lowerName.includes('push')) {
    return 'chest';
  }
  if (lowerName.includes('row') || lowerName.includes('pull') || lowerName.includes('lat') ||
      lowerName.includes('dead') || lowerName.includes('背中') || lowerName.includes('懸垂')) {
    return 'back';
  }
  if (lowerName.includes('squat') || lowerName.includes('leg') || lowerName.includes('脚') ||
      lowerName.includes('スクワット') || lowerName.includes('calf')) {
    return 'legs';
  }
  if (lowerName.includes('shoulder') || lowerName.includes('press') || lowerName.includes('肩') ||
      lowerName.includes('オーバーヘッド') || lowerName.includes('lateral')) {
    return 'shoulders';
  }
  if (lowerName.includes('curl') || lowerName.includes('tricep') || lowerName.includes('腕') ||
      lowerName.includes('bicep') || lowerName.includes('カール')) {
    return 'arms';
  }
  if (lowerName.includes('ab') || lowerName.includes('core') || lowerName.includes('腹') ||
      lowerName.includes('crunch') || lowerName.includes('plank')) {
    return 'core';
  }
  if (lowerName.includes('cardio') || lowerName.includes('run') || lowerName.includes('有酸素') ||
      lowerName.includes('bike') || lowerName.includes('treadmill')) {
    return 'cardio';
  }

  return 'chest'; // Default
};

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { history } = useWorkoutStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Build workout dates map from history
  const workoutDates = useMemo(() => {
    const map = new Map<string, BodyPartCategory[]>();

    history.forEach((session) => {
      const sessionDate = new Date(session.date);
      const dateKey = getDateKey(sessionDate);

      // Get unique categories from this session's exercises
      const categories = new Set<BodyPartCategory>();
      session.exercises.forEach((exercise) => {
        const category = getCategoryForExercise(exercise.name, history);
        categories.add(category);
      });

      const existingCategories = map.get(dateKey) || [];
      const allCategories = [...new Set([...existingCategories, ...Array.from(categories)])];
      map.set(dateKey, allCategories);
    });

    return map;
  }, [history]);

  // Get workouts for selected date
  const selectedDateWorkouts = useMemo(() => {
    const dateKey = getDateKey(selectedDate);
    return history.filter((session) => {
      const sessionDate = new Date(session.date);
      return getDateKey(sessionDate) === dateKey;
    });
  }, [history, selectedDate]);

  // Group exercises by category for summary
  const workoutSummary = useMemo(() => {
    const summary = new Map<BodyPartCategory, { sets: number; volume: number }>();

    selectedDateWorkouts.forEach((session) => {
      session.exercises.forEach((exercise) => {
        const category = getCategoryForExercise(exercise.name, history);
        const current = summary.get(category) || { sets: 0, volume: 0 };
        current.sets += exercise.sets.length;
        current.volume += calculateVolume(exercise);
        summary.set(category, current);
      });
    });

    return summary;
  }, [selectedDateWorkouts, history]);

  // All exercises for selected date
  const allExercises = useMemo(() => {
    const exercises: Array<{ name: string; category: BodyPartCategory; sets: number; volume: number }> = [];

    selectedDateWorkouts.forEach((session) => {
      session.exercises.forEach((exercise) => {
        const category = getCategoryForExercise(exercise.name, history);
        exercises.push({
          name: exercise.name,
          category,
          sets: exercise.sets.length,
          volume: calculateVolume(exercise),
        });
      });
    });

    return exercises;
  }, [selectedDateWorkouts, history]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // If selecting a date in a different month, update current month
    if (date.getMonth() !== currentMonth.getMonth() || date.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  // Handle today button
  const handleTodayClick = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Format date for display (e.g., "1月28日")
  const formatDateJapanese = (date: Date): string => {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // Category display name mapping
  const categoryDisplayNames: Record<BodyPartCategory, string> = {
    chest: '胸',
    back: '背中',
    legs: '脚',
    shoulders: '肩',
    arms: '腕',
    core: '腹筋',
    cardio: '有酸素',
  };

  const hasWorkouts = selectedDateWorkouts.length > 0;

  return (
    <div className="space-y-6">
      {/* Calendar Grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onMonthChange={setCurrentMonth}
        onTodayClick={handleTodayClick}
        workoutDates={workoutDates}
      />

      {/* Content Area */}
      {hasWorkouts ? (
        <div className="space-y-4">
          {/* Training Summary Card */}
          <div className="bg-cardBg rounded-xl p-4">
            <h3 className="text-white font-bold mb-2">
              {formatDateJapanese(selectedDate)}のトレーニングまとめ
            </h3>
            <div className="space-y-1">
              {Array.from(workoutSummary.entries()).map(([category, data]) => (
                <p key={category} className="text-sm">
                  <span className="text-coral font-medium">
                    {categoryDisplayNames[category]}:
                  </span>
                  <span className="text-slate-300 ml-2">
                    {data.sets}セット（ボリューム：{formatVolume(data.volume)}kg）
                  </span>
                </p>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-2">
              β運用中：有料プラン開始後に限定表示となります。
            </p>
          </div>

          {/* Exercise List */}
          <div className="space-y-2">
            {allExercises.map((exercise, index) => (
              <div
                key={index}
                className="flex items-center bg-surface rounded-lg p-3"
              >
                <div
                  className={`w-1 h-12 rounded-full mr-3 ${BODY_PART_BG_COLORS[exercise.category]}`}
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{exercise.name}</p>
                  <p className="text-slate-400 text-sm">
                    {exercise.sets} sets（Total volume: {formatVolume(exercise.volume)}kg）
                  </p>
                </div>
                <ChevronRight className="text-slate-500" size={20} />
              </div>
            ))}
          </div>

          {/* Add Menu Button */}
          <button
            onClick={() => navigate('/record')}
            className="flex items-center gap-2 text-coral py-2"
          >
            <div className="w-8 h-8 bg-coral/20 rounded-lg flex items-center justify-center">
              <Plus className="text-coral" size={20} />
            </div>
            <span className="font-medium">Add Menu</span>
          </button>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-white mb-2">
            {getGreeting()}
          </h3>
          <p className="text-slate-400 mb-6">
            Let's do your best to train today!
          </p>
          <button
            onClick={() => navigate('/record')}
            className="bg-coral text-white font-medium px-8 py-3 rounded-xl hover:bg-coral/90 transition-colors"
          >
            Add today's menu
          </button>
        </div>
      )}
    </div>
  );
};
