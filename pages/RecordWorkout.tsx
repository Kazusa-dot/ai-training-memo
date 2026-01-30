import React, { useState } from 'react';
import { useWorkoutStore } from '../store';
import { EXERCISE_LIST } from '../constants';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Plus, Trash2, Save, BrainCircuit, X, Search, ChevronDown, Check, MoreVertical } from 'lucide-react';
import { generateWorkoutFeedback } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

export const RecordWorkout = () => {
  const store = useWorkoutStore();
  const navigate = useNavigate();
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('その他');

  // Combine default and custom exercises
  const allExercises = [...EXERCISE_LIST, ...store.customExercises];

  // Group exercises by category for the modal
  const filteredExercises = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categories = Array.from(new Set(filteredExercises.map(ex => ex.category)));

  const categoryOptions = ['胸', '背中', '脚', '肩', '腕', 'その他'];

  const handleAddCustomExercise = () => {
    if (customName.trim()) {
      store.addCustomExercise(customName.trim(), customCategory);
      setCustomName('');
      setShowAddCustom(false);
    }
  };

  const handleStartWorkout = () => {
    store.startWorkout();
  };

  const handleFinish = async () => {
    if (!store.currentWorkout) return;

    // Check if there are exercises with sets
    if (store.currentWorkout.exercises.length === 0) {
      setAnalysisError('終了する前に少なくとも1つの種目を追加してください。');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // 1. Analyze with Gemini
      const feedback = await generateWorkoutFeedback(store.currentWorkout, store.history);

      // 2. Save workout with feedback
      store.finishWorkout(feedback);

      setAnalysisResult(feedback);
    } catch (error) {
      console.error('Error finishing workout:', error);
      // Still save the workout but without AI feedback
      store.finishWorkout('AI分析は利用できませんでした。');
      setAnalysisResult('ワークアウトを保存しました！現在AI分析は利用できません。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeAnalysis = () => {
    setAnalysisResult(null);
    navigate('/history');
  };

  // Helper to find previous record
  const getPreviousRecord = (exerciseName: string) => {
    // Search history for this exercise
    const prevWorkout = store.history.find(w =>
      w.exercises.some(e => e.name === exerciseName)
    );
    if (!prevWorkout) return null;

    const prevExercise = prevWorkout.exercises.find(e => e.name === exerciseName);
    if (!prevExercise) return null;

    // Simple summary: Max weight x sets
    const maxWeight = Math.max(...prevExercise.sets.map(s => s.weight));
    const totalSets = prevExercise.sets.length;
    const totalVol = prevExercise.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);

    return `${maxWeight}kg × ${totalSets}セット (Vol: ${totalVol}kg)`;
  };

  // If no active workout, show start screen
  if (!store.isWorkoutActive || !store.currentWorkout) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-electric blur-[60px] opacity-10 rounded-full"></div>
          <BrainCircuit size={80} className="text-electric relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            AI Muscle Memo
          </h1>
          <p className="text-slate-400">素早く記録。AIと共に成長。</p>
        </div>

        <div className="bg-surface border border-slate-800 p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-xl">
           <div className="text-4xl">💡</div>
           <div>
             <h3 className="font-semibold text-white">トレーニングの準備はOK？</h3>
             <p className="text-sm text-slate-400 mt-1">今日のセッションを記録しましょう。</p>
           </div>
           <Button size="lg" onClick={handleStartWorkout} className="w-full shadow-lg shadow-electric/20">
            ワークアウトを開始
          </Button>
        </div>
      </div>
    );
  }

  // Active workout view
  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur-md py-4 z-40 border-b border-slate-800/50">
        <div>
          <h2 className="text-xl font-bold text-white">
            {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
          </h2>
        </div>
        <Button variant="ghost" size="sm" onClick={store.cancelWorkout} className="text-slate-500 hover:text-error">
          キャンセル
        </Button>
      </div>

      <div className="space-y-6">
        {/* Empty state - show prominent add button when no exercises */}
        {store.currentWorkout.exercises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-4">🏋️</div>
              <h3 className="text-lg font-semibold text-white">さあ、始めましょう！</h3>
              <p className="text-sm text-slate-400">最初の種目を追加して記録を開始しましょう。</p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="shadow-lg shadow-electric/25"
              onClick={() => setShowExerciseModal(true)}
            >
              <Plus size={20} className="mr-2" /> 種目を追加
            </Button>
          </div>
        )}

        {store.currentWorkout.exercises.map((exercise) => {
          const prevRecord = getPreviousRecord(exercise.name);
          return (
            <div key={exercise.id} className="bg-surface rounded-xl p-0 border border-slate-800 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="p-4 flex justify-between items-start border-b border-slate-800/50 bg-surfaceHighlight/30">
                <div>
                  <h3 className="font-bold text-lg text-electric">{exercise.name}</h3>
                  {prevRecord && (
                     <p className="text-xs text-slate-500 mt-1 flex items-center">
                       <span className="mr-1">📝</span> 前回: {prevRecord}
                     </p>
                  )}
                </div>
                <button
                  onClick={() => store.removeExercise(exercise.id)}
                  className="text-slate-600 hover:text-error p-1 rounded transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Sets Table */}
              <div className="p-4 space-y-3">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 font-semibold text-center mb-2">
                  <div className="col-span-2">セット</div>
                  <div className="col-span-4">kg</div>
                  <div className="col-span-4">回数</div>
                  <div className="col-span-2">✔</div>
                </div>

                {exercise.sets.map((set, index) => (
                  <div key={set.id} className={`grid grid-cols-12 gap-2 items-center transition-opacity ${set.completed ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Set Number */}
                    <div className="col-span-2 flex justify-center">
                      <div className="w-6 h-6 rounded bg-slate-800/50 text-slate-400 flex items-center justify-center text-xs font-mono">
                        {index + 1}
                      </div>
                    </div>

                    {/* Weight Input */}
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0 && value <= 9999) {
                            store.updateSet(exercise.id, set.id, 'weight', value);
                          } else if (e.target.value === '') {
                            store.updateSet(exercise.id, set.id, 'weight', 0);
                          }
                        }}
                        min="0"
                        max="9999"
                        step="0.5"
                        className="w-full bg-surfaceHighlight border border-slate-700/50 rounded-lg py-3 text-center text-lg font-mono text-white focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-all placeholder-slate-600"
                        placeholder="0"
                      />
                    </div>

                    {/* Reps Input */}
                    <div className="col-span-4">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0 && value <= 999) {
                            store.updateSet(exercise.id, set.id, 'reps', value);
                          } else if (e.target.value === '') {
                            store.updateSet(exercise.id, set.id, 'reps', 0);
                          }
                        }}
                        min="0"
                        max="999"
                        step="1"
                        className="w-full bg-surfaceHighlight border border-slate-700/50 rounded-lg py-3 text-center text-lg font-mono text-white focus:border-electric focus:ring-1 focus:ring-electric outline-none transition-all placeholder-slate-600"
                        placeholder="0"
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="col-span-2 flex justify-center">
                       <Checkbox
                        checked={set.completed}
                        onChange={() => store.toggleSetComplete(exercise.id, set.id)}
                       />
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-electric hover:bg-electric/10 border border-dashed border-electric/30 h-10"
                  onClick={() => store.addSet(exercise.id)}
                >
                  <Plus size={16} className="mr-2" /> セットを追加
                </Button>
              </div>
            </div>
          );
        })}

        <Button
          variant="outline"
          className="w-full h-14 border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-surfaceHighlight transition-all"
          onClick={() => setShowExerciseModal(true)}
        >
          <Plus size={20} className="mr-2" /> 種目を追加
        </Button>
      </div>

      {/* Error Message */}
      {analysisError && (
        <div className="fixed bottom-40 left-4 right-4 bg-error/20 border border-error rounded-lg p-3 text-center z-50 animate-in fade-in">
          <p className="text-error text-sm">{analysisError}</p>
          <button
            onClick={() => setAnalysisError(null)}
            className="text-slate-400 text-xs mt-1 underline"
          >
            閉じる
          </button>
        </div>
      )}

      {/* Footer Actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
        <div className="max-w-md mx-auto flex flex-col gap-2">
          {store.currentWorkout.exercises.length > 0 && (
            <Button
              variant="secondary"
              className="w-full h-12 rounded-xl"
              onClick={() => setShowExerciseModal(true)}
            >
              <Plus size={20} className="mr-2" /> 種目を追加
            </Button>
          )}
          <Button
            variant="primary"
            className="w-full h-12 shadow-lg shadow-electric/25 rounded-xl text-base font-bold"
            onClick={() => setShowFinishConfirm(true)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <BrainCircuit className="animate-pulse mr-2" /> 分析中...
              </span>
            ) : (
               <span className="flex items-center justify-center">
                <Check className="mr-2" strokeWidth={3} size={18} /> ワークアウトを終了
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col border-t sm:border border-slate-700 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">種目を選択</h3>
              <button onClick={() => setShowExerciseModal(false)} className="text-slate-400 hover:text-white bg-slate-800 rounded-full p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="検索..."
                  className="w-full bg-surfaceHighlight border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-electric transition-colors text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Custom exercise add section */}
              {!showAddCustom ? (
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-electric hover:bg-electric/10 rounded-xl border border-dashed border-electric/30 transition-colors"
                >
                  <Plus size={18} />
                  <span>新しい種目を追加</span>
                </button>
              ) : (
                <div className="bg-surfaceHighlight rounded-xl p-4 space-y-3 border border-slate-700">
                  <input
                    type="text"
                    placeholder="種目名を入力..."
                    className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-electric transition-colors text-white"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    autoFocus
                  />
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-electric transition-colors text-white"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setShowAddCustom(false);
                        setCustomName('');
                      }}
                    >
                      キャンセル
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={handleAddCustomExercise}
                      disabled={!customName.trim()}
                    >
                      追加
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-y-auto flex-1 p-0">
              {categories.map(category => {
                const categoryExercises = filteredExercises.filter(e => e.category === category);
                if (categoryExercises.length === 0) return null;

                return (
                  <div key={category} className="mb-2">
                    <div className="px-4 py-2 bg-surfaceHighlight/50 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-sm">
                      {category}
                    </div>
                    {categoryExercises.map(ex => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          store.addExercise(ex);
                          setShowExerciseModal(false);
                          setSearchTerm('');
                        }}
                        className="w-full text-left px-4 py-4 hover:bg-slate-800/50 border-b border-slate-800/50 flex justify-between items-center group active:bg-slate-800"
                      >
                        <span className="font-medium text-slate-200">{ex.name}</span>
                        <Plus size={18} className="text-electric opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Finish Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🏁</div>
              <h3 className="font-bold text-lg text-white">ワークアウトを終了しますか？</h3>
              <p className="text-sm text-slate-400">終了するとAIが今日のトレーニングを分析します。</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="primary"
                className="w-full h-12 rounded-xl"
                onClick={() => {
                  setShowFinishConfirm(false);
                  handleFinish();
                }}
              >
                終了する
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl text-slate-400"
                onClick={() => setShowFinishConfirm(false)}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result Modal */}
      {analysisResult && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-md flex flex-col space-y-6 relative">
            <div className="text-center space-y-2 mb-4">
              <h2 className="text-2xl font-bold text-white">分析結果</h2>
              <p className="text-slate-400">お疲れ様でした！フィードバックです。</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-6 border border-electric">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric/20 to-secondary/10 z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 text-electric mb-4">
                  <div className="bg-electric/20 p-2 rounded-lg">
                    <BrainCircuit size={24} />
                  </div>
                  <h3 className="font-bold text-lg">AIパーソナルトレーナー</h3>
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-slate-100 leading-relaxed">
                  <p className="whitespace-pre-line">{analysisResult}</p>
                </div>
              </div>
            </div>

            <Button size="lg" onClick={closeAnalysis} className="w-full shadow-lg shadow-electric/20">
              ホームに戻る
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
