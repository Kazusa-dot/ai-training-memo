<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1QyZp7i4lyKBK0p_ovaIwbmuzdnvr9iNQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# AI筋トレメモアプリ - プロジェクト計画書

**作成日**: 2026-01-30  
**バージョン**: 1.0

---

## 1. エグゼクティブサマリー

### プロジェクト概要
ジムでリアルタイムに筋トレを記録し、AIが過去のデータを分析して次回のトレーニングアドバイスを提供するモバイル優先の記録アプリ。Strong/FitNotesのようなシンプルな記録UIに、パーソナルトレーナーのようなAIアシスタント機能を組み合わせたもの。

### ターゲットユーザー
- ジムで筋トレを行う個人
- トレーニング記録を継続的につけたい人
- データに基づいた改善提案が欲しい人

### 主要な差別化ポイント
- **AI分析による具体的なアドバイス**：前回比較、次回への提案
- **オフライン対応**：ネット環境が悪いジムでも記録可能
- **シンプルな入力**：素早く記録できるUI

---

## 2. ユーザーストーリー & ペルソナ

### Story 1: リアルタイム記録
> Kazusaはジムでベンチプレスを終えた。スマホを開いて「ベンチプレス」を選択し、60kg×10回×3セットと素早く入力。次のセットまでの休憩中に完了。オフラインでも問題なく記録できる。

### Story 2: AI即時フィードバック
> トレーニング記録を保存すると、AIが自動で分析。「前回より総ボリュームが12%増えてます💪 次回は最後のセットだけ62.5kgにチャレンジしてみましょう」と具体的な提案が表示される。

### Story 3: 進捗確認
> 月末にアプリを開くと、AIが自動生成した月次レポートが表示される。「今月はベンチプレスのMAXが5kg更新されました。上腕三頭筋の種目が少ないので、追加すると胸トレの効果が上がるかも」というアドバイス付き。

---

## 3. 機能要件（MoSCoW分類）

### Must Have（MVP - 最初のバージョン）
- ✅ **トレーニング記録入力**
  - 種目選択（検索可能）
  - 重量・レップ数・セット数の入力
  - 日付選択
- ✅ **種目マスタデータ**
  - 主要な筋トレ種目（ベンチプレス、スクワット、デッドリフト等）
  - カテゴリ別分類（胸、背中、脚、肩、腕）
- ✅ **過去の記録一覧**
  - 日付別表示
  - 種目別フィルタ
- ✅ **AI即時フィードバック**
  - トレーニング保存後の自動分析
  - 前回比較（ボリューム、重量）
  - 次回への具体的提案
- ✅ **ユーザー認証**
  - メール/パスワードログイン
  - サインアップ

### Should Have（v1.1 - 早めに追加したい）
- 📊 **データ可視化**
  - 種目別の推移グラフ（最大重量、総ボリューム）
  - 期間フィルタ（1週間/1ヶ月/3ヶ月）
  - 統計サマリー（平均、最大、頻度）
- 📝 **トレーニングテンプレート**
  - 「胸の日」「脚の日」等の保存
  - テンプレートからの素早い記録開始
- 🎯 **目標設定機能**
  - 種目別の目標設定（例: ベンチプレス100kg）
  - 進捗率表示
  - AIによる目標達成アドバイス
- 📈 **週次/月次レポート自動生成**
  - AIによる期間サマリー
  - 成長した種目の分析
  - 改善提案

### Could Have（将来的に）
- 📷 **トレーニング動画/写真記録**
- 🏆 **実績・バッジシステム**
- 📤 **データエクスポート**（CSV/JSON）
- 🔔 **トレーニングリマインダー**
- 🎨 **カスタムテーマ**

### Won't Have（今回は対象外）
- SNS機能（友達とシェア、ランキング）
- 栄養管理機能
- ウェアラブルデバイス連携
- 動画によるフォーム分析

---

## 4. 非機能要件

### パフォーマンス
- **記録入力のレスポンス**: 即座（オフラインでも）
- **AI応答時間**: 3-5秒以内
- **画面遷移**: 1秒以内
- **オフライン対応**: ネット接続なしでも記録可能、復帰時に自動同期

