import React, { useState } from 'react';
import { useWorkoutStore } from '../store';
import { EXERCISE_LIST } from '../constants';
import { Plus, Minus, ChevronLeft, MoreHorizontal, X, Search, Check, BrainCircuit } from 'lucide-react';
import { generateWorkoutFeedback } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { WorkoutExercise } from '../types';

// Calculate volume for an exercise
const calculateExerciseVolume = (exercise: WorkoutExercise): number => {
  return exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
};

// Format volume with commas
const formatVolume = (volume: number): string => {
  return volume.toLocaleString();
};

// Get recent volumes for an exercise from history
const getRecentVolumes = (exerciseName: string, history: any[]): number[] => {
  const volumes: number[] = [];

  // Get last 5 workouts that contain this exercise
  for (const workout of history) {
    const exercise = workout.exercises.find((e: WorkoutExercise) => e.name === exerciseName);
    if (exercise) {
      const vol = exercise.sets.reduce((sum: number, s: any) => sum + (s.weight * s.reps), 0);
      volumes.push(vol);
      if (volumes.length >= 5) break;
    }
  }

  return volumes.reverse(); // Most recent last
};

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
  const [selectedTab, setSelectedTab] = useState<string>('Chest');

  // Combine default and custom exercises
  const allExercises = [...EXERCISE_LIST, ...store.customExercises];

  // Category tabs
  const categoryTabs = [
    { id: 'Chest', label: 'Chest', japanese: '胸' },
    { id: 'Shoulders', label: 'Sho...', japanese: '肩' },
    { id: 'Arms', label: 'Arm', japanese: '腕' },
    { id: 'Back', label: 'Back', japanese: '背中' },
    { id: 'Legs', label: 'Leg', japanese: '脚' },
    { id: 'Core', label: 'Abs', japanese: '腹筋' },
  ];

  // Map Japanese categories to English for filtering
  const categoryMap: Record<string, string> = {
    '胸': 'Chest',
    '肩': 'Shoulders',
    '腕': 'Arms',
    '背中': 'Back',
    '脚': 'Legs',
    '腹筋': 'Core',
    'その他': 'Other',
  };

  // Filter exercises by search and category
  const filteredExercises = allExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const exCategory = categoryMap[ex.category as string] || 'Other';
    const matchesCategory = selectedTab === 'Other' ? true : exCategory === selectedTab;
    return matchesSearch && matchesCategory;
  });

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

    if (store.currentWorkout.exercises.length === 0) {
      setAnalysisError('終了する前に少なくとも1つの種目を追加してください。');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const feedback = await generateWorkoutFeedback(store.currentWorkout, store.history);
      store.finishWorkout(feedback);
      setAnalysisResult(feedback);
    } catch (error) {
      console.error('Error finishing workout:', error);
      store.finishWorkout('AI分析は利用できませんでした。');
      setAnalysisResult('ワークアウトを保存しました！現在AI分析は利用できません。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeAnalysis = () => {
    setAnalysisResult(null);
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  // If no active workout, show start screen
  if (!store.isWorkoutActive || !store.currentWorkout) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-coral blur-[60px] opacity-20 rounded-full"></div>
          <BrainCircuit size={80} className="text-coral relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            AI Muscle Memo
          </h1>
          <p className="text-slate-400">素早く記録。AIと共に成長。</p>
        </div>

        <div className="bg-cardBg border border-slate-800 p-6 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-xl">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-semibold text-white">トレーニングの準備はOK？</h3>
            <p className="text-sm text-slate-400 mt-1">今日のセッションを記録しましょう。</p>
          </div>
          <button
            onClick={handleStartWorkout}
            className="w-full bg-coral text-white font-medium py-3 rounded-xl hover:bg-coral/90 transition-colors"
          >
            ワークアウトを開始
          </button>
        </div>
      </div>
    );
  }

  // Active workout view
  return (
    <div className="space-y-4 pb-32 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-center py-2">
        <button onClick={handleBack} className="flex items-center text-coral font-medium">
          <ChevronLeft size={24} />
          <span>Back</span>
        </button>
        <h2 className="text-white font-bold">
          {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '年').replace(/年/, '年').slice(0, -1) + '日'}
        </h2>
        <button onClick={store.cancelWorkout} className="text-coral text-sm">
          Cancel
        </button>
      </div>

      {/* Empty state */}
      {store.currentWorkout.exercises.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl mb-4">🏋️</div>
            <h3 className="text-lg font-semibold text-white">さあ、始めましょう！</h3>
            <p className="text-sm text-slate-400">最初の種目を追加して記録を開始しましょう。</p>
          </div>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="flex items-center gap-2 bg-coral text-white font-medium px-6 py-3 rounded-xl"
          >
            <Plus size={20} /> 種目を追加
          </button>
        </div>
      )}

      {/* Exercise Cards */}
      {store.currentWorkout.exercises.map((exercise) => {
        const totalVolume = calculateExerciseVolume(exercise);
        const recentVolumes = getRecentVolumes(exercise.name, store.history);
        const maxRecentVolume = Math.max(...recentVolumes, totalVolume, 1);

        return (
          <div key={exercise.id} className="bg-cardBg rounded-xl overflow-hidden">
            {/* Exercise Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">{exercise.name}</h3>
              <button
                onClick={() => store.removeExercise(exercise.id)}
                className="text-slate-500 hover:text-white"
              >
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Sets */}
            <div className="p-4 space-y-3">
              {exercise.sets.map((set, index) => (
                <div key={set.id} className="flex items-center gap-3">
                  <span className="text-slate-400 w-12 text-sm">{index + 1}set</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1 bg-surface rounded-lg px-3 py-2 flex items-center justify-center">
                      <input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            store.updateSet(exercise.id, set.id, 'weight', value);
                          } else if (e.target.value === '') {
                            store.updateSet(exercise.id, set.id, 'weight', 0);
                          }
                        }}
                        className="w-16 bg-transparent text-white text-center font-mono outline-none"
                        placeholder="0"
                      />
                      <span className="text-slate-400 ml-1">kg</span>
                    </div>
                    <div className="flex-1 bg-surface rounded-lg px-3 py-2 flex items-center justify-center">
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0) {
                            store.updateSet(exercise.id, set.id, 'reps', value);
                          } else if (e.target.value === '') {
                            store.updateSet(exercise.id, set.id, 'reps', 0);
                          }
                        }}
                        className="w-12 bg-transparent text-white text-center font-mono outline-none"
                        placeholder="0"
                      />
                      <span className="text-slate-400 ml-1">times</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add/Remove Set Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => store.addSet(exercise.id)}
                    className="text-coral hover:bg-coral/10 p-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (exercise.sets.length > 1) {
                        const lastSet = exercise.sets[exercise.sets.length - 1];
                        store.removeSet(exercise.id, lastSet.id);
                      }
                    }}
                    className="text-coral hover:bg-coral/10 p-2 rounded-lg transition-colors"
                    disabled={exercise.sets.length <= 1}
                  >
                    <Minus size={20} />
                  </button>
                </div>
                <span className="text-slate-400 text-sm">
                  Total volume: {formatVolume(totalVolume)}kg
                </span>
              </div>
            </div>

            {/* Note Section */}
            <div className="px-4 pb-4">
              <div className="bg-surface rounded-lg p-3">
                <span className="text-slate-500 text-sm">Note</span>
              </div>
            </div>

            {/* Recent Training Volumes Chart */}
            {recentVolumes.length > 0 && (
              <div className="px-4 pb-4">
                <div className="bg-surface rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Recent training volumes</h4>
                  <div className="flex items-end gap-2 h-24">
                    {[...recentVolumes, totalVolume].map((vol, idx) => {
                      const height = Math.max((vol / maxRecentVolume) * 100, 10);
                      const isCurrentSession = idx === recentVolumes.length;
                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <div
                            className={`w-full rounded-t-sm ${isCurrentSession ? 'bg-coral' : 'bg-coral/60'}`}
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-slate-500 text-xs">{idx}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-right text-slate-400 text-xs mt-2">100</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Menu Button */}
      {store.currentWorkout.exercises.length > 0 && (
        <button
          onClick={() => setShowExerciseModal(true)}
          className="flex items-center gap-2 text-coral py-2"
        >
          <div className="w-8 h-8 bg-coral/20 rounded-lg flex items-center justify-center">
            <Plus className="text-coral" size={20} />
          </div>
          <span className="font-medium">Add Menu</span>
        </button>
      )}

      {/* Error Message */}
      {analysisError && (
        <div className="fixed bottom-40 left-4 right-4 bg-error/20 border border-error rounded-lg p-3 text-center z-50 animate-in fade-in">
          <p className="text-error text-sm">{analysisError}</p>
          <button onClick={() => setAnalysisError(null)} className="text-slate-400 text-xs mt-1 underline">
            閉じる
          </button>
        </div>
      )}

      {/* Footer Action */}
      {store.currentWorkout.exercises.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowFinishConfirm(true)}
              disabled={isAnalyzing}
              className="w-full bg-coral text-white font-bold py-4 rounded-xl hover:bg-coral/90 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center">
                  <BrainCircuit className="animate-pulse mr-2" /> 分析中...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Check className="mr-2" size={20} /> ワークアウトを終了
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Exercise Selection Modal */}
      {showExerciseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col border-t sm:border border-slate-700 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-white">種目を選択</h3>
              <button
                onClick={() => setShowExerciseModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="検索..."
                  className="w-full bg-surfaceHighlight border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-coral transition-colors text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 p-4 overflow-x-auto no-scrollbar">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-white text-black'
                      : 'bg-surfaceHighlight text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Custom exercise add section */}
            <div className="px-4">
              {!showAddCustom ? (
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-coral hover:bg-coral/10 rounded-xl border border-dashed border-coral/30 transition-colors"
                >
                  <Plus size={18} />
                  <span>新しい種目を追加</span>
                </button>
              ) : (
                <div className="bg-surfaceHighlight rounded-xl p-4 space-y-3 border border-slate-700">
                  <input
                    type="text"
                    placeholder="種目名を入力..."
                    className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-coral transition-colors text-white"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    autoFocus
                  />
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-surface border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-coral transition-colors text-white"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 text-slate-400 hover:text-white transition-colors"
                      onClick={() => {
                        setShowAddCustom(false);
                        setCustomName('');
                      }}
                    >
                      キャンセル
                    </button>
                    <button
                      className="flex-1 py-2 bg-coral text-white rounded-lg disabled:opacity-50"
                      onClick={handleAddCustomExercise}
                      disabled={!customName.trim()}
                    >
                      追加
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto flex-1 p-4 pt-2">
              {filteredExercises.length > 0 ? (
                <div className="space-y-1">
                  {filteredExercises.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        store.addExercise(ex);
                        setShowExerciseModal(false);
                        setSearchTerm('');
                      }}
                      className="w-full text-left py-3 px-2 hover:bg-slate-800/50 rounded-lg flex items-center border-b border-slate-800/50"
                    >
                      <div className="w-1 h-6 bg-coral rounded-full mr-3" />
                      <span className="font-medium text-white">{ex.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  該当する種目がありません
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Finish Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-cardBg w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">🏁</div>
              <h3 className="font-bold text-lg text-white">ワークアウトを終了しますか？</h3>
              <p className="text-sm text-slate-400">終了するとAIが今日のトレーニングを分析します。</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                className="w-full bg-coral text-white font-medium py-3 rounded-xl hover:bg-coral/90 transition-colors"
                onClick={() => {
                  setShowFinishConfirm(false);
                  handleFinish();
                }}
              >
                終了する
              </button>
              <button
                className="w-full py-3 text-slate-400 hover:text-white transition-colors"
                onClick={() => setShowFinishConfirm(false)}
              >
                キャンセル
              </button>
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

            <div className="relative overflow-hidden rounded-2xl p-6 border border-coral">
              <div className="absolute inset-0 bg-gradient-to-br from-coral/20 to-transparent z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 text-coral mb-4">
                  <div className="bg-coral/20 p-2 rounded-lg">
                    <BrainCircuit size={24} />
                  </div>
                  <h3 className="font-bold text-lg">AIパーソナルトレーナー</h3>
                </div>

                <div className="prose prose-invert prose-sm max-w-none text-slate-100 leading-relaxed">
                  <p className="whitespace-pre-line">{analysisResult}</p>
                </div>
              </div>
            </div>

            <button
              onClick={closeAnalysis}
              className="w-full bg-coral text-white font-medium py-4 rounded-xl hover:bg-coral/90 transition-colors"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
