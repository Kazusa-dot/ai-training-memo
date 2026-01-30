import React, { useState } from 'react';
import { useWorkoutStore } from '../store';
import { Calendar, ChevronRight, Dumbbell, X } from 'lucide-react';

export const History = () => {
  const { history } = useWorkoutStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredHistory = history.filter(workout => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    // Search in exercise names
    const matchesExercise = workout.exercises.some(ex =>
      ex.name.toLowerCase().includes(term)
    );
    // Search in date
    const matchesDate = new Date(workout.date)
      .toLocaleDateString()
      .toLowerCase()
      .includes(term);
    // Search in AI feedback
    const matchesFeedback = workout.aiFeedback?.toLowerCase().includes(term);

    return matchesExercise || matchesDate || matchesFeedback;
  });

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500 space-y-4 animate-in fade-in">
        <div className="bg-surfaceHighlight p-6 rounded-full">
           <Calendar size={48} className="opacity-20 text-white" />
        </div>
        <p>まだワークアウトの記録がありません。</p>
      </div>
    );
  }

  // Simple grouping (Enhancement: Could group by week/month clearly)
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-md py-4 z-10 border-b border-slate-800/50">
         {isSearchOpen ? (
           <div className="flex-1 flex items-center gap-2">
             <input
               type="text"
               placeholder="種目、日付を検索..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               autoFocus
               className="flex-1 bg-surfaceHighlight border border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-electric transition-colors text-white text-sm"
             />
             <button
               onClick={() => {
                 setIsSearchOpen(false);
                 setSearchTerm('');
               }}
               className="text-slate-400 hover:text-white p-2"
             >
               <X size={20} />
             </button>
           </div>
         ) : (
           <>
             <h2 className="text-2xl font-bold text-white pl-1">履歴</h2>
             <button
               onClick={() => setIsSearchOpen(true)}
               className="text-slate-500 hover:text-white pr-1 transition-colors"
             >
               <SearchIcon size={20} />
             </button>
           </>
         )}
      </div>

      {/* No results message */}
      {filteredHistory.length === 0 && searchTerm && (
        <div className="text-center py-12 text-slate-500">
          <p>「{searchTerm}」に一致する記録が見つかりませんでした</p>
        </div>
      )}

      <div className="space-y-4">
        {filteredHistory.map((workout) => {
          const workoutDate = new Date(workout.date);
          const totalVolume = workout.exercises.reduce((acc, ex) =>
            acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0), 0
          );
          const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

          return (
            <div key={workout.id} className="bg-surface rounded-xl border border-slate-800 p-0 shadow-sm overflow-hidden active:scale-[0.99] transition-transform">
              {/* Card Main Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-surfaceHighlight p-3 rounded-xl text-electric border border-slate-700/50">
                       <span className="font-bold text-lg">{workoutDate.getDate()}</span>
                       <span className="text-xs block uppercase -mt-1">{workoutDate.toLocaleDateString('ja-JP', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">
                        {workoutDate.toLocaleDateString('ja-JP', { weekday: 'long' })}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {workout.exercises.map(e => e.name).slice(0, 2).join(", ")}
                        {workout.exercises.length > 2 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{totalVolume.toLocaleString()} <span className="text-xs font-normal text-slate-500">kg</span></div>
                    <div className="text-xs text-slate-500">{totalSets} セット</div>
                  </div>
                </div>

                {/* AI Summary Snippet */}
                {workout.aiFeedback && (
                  <div className="mt-3 bg-gradient-to-r from-electric/10 to-transparent rounded-lg p-3 border-l-2 border-electric">
                    <p className="text-xs text-slate-300 line-clamp-2">
                      <span className="mr-1">🤖</span> {workout.aiFeedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SearchIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
