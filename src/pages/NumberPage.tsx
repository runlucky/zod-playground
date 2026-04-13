import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

const schema = z.object({
  age: z.coerce.number().int('整数を入力してください').min(0, '0以上の数値を入力してください').max(150, '150以下の数値を入力してください'),
  price: z.coerce.number().positive('正の数を入力してください'),
  temperature: z.coerce.number().min(-273.15, '絶対零度(-273.15)より低い温度は存在しません'),
  rating: z.coerce.number().int('整数を入力してください').min(1, '1以上').max(5, '5以下'),
});

type FormData = { age: string; price: string; temperature: string; rating: string };

export default function NumberPage() {
  const [form, setForm] = useState<FormData>({ age: '', price: '', temperature: '', rating: '' });
  const [result, setResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(parseResult(schema, form));
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">数値バリデーション</h2>
      <p className="text-gray-500 text-sm mb-6">
        <code className="bg-gray-100 px-1 rounded">z.number()</code> と{' '}
        <code className="bg-gray-100 px-1 rounded">z.coerce.number()</code> を試せます。
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="年齢 (int, 0〜150)" hint="z.coerce.number().int().min(0).max(150)">
            <input
              type="number"
              className="input"
              placeholder="25"
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
            />
          </Field>

          <Field label="価格 (正の数)" hint="z.coerce.number().positive()">
            <input
              type="number"
              step="any"
              className="input"
              placeholder="1980"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </Field>

          <Field label="温度 (min: -273.15)" hint="z.coerce.number().min(-273.15)">
            <input
              type="number"
              step="any"
              className="input"
              placeholder="20"
              value={form.temperature}
              onChange={(e) => handleChange('temperature', e.target.value)}
            />
          </Field>

          <Field label="評価 (int, 1〜5)" hint="z.coerce.number().int().min(1).max(5)">
            <input
              type="number"
              className="input"
              placeholder="4"
              value={form.rating}
              onChange={(e) => handleChange('rating', e.target.value)}
            />
          </Field>

          <button type="submit" className="btn-primary w-full">
            送信（バリデーション実行）
          </button>
        </form>
      </div>

      <ResultPanel result={result} />
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-0.5">{label}</label>
      <code className="text-xs text-indigo-600 mb-1 block">{hint}</code>
      {children}
    </div>
  );
}
