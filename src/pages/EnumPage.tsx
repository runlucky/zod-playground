import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// z.enum
const colorSchema = z.object({
  color: z.enum(['red', 'green', 'blue']),
});

// z.nativeEnum — use const object instead of TypeScript enum (erasableSyntaxOnly)
const Direction = {
  North: 'NORTH',
  South: 'SOUTH',
  East: 'EAST',
  West: 'WEST',
} as const;

const directionSchema = z.object({
  direction: z.nativeEnum(Direction),
});

export default function EnumPage() {
  const [color, setColor] = useState('');
  const [colorResult, setColorResult] = useState<ReturnType<typeof parseResult> | null>(null);
  const [direction, setDirection] = useState('');
  const [dirResult, setDirResult] = useState<ReturnType<typeof parseResult> | null>(null);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Enum バリデーション</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">z.enum()</code> と{' '}
          <code className="bg-gray-100 px-1 rounded">z.nativeEnum()</code> を試せます。
        </p>
      </div>

      {/* z.enum */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">z.enum</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setColorResult(parseResult(colorSchema, { color }));
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">色を選択</label>
            <code className="text-xs text-indigo-600 mb-1 block">
              z.enum(['red', 'green', 'blue'])
            </code>
            <select className="input" value={color} onChange={(e) => setColor(e.target.value)}>
              <option value="">-- 選択してください --</option>
              <option value="red">red</option>
              <option value="green">green</option>
              <option value="blue">blue</option>
              <option value="yellow">yellow (無効)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            送信
          </button>
        </form>
        <ResultPanel result={colorResult} />
      </div>

      {/* z.nativeEnum */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">z.nativeEnum (const オブジェクト)</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDirResult(parseResult(directionSchema, { direction }));
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">方向を選択</label>
            <code className="text-xs text-indigo-600 mb-1 block">z.nativeEnum(Direction)</code>
            <select
              className="input"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="">-- 選択してください --</option>
              <option value="NORTH">NORTH</option>
              <option value="SOUTH">SOUTH</option>
              <option value="EAST">EAST</option>
              <option value="WEST">WEST</option>
              <option value="UP">UP (無効)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full">
            送信
          </button>
        </form>
        <ResultPanel result={dirResult} />
      </div>
    </div>
  );
}
