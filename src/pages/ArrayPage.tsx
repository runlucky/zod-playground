import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

const schema = z.object({
  tags: z
    .array(z.string().min(1, 'タグは空にできません'))
    .min(1, '少なくとも1つのタグが必要です')
    .max(5, '5つまでのタグを入力できます'),
  scores: z
    .array(z.coerce.number().int().min(0).max(100))
    .min(1, 'スコアを最低1つ入力してください'),
});

export default function ArrayPage() {
  const [tags, setTags] = useState(['']);
  const [scores, setScores] = useState(['']);
  const [result, setResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(parseResult(schema, { tags, scores }));
  };

  const addTag = () => setTags((t) => [...t, '']);
  const removeTag = (i: number) => setTags((t) => t.filter((_, idx) => idx !== i));
  const updateTag = (i: number, v: string) => setTags((t) => t.map((x, idx) => (idx === i ? v : x)));

  const addScore = () => setScores((s) => [...s, '']);
  const removeScore = (i: number) => setScores((s) => s.filter((_, idx) => idx !== i));
  const updateScore = (i: number, v: string) =>
    setScores((s) => s.map((x, idx) => (idx === i ? v : x)));

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">配列バリデーション</h2>
      <p className="text-gray-500 text-sm mb-6">
        <code className="bg-gray-100 px-1 rounded">z.array()</code>{' '}
        の要素スキーマ・長さ制約を試せます。
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              タグ (min: 1, max: 5)
            </label>
            <code className="text-xs text-indigo-600 mb-2 block">
              z.array(z.string().min(1)).min(1).max(5)
            </code>
            {tags.map((tag, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="input flex-1"
                  placeholder={`タグ ${i + 1}`}
                  value={tag}
                  onChange={(e) => updateTag(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="text-sm text-indigo-600 hover:underline"
            >
              + タグを追加
            </button>
          </div>

          {/* Scores */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">
              スコア (int, 0〜100)
            </label>
            <code className="text-xs text-indigo-600 mb-2 block">
              z.array(z.coerce.number().int().min(0).max(100)).min(1)
            </code>
            {scores.map((score, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="number"
                  className="input flex-1"
                  placeholder={`スコア ${i + 1}`}
                  value={score}
                  onChange={(e) => updateScore(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeScore(i)}
                  className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addScore}
              className="text-sm text-indigo-600 hover:underline"
            >
              + スコアを追加
            </button>
          </div>

          <button type="submit" className="btn-primary w-full">
            送信（バリデーション実行）
          </button>
        </form>
      </div>

      <ResultPanel result={result} />
    </div>
  );
}