### データ管理
- **データ保存**: 全トレーニングデータを永続保存
- **AI分析対象**: 同一種目の直近2ヶ月のデータを優先参照
- **同期**: オンライン復帰時に自動同期
- **データ整合性**: 同期競合は「最後の書き込み優先」

### セキュリティ
- **認証**: メール/パスワード認証必須
- **データ保護**: ユーザーごとにデータ分離
- **APIキー**: フロントエンドに露出させない（サーバーサイドで管理）

### ユーザビリティ
- **デバイス**: スマホのみ（モバイルファースト）
- **UI**: ダークテーマ、電動ブルー/シアンアクセント
- **入力効率**: 最小タップ数で記録完了
- **視認性**: ジムの照明下でも見やすい

### 可用性
- **稼働率**: 99%以上
- **バックアップ**: 自動バックアップ（Supabase管理）

---

## 5. 技術スタック

### フロントエンド

#### **React + Vite**
- **理由**: 
  - 軽量で高速なビルド
  - モバイルに最適
  - 既存の知識を活用可能
- **バージョン**: React 18+, Vite 5+

#### **状態管理: Zustand**
- **理由**:
  - Reduxよりシンプル
  - 学習コスト低い
  - オフラインデータ管理に適している
- **使用箇所**: 
  - トレーニング記録の一時保存
  - ユーザー情報
  - オフライン同期キュー

#### **UI: Tailwind CSS + shadcn/ui**
- **理由**:
  - モバイル最適化が簡単
  - ダークテーマ対応
  - カスタマイズ性が高い
  - コンポーネントの再利用性
