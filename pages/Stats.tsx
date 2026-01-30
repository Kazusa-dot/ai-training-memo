import React from 'react';
import { useWorkoutStore } from '../store';
import { TrendingUp, Dumbbell, Calendar, Flame, Trophy, Target } from 'lucide-react';

export const Stats = () => {
  const { history } = useWorkoutStore();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500 space-y-4 animate-in fade-in">
        <div className="bg-surfaceHighlight p-6 rounded-full">
          <TrendingUp size={48} className="opacity-20 text-white" />
        </div>
        <p>まだデータがありません。ワークアウトを完了して統計を確認しましょう！</p>
      </div>
    );
  }

  // Calculate statistics
  const totalWorkouts = history.length;

  const totalVolume = history.reduce((acc, workout) =>
    acc + workout.exercises.reduce((eAcc, ex) =>
      eAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0), 0
    ), 0
  );

  const totalSets = history.reduce((acc, workout) =>
    acc + workout.exercises.reduce((eAcc, ex) => eAcc + ex.sets.length, 0), 0
  );

  const totalExercises = history.reduce((acc, workout) =>
    acc + workout.exercises.length, 0
  );

  // Get exercise frequency
  const exerciseCount: Record<string, number> = {};
  history.forEach(workout => {
    workout.exercises.forEach(ex => {
      exerciseCount[ex.name] = (exerciseCount[ex.name] || 0) + 1;
    });
  });

  const topExercises = Object.entries(exerciseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get personal records (max weight for each exercise)
  const personalRecords: Record<string, number> = {};
  history.forEach(workout => {
    workout.exercises.forEach(ex => {
      const maxWeight = Math.max(...ex.sets.map(s => s.weight));
      if (!personalRecords[ex.name] || maxWeight > personalRecords[ex.name]) {
        personalRecords[ex.name] = maxWeight;
      }
    });
  });

  const topPRs = Object.entries(personalRecords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate streak (consecutive days)
  const calculateStreak = () => {
    if (history.length === 0) return 0;

    const sortedDates = history
      .map(w => new Date(w.date).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of sortedDates) {
      const workoutDate = new Date(dateStr);
      const daysDiff = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 1) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Weekly average
  const weeklyAverage = () => {
    if (history.length < 2) return totalWorkouts;
    const firstWorkout = new Date(history[history.length - 1].date);
    const lastWorkout = new Date(history[0].date);
    const weeks = Math.max(1, Math.ceil(
      (lastWorkout.getTime() - firstWorkout.getTime()) / (1000 * 60 * 60 * 24 * 7)
    ));
    return (totalWorkouts / weeks).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-md py-4 z-10 border-b border-slate-800/50">
        <h2 className="text-2xl font-bold text-white pl-1">統計</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Calendar size={20} />}
          label="総ワークアウト数"
          value={totalWorkouts.toString()}
          color="electric"
        />
        <StatCard
          icon={<Flame size={20} />}
          label="連続日数"
          value={`${streak}日`}
          color="warning"
        />
        <StatCard
          icon={<Dumbbell size={20} />}
          label="総ボリューム"
          value={`${(totalVolume / 1000).toFixed(1)}t`}
          color="success"
        />
        <StatCard
          icon={<Target size={20} />}
          label="週平均"
          value={`${weeklyAverage()}回/週`}
          color="secondary"
        />
      </div>

      {/* Summary Stats */}
      <div className="bg-surface rounded-xl border border-slate-800 p-4">
        <h3 className="font-bold text-white mb-3">サマリー</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">総セット数</span>
            <span className="text-white font-mono">{totalSets.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">総種目数</span>
            <span className="text-white font-mono">{totalExercises.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">平均ボリューム/回</span>
            <span className="text-white font-mono">{Math.round(totalVolume / totalWorkouts).toLocaleString()} kg</span>
          </div>
        </div>
      </div>

      {/* Top Exercises */}
      <div className="bg-surface rounded-xl border border-slate-800 p-4">
        <h3 className="font-bold text-white mb-3 flex items-center">
          <Dumbbell size={16} className="mr-2 text-electric" />
          よく行う種目
        </h3>
        <div className="space-y-2">
          {topExercises.map(([name, count], index) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-slate-500 w-6 text-sm">{index + 1}.</span>
                <span className="text-slate-200">{name}</span>
              </div>
              <span className="text-electric font-mono text-sm">{count}回</span>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Records */}
      <div className="bg-surface rounded-xl border border-slate-800 p-4">
        <h3 className="font-bold text-white mb-3 flex items-center">
          <Trophy size={16} className="mr-2 text-warning" />
          自己ベスト
        </h3>
        <div className="space-y-2">
          {topPRs.map(([name, weight], index) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-slate-500 w-6 text-sm">{index + 1}.</span>
                <span className="text-slate-200">{name}</span>
              </div>
              <span className="text-warning font-mono text-sm">{weight} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  color
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'electric' | 'warning' | 'success' | 'secondary';
}) => {
  const colorClasses = {
    electric: 'text-electric bg-electric/10',
    warning: 'text-warning bg-warning/10',
    success: 'text-success bg-success/10',
    secondary: 'text-secondary bg-secondary/10',
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-800 p-4">
      <div className={`inline-flex p-2 rounded-lg mb-2 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
};
