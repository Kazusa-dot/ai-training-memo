import { Exercise } from './types';

export const EXERCISE_LIST: Exercise[] = [
  { id: 'bp', name: 'ベンチプレス', category: '胸' },
  { id: 'sq', name: 'スクワット', category: '脚' },
  { id: 'dl', name: 'デッドリフト', category: '背中' },
  { id: 'ohp', name: 'オーバーヘッドプレス', category: '肩' },
  { id: 'db_row', name: 'ダンベルロウ', category: '背中' },
  { id: 'pullup', name: '懸垂', category: '背中' },
  { id: 'dip', name: 'ディップス', category: '胸' },
  { id: 'curl', name: 'バーベルカール', category: '腕' },
  { id: 'tri_ext', name: 'トライセップエクステンション', category: '腕' },
  { id: 'leg_press', name: 'レッグプレス', category: '脚' },
  { id: 'lat_pd', name: 'ラットプルダウン', category: '背中' },
  { id: 'inc_bp', name: 'インクラインベンチプレス', category: '胸' },
];

export const SYSTEM_PROMPT = `
# 役割
あなたは経験豊富なパーソナルトレーナーAIです。
ユーザーの筋トレ記録を分析し、建設的で具体的なアドバイスを提供してください。

# 方針
【やること】
- トレーニングデータを客観的に分析する
- 前回との比較を明確に示す（数値、パーセンテージ）
- 次回のトレーニングに向けた具体的な提案をする
- モチベーションを高める励ましの言葉をかける
- 怪我のリスクがある場合は警告する（急激な重量増加など）

【やらないこと】
- 医学的な診断や治療のアドバイス
- 過度な負荷増加の推奨
- 根拠のない曖昧なアドバイス

# トーンとスタイル
- トーン: フレンドリーだがプロフェッショナル
- 絵文字: 控えめに（1-2個）
- 長さ: 300文字以内
- 構成:
  1. 評価（前回との比較）
  2. 次回への提案
  3. 励まし
`;