- **カラースキーム**: 
  - ベース: ダークテーマ
  - アクセント: 電動ブルー/シアン (#00E5FF, #0EA5E9)

#### **オフライン対応: Workbox (PWA)**
- **理由**:
  - Service Workerで記録をキャッシュ
  - オンライン復帰時に自動同期
  - インストール可能なPWAに
- **キャッシュ戦略**:
  - Static assets: Cache First
  - API calls: Network First with fallback
  - Workout data: Cache then Network

#### **グラフ: Recharts**
- **理由**:
  - Reactに最適化
  - レスポンシブ
  - カスタマイズ可能
- **使用箇所**:
  - 重量推移グラフ
  - ボリューム推移グラフ

---

### バックエンド

#### **Supabase**（推奨）
- **理由**:
  - 認証機能がビルトイン
  - PostgreSQLデータベース
  - リアルタイム同期機能
  - 無料枠が大きい（月5万リクエスト）
  - インフラ管理不要
  - Edge Functions（サーバーレス）
- **使用機能**:
  - Authentication: ユーザー認証
  - Database: データ永続化
  - Realtime: データ同期
  - Edge Functions: AI API呼び出し

#### **代替案: Next.js API Routes**
- メリット: フロントと同じリポジトリ
- デメリット: サーバー管理が必要
- 判断: 個人開発のため Supabase を推奨

---

### データベース

#### **PostgreSQL（Supabase経由）**
- **理由**:
  - トレーニングデータは構造化されている
  - リレーショナルモデルが適切
  - 日付・時系列クエリに強い
  - JSON型でAI分析結果も保存可能

#### **スキーマ設計**:

```sql
-- ユーザー（Supabase Auth管理）
-- id, email, created_at, etc.

-- トレーニングセッション
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT,
  ai_feedback JSONB, -- AI分析結果を保存
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 種目記録
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name VARCHAR(100) NOT NULL, -- 例: "ベンチプレス"
  exercise_category VARCHAR(50), -- 例: "胸"
  order_index INT, -- 種目の順番
  created_at TIMESTAMP DEFAULT NOW()
);

-- セット記録
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  set_order INT NOT NULL, -- セット番号
  weight DECIMAL(5,2) NOT NULL, -- 重量（kg）
  reps INT NOT NULL, -- レップ数
  created_at TIMESTAMP DEFAULT NOW()
);

-- 種目マスタ（オプション）
CREATE TABLE exercise_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- トレーニングテンプレート（v1.1で追加）
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- 例: "胸の日"
  exercises JSONB NOT NULL, -- テンプレート内容
  created_at TIMESTAMP DEFAULT NOW()
);

-- 目標設定（v1.1で追加）
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name VARCHAR(100) NOT NULL,
  target_weight DECIMAL(5,2),
  target_reps INT,
  target_date DATE,
  achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date DESC);
CREATE INDEX idx_exercises_workout ON exercises(workout_id);
CREATE INDEX idx_sets_exercise ON sets(exercise_id);
```

---

### AI統合

#### **Google Gemini API**（推奨）
- **モデル**: Gemini 1.5 Flash
- **理由**:
  - コストが安い（$0.075/1M tokens）
  - Claude APIの約1/10のコスト
  - 応答速度が十分
  - 日本語対応が良好
  - 200文字程度の応答に最適

#### **代替案: OpenAI GPT-4o-mini**
- Geminiより少し高いが、安定性が高い
- 必要に応じて切り替え可能

#### **API呼び出し設計**:

```javascript
// フロントエンド → Supabase Edge Function → Gemini API
// 理由: APIキーをフロントエンドに露出させない

// Supabase Edge Function (TypeScript)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { workoutData, historicalData } = await req.json()
  
  // コンテキスト構築
  const context = buildAIContext(workoutData, historicalData)
  
  // Gemini API呼び出し
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: context }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    }
  )
  
  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### **トークン最適化戦略**:
- 生データではなく統計値を送信
- 直近5セッションのみに限定
- JSON構造を最小化
- レスポンスキャッシュ（24時間）

**コスト試算**:
- 1回のAI分析: 約500 tokens input + 200 tokens output
- 月100回使用: 約70,000 tokens
- 月額コスト: **約$0.005（実質無料）**

---

### ホスティング & インフラ

#### **Vercel（フロントエンド）**
- **理由**:
  - 無料枠が充実（個人プロジェクトなら十分）
  - Git push で自動デプロイ
  - PWAホスティングに最適
  - グローバルCDN
- **無料枠**: 100GB bandwidth/月

#### **Supabase（バックエンド/DB）**
- **無料枠**:
  - 500MB データベース
  - 50万 Edge Function リクエスト/月
  - 2GB ファイルストレージ
  - 無制限 API リクエスト

#### **合計月額コスト**: $0-1 程度（無料枠内）

---

## 6. システムアーキテクチャ

### アーキテクチャ図

```
┌─────────────────────────────────────┐
│   ユーザー（スマホ）                   │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   React PWA (Vite) - Vercel         │
│   ├─ Zustand (状態管理)              │
│   ├─ Workbox (オフライン)             │
│   ├─ Tailwind CSS + shadcn/ui       │
│   └─ Recharts (グラフ)                │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   Supabase                          │
│   ├─ Authentication (認証)           │
│   ├─ PostgreSQL (データ保存)          │
│   ├─ Realtime (同期)                 │
│   └─ Edge Functions (AI呼び出し)      │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   Gemini 1.5 Flash API              │
│   - トレーニング分析                   │
│   - アドバイス生成                     │
└─────────────────────────────────────┘
```

### データフロー

#### **1. トレーニング記録フロー**
```
1. ユーザーが記録入力
   ↓
2. Zustand に一時保存（即座にUI更新）
   ↓
3a. [オンライン] Supabase に即座に保存
3b. [オフライン] ローカルストレージに保存
   ↓
4. [オフライン→オンライン] 
   Service Worker が変化を検知
   → 自動で Supabase に同期
```

#### **2. AI分析フロー**
```
1. ユーザーが保存ボタンをタップ
   ↓
2. フロントエンドから Supabase Edge Function を呼び出し
   ↓
3. Edge Function:
   a. 今日のワークアウトデータを取得
   b. 過去2ヶ月の同種目データを集計
   c. コンテキストを構築
   d. Gemini API を呼び出し
   ↓
4. AI応答を受け取り
   ↓
5. フロントエンドで表示
   ↓
6. workouts.ai_feedback に保存（後で再表示可能）
```

#### **3. グラフ表示フロー**
```
1. ユーザーが種目を選択
   ↓
2. Supabase から過去データをクエリ
   SELECT date, MAX(weight), SUM(weight * reps) as volume
   FROM workouts w
   JOIN exercises e ON e.workout_id = w.id
   JOIN sets s ON s.exercise_id = e.id
   WHERE e.exercise_name = 'ベンチプレス'
   GROUP BY date
   ORDER BY date
   ↓
3. Recharts でグラフ描画
```

---

## 7. AI設定詳細

### システムプロンプト

```markdown
# あなたの役割
あなたは経験豊富なパーソナルトレーナーAIです。
ユーザーの筋トレ記録を分析し、建設的で具体的なアドバイスを提供します。

# 基本方針
【あなたがすること】
- トレーニングデータを客観的に分析
- 前回との比較を明確に示す（数値・パーセンテージ）
- 次回のトレーニングへの具体的な提案
- モチベーションを高める励まし
- 怪我のリスクがある場合は警告

【あなたがしないこと】
- 医学的診断や治療のアドバイス
- 過度な負荷増加の推奨
- 根拠のない曖昧なアドバイス

# 口調とスタイル
- トーン: フレンドリーだが専門的
- 絵文字: 控えめ（1-2個）
- 文字数: 200文字以内
- 構成: 
  1. 評価（前回比較）
  2. 次回への提案
  3. 励ましの一言
```

### コンテキスト構造

```javascript
const buildAIContext = (currentWorkout, historicalData) => {
  // 総ボリューム計算
  const currentVolume = currentWorkout.sets.reduce(
    (sum, set) => sum + (set.weight * set.reps), 0
  )
  
  // 最大重量
  const currentMaxWeight = Math.max(
    ...currentWorkout.sets.map(s => s.weight)
  )
  
  // 前回との比較
  const lastSession = historicalData.sessions[0]
  const volumeChange = lastSession 
    ? ((currentVolume - lastSession.totalVolume) / lastSession.totalVolume * 100).toFixed(1)
    : null
  
  // プロンプト構築
  return `
${SYSTEM_PROMPT}

【今日のトレーニング】
日付: ${currentWorkout.date}
種目: ${currentWorkout.exercise}
${currentWorkout.sets.map((s, i) => 
  `セット${i+1}: ${s.weight}kg × ${s.reps}回`
).join('\n')}
総ボリューム: ${currentVolume}kg

【前回との比較】
${lastSession ? `
前回日付: ${lastSession.date}
前回総ボリューム: ${lastSession.totalVolume}kg
変化: ${volumeChange > 0 ? '+' : ''}${volumeChange}%
` : '初めての記録です'}

【過去2ヶ月の統計】
平均ボリューム: ${historicalData.stats.averageVolume}kg
最大重量: ${historicalData.stats.maxWeight}kg
実施頻度: 月${historicalData.stats.frequency}回
トレンド: ${historicalData.stats.trend}

上記のデータを分析して、200文字以内でフィードバックをお願いします。
`
}
```

### 応答例

**入力データ:**
```json
{
  "currentWorkout": {
    "date": "2026-01-30",
    "exercise": "ベンチプレス",
    "sets": [
      { "weight": 60, "reps": 10 },
      { "weight": 60, "reps": 9 },
      { "weight": 60, "reps": 8 }
    ]
  },
  "historicalData": {
    "sessions": [{
      "date": "2026-01-23",
      "totalVolume": 1620
    }],
    "stats": {
      "averageVolume": 1650,
      "maxWeight": 60,
      "trend": "stable"
    }
  }
}
```

**期待される応答:**
```
前回と同じ総ボリューム1620kgを維持してます💪 重量・レップ数ともに安定していて良いフォームが保てている証拠です。次回は最後のセットだけ62.5kgにチャレンジして、新しい刺激を与えてみましょう。着実な成長です！
```

---

## 8. 実装ロードマップ

### Phase 1: MVP（2-3週間）

#### Week 1: 基盤構築
**目標**: 認証とデータ記録の基本機能

**タスク**:
- [ ] プロジェクトセットアップ
  - `npm create vite@latest workout-app -- --template react-ts`
  - Tailwind CSS, shadcn/ui インストール
  - フォルダ構成作成
- [ ] Supabase プロジェクト作成
  - 認証設定（Email/Password）
  - データベーススキーマ作成
- [ ] 認証フロー実装
  - ログイン画面
  - サインアップ画面
  - 保護されたルート
- [ ] 基本的なルーティング設定（React Router）

**成果物**:
- ログイン/サインアップ画面
- 認証済みユーザーのみアクセス可能なダッシュボード

**技術スタック確認**:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@supabase/supabase-js": "^2.39.0",
    "zustand": "^4.4.7",
    "recharts": "^2.10.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.2.0"
  }
}
```

---

#### Week 2: コア記録機能
**目標**: トレーニングを記録できる

**タスク**:
- [ ] 種目マスタデータ作成
  - SQL insert文で主要種目を登録
  - カテゴリ別分類
- [ ] トレーニング記録画面UI
  - 日付選択（デフォルト: 今日）
  - 種目選択（検索可能ドロップダウン）
  - セット入力フォーム（重量・レップ数）
  - セット追加/削除ボタン
  - 保存ボタン
- [ ] Zustand状態管理セットアップ
  ```typescript
  interface WorkoutStore {
    currentWorkout: Workout | null
    setCurrentWorkout: (workout: Workout) => void
    addSet: (exerciseId: string, set: Set) => void
    removeSet: (exerciseId: string, setId: string) => void
    saveWorkout: () => Promise<void>
  }
  ```
- [ ] Supabaseへのデータ保存処理
- [ ] 記録一覧画面
  - 日付別表示（降順）
  - 種目・セット詳細表示

**成果物**:
- トレーニングを記録して保存できる
- 過去の記録を一覧で見られる

---

#### Week 3: AI統合
**目標**: AIフィードバックを受け取れる

**タスク**:
- [ ] Google Cloud プロジェクト作成
  - Gemini API有効化
  - APIキー取得
- [ ] Supabase Edge Function作成
  ```typescript
  // functions/ai-analysis/index.ts
  serve(async (req) => {
    const { workoutId } = await req.json()
    
    // 1. 今日のワークアウトデータ取得
    const currentWorkout = await fetchWorkout(workoutId)
    
    // 2. 過去2ヶ月の同種目データ取得・集計
    const historicalData = await fetchHistoricalData(
      currentWorkout.userId,
      currentWorkout.exercises[0].name,
      60 // days
    )
    
    // 3. コンテキスト構築
    const context = buildAIContext(currentWorkout, historicalData)
    
    // 4. Gemini API呼び出し
    const aiResponse = await callGeminiAPI(context)
    
    // 5. AI応答を workout.ai_feedback に保存
    await saveAIFeedback(workoutId, aiResponse)
    
    return new Response(JSON.stringify({ feedback: aiResponse }))
  })
  ```
- [ ] システムプロンプト実装
- [ ] フロントエンドからEdge Function呼び出し
- [ ] AI応答表示UI
  - カード形式
  - ローディングアニメーション
  - エラー時のフォールバックメッセージ
- [ ] workouts テーブルに ai_feedback カラム追加

**成果物**:
- トレーニング保存後、AIが自動で分析
- 「今日の評価」「次回への提案」を表示

---

### Phase 2: 機能強化（2-3週間）

#### Week 4: オフライン対応
**タスク**:
- [ ] Vite PWA Plugin インストール・設定
  ```typescript
  // vite.config.ts
  import { VitePWA } from 'vite-plugin-pwa'
  
  export default defineConfig({
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 24 hours
                }
              }
            }
          ]
        }
      })
    ]
  })
  ```
- [ ] オフライン検知ロジック
- [ ] ローカルストレージへの保存（IndexedDB）
- [ ] オンライン復帰時の同期処理
  ```typescript
  // 同期キュー管理
  const syncQueue = {
    addToQueue: (workout: Workout) => {
      // IndexedDBに保存
    },
    processQueue: async () => {
      // オンライン時にSupabaseに送信
    }
  }
  ```
- [ ] 同期状態UI
  - 「オフライン」バッジ
  - 「同期中」インジケーター

**成果物**:
- ネットなしでも記録可能
- 復帰後に自動でクラウドに保存

---

#### Week 5: データ可視化
**タスク**:
- [ ] Recharts統合
- [ ] 種目別推移グラフ
  - 最大重量推移（折れ線グラフ）
  - 総ボリューム推移（棒グラフ）
- [ ] 期間フィルタ
  - 1週間 / 1ヶ月 / 3ヶ月
- [ ] 統計サマリー計算
  ```typescript
  const calculateStats = (data: WorkoutData[]) => ({
    average: data.reduce((sum, d) => sum + d.volume, 0) / data.length,
    max: Math.max(...data.map(d => d.weight)),
    totalSets: data.reduce((sum, d) => sum + d.sets.length, 0),
    frequency: data.length // セッション数
  })
  ```
- [ ] グラフページUI

**成果物**:
- グラフで成長が見える
- 統計データで客観的に把握

---

#### Week 6: テンプレート & 目標
**タスク**:
- [ ] テンプレート機能実装
  - テンプレート作成画面
  - テンプレート一覧
  - テンプレートから記録開始
- [ ] 目標設定機能
  - 目標作成画面（種目、重量、期限）
  - 進捗率計算
  - 達成時の通知
- [ ] AIによる目標達成アドバイス
  - 目標までの距離分析
  - 推奨トレーニング頻度
  - 予測達成日

**成果物**:
- よく行うトレーニングを素早く記録
- 目標に向けた進捗が見える

---

### Phase 3: 洗練（1-2週間）

#### Week 7-8: UI/UX改善 & レポート
**タスク**:
- [ ] モバイルUI最適化
  - タップターゲットサイズ調整
  - スワイプジェスチャー
- [ ] ダークテーマ微調整
- [ ] マイクロアニメーション追加（Framer Motion）
- [ ] 週次/月次レポート自動生成
  - 毎週月曜日に先週のレポート
  - 毎月1日に先月のレポート
  - Supabase Cron Job使用
- [ ] パフォーマンス最適化
  - コード分割
  - 画像最適化
  - バンドルサイズ削減
- [ ] バグ修正
- [ ] テストデータでの動作確認

**成果物**:
- 洗練されたUI
- 自動で振り返りレポート

---

## 9. リスク評価と対策

### リスク1: オフライン同期の複雑さ
- **影響度**: 中
- **発生確率**: 中
- **影響**: データ不整合、重複記録
- **対策**:
  - MVP段階ではオンライン必須にして、Phase 2で追加
  - Supabaseのリアルタイム機能を活用
  - 競合解決は「最後の書き込み優先」で単純化
  - 十分なテスト

### リスク2: AI応答コスト
- **影響度**: 低
- **発生確率**: 低
- **影響**: 予算超過
- **対策**:
  - トークン数を制限（直近5セッション、統計値のみ）
  - レスポンスキャッシュ（24時間）
  - Gemini Flash使用（最安）
  - 月の予算上限設定（$10）
  - ユーザーあたりの1日のAI呼び出し回数制限

### リスク3: PWAの複雑さ
- **影響度**: 中
- **発生確率**: 中
- **影響**: オフライン機能が動作しない
- **対策**:
  - Vite PWA pluginを使用（設定が簡単）
  - 段階的に実装（まずはインストール可能に、次にオフライン）
  - 公式ドキュメント参照
  - iOS Safariでのテスト（PWA制限あり）

### リスク4: データベース設計の変更
- **影響度**: 中
- **発生確率**: 低
- **影響**: データ移行が必要
- **対策**:
  - 初期段階でスキーマをしっかり設計
  - Supabase migrationsで管理
  - 柔軟性のためにJSON列も活用（ai_feedback等）
  - 変更時は migration script を書く

### リスク5: スコープクリープ
- **影響度**: 高
- **発生確率**: 高
- **影響**: 開発期間の延長、MVP未完成
- **対策**:
  - **MoSCoW分類を厳守**
  - 「Could Have」は明確に後回し
  - 2週間ごとに優先度を見直し
  - 機能追加は MVP完成後のみ

### リスク6: Gemini API の制限・変更
- **影響度**: 中
- **発生確率**: 低
- **影響**: AI機能が動作しなくなる
- **対策**:
  - APIラッパー関数を作成（切り替え容易に）
  - OpenAI APIへの切り替え準備
  - エラー時のフォールバックメッセージ

---

## 10. 成功指標（KPI）

### MVP段階（Phase 1完了時）
- [ ] 認証機能が動作する
- [ ] トレーニングを記録・保存できる
- [ ] AI分析が3-5秒以内に返ってくる
- [ ] 過去の記録を閲覧できる
- [ ] モバイルで快適に操作できる

### v1.1段階（Phase 2完了時）
- [ ] オフラインで記録可能
- [ ] グラフで推移が見える
- [ ] テンプレートから素早く記録開始できる
- [ ] 目標設定と進捗確認ができる

### ユーザー体験指標
- 記録完了までの時間: **30秒以内**
- AI応答時間: **5秒以内**
- オフライン→オンライン同期: **10秒以内**

---

## 11. 次のステップ

### 即座に実行すること

1. **開発環境セットアップ**
   ```bash
   # Node.js 18+ がインストール済みか確認
   node -v
   
   # プロジェクト作成
   npm create vite@latest workout-ai-app -- --template react-ts
   cd workout-ai-app
   
   # 依存関係インストール
   npm install
   npm install @supabase/supabase-js zustand recharts
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **アカウント作成**（全て無料）
   - [ ] Supabase (https://supabase.com)
   - [ ] Vercel (https://vercel.com)
   - [ ] Google Cloud (https://console.cloud.google.com)

3. **Supabaseプロジェクト初期化**
   - プロジェクト作成
   - データベーススキーマ実行
   - 認証設定
   - APIキー取得

4. **Google AI Studio でプロンプトテスト**
   - システムプロンプトを入力
   - サンプルデータでテスト
   - 応答を確認・調整

5. **Week 1の開発開始**
   - 認証画面作成
   - ダッシュボード骨組み

---

## 12. 参考リンク

### ドキュメント
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Supabase Docs: https://supabase.com/docs
- Gemini API: https://ai.google.dev/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/
- Zustand: https://github.com/pmndrs/zustand
- Recharts: https://recharts.org/

### チュートリアル
- Supabase Auth with React: https://supabase.com/docs/guides/auth/quickstarts/react
- Vite PWA Plugin: https://vite-pwa-org.netlify.app/

---

## 13. UI/UX設計

詳細なUI/UX設計については、別ドキュメント **`workout-ai-app-ui-design.md`** を参照してください。

### 設計のハイライト
- **既存アプリ（Strong/FitNotes）のUXパターンを踏襲**
- **AI機能を自然に統合**（記録の邪魔をしない）
- **ダークテーマ + 電動ブルーアクセント**（`#00E5FF`）
- **モバイルファースト設計**（ジムでの使いやすさ優先）
- **3タップ以内で記録完了**

### 主要画面
1. **記録画面**: トレーニングの素早い入力
2. **履歴画面**: 過去のワークアウト一覧 + AI要約
3. **AI分析結果**: 保存後の自動フィードバック
4. **統計画面**: グラフと進捗可視化（Phase 2）
5. **設定画面**: ユーザー設定、テンプレート、目標

### コンポーネント設計
- **共通UI**: Button, Card, Input, Modal, Toast
- **トレーニング**: ExerciseCard, SetRow, WorkoutSummary
- **AI**: AICard, AIChat, AILoadingAnimation
- **レイアウト**: AppLayout, Header, TabNavigation

---

## 14. まとめ

このプロジェクトは、**シンプルな筋トレ記録アプリにAIの知見を加える**というコンセプトで、以下の技術スタックで実現します：

- **フロントエンド**: React + Vite + Tailwind CSS + Zustand
- **バックエンド**: Supabase（PostgreSQL + Edge Functions）
- **AI**: Google Gemini 1.5 Flash
- **ホスティング**: Vercel + Supabase
- **PWA**: Workbox（オフライン対応）
- **UI**: shadcn/ui + カスタムコンポーネント

**開発期間**: 6-8週間  
**月額コスト**: $0-1（無料枠内）

Phase 1（MVP）に集中し、基本的な記録機能とAI分析を3週間で完成させることが最優先です。
