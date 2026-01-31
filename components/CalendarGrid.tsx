import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BodyPartCategory } from '../types';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onTodayClick: () => void;
  workoutDates: Map<string, BodyPartCategory[]>;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Get date key for map lookup (YYYY-MM-DD format)
export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Body part color mapping
const BODY_PART_COLORS: Record<BodyPartCategory, string> = {
  chest: 'bg-chest',
  back: 'bg-back',
  legs: 'bg-legs',
  shoulders: 'bg-shoulders',
  arms: 'bg-arms',
  core: 'bg-core',
  cardio: 'bg-cardio',
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onTodayClick,
  workoutDates,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get previous month's days to fill the grid
  const prevMonthLastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();

  // Navigate months
  const goToPrevMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    onMonthChange(newDate);
  };

  // Check if two dates are the same day
  const isSameDay = (d1: Date, d2: Date): boolean => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Generate calendar days
  const renderCalendarDays = () => {
    const days: JSX.Element[] = [];

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, day);
      days.push(
        <button
          key={`prev-${day}`}
          onClick={() => onDateSelect(date)}
          className="flex flex-col items-center justify-center h-12 text-slate-600"
        >
          <span className="text-sm">{day}</span>
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateKey = getDateKey(date);
      const isToday = isSameDay(date, today);
      const isSelected = isSameDay(date, selectedDate);
      const workoutCategories = workoutDates.get(dateKey) || [];

      days.push(
        <button
          key={`current-${day}`}
          onClick={() => onDateSelect(date)}
          className="flex flex-col items-center justify-center h-12 relative"
        >
          <span
            className={`
              text-sm w-8 h-8 flex items-center justify-center rounded-full
              ${isToday ? 'bg-coral text-white font-bold' : ''}
              ${isSelected && !isToday ? 'bg-slate-700 text-white' : ''}
              ${!isToday && !isSelected ? 'text-white' : ''}
            `}
          >
            {day}
          </span>
          {/* Workout indicators */}
          {workoutCategories.length > 0 && (
            <div className="flex gap-0.5 mt-0.5 absolute bottom-0">
              {workoutCategories.slice(0, 3).map((category, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${BODY_PART_COLORS[category]}`}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    // Next month days to fill remaining cells (up to 42 cells = 6 rows)
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
      days.push(
        <button
          key={`next-${day}`}
          onClick={() => onDateSelect(date)}
          className="flex flex-col items-center justify-center h-12 text-slate-600"
        >
          <span className="text-sm">{day}</span>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={goToPrevMonth}
            className="p-1 text-slate-400 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 text-slate-400 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          onClick={onTodayClick}
          className="text-coral font-medium hover:opacity-80"
        >
          Today
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm text-slate-500 font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {renderCalendarDays()}
      </div>
    </div>
  );
};
