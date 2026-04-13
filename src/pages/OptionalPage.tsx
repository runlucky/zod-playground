import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

const schema = z.object({
  nickname: z.string().optional(),
  middleName: z.string().nullable(),
  country: z.string().default('Japan'),
  age: z.coerce.number().int().min(0).optional(),
});

type FormState = { nickname: string; middleName: string; country: string; age: string };

export default function OptionalPage() {
  const [form, setForm] = useState<FormState>({
    nickname: '',
    middleName: '',
    country: '',
    age: '',
  });
  const [result, setResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass undefined for empty optional, null for nullable
    const data = {
      nickname: form.nickname || undefined,
      middleName: form.middleName === '' ? null : form.middleName,
      country: form.country || undefined,
      age: form.age === '' ? undefined : form.age,
    };
    setResult(parseResult(schema, data));
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Optional / Nullable / Default</h2>
      <p className="text-gray-500 text-sm mb-6">
        空欄にすると各フィールドの動作の違いが確認できます。
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="ニックネーム (optional)" hint="z.string().optional() — 未入力なら undefined になる">
            <input
              className="input"
              placeholder="空欄可"
              value={form.nickname}
              onChange={(e) => handleChange('nickname', e.target.value)}
            />
          </Field>

          <Field label="ミドルネーム (nullable)" hint="z.string().nullable() — 未入力なら null になる">
            <input
              className="input"
              placeholder="空欄 → null として送信"
              value={form.middleName}
              onChange={(e) => handleChange('middleName', e.target.value)}
            />
          </Field>

          <Field label="国 (default: 'Japan')" hint="z.string().default('Japan') — 未入力なら 'Japan' になる">
            <input
              className="input"
              placeholder="空欄 → 'Japan' になる"
              value={form.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
          </Field>

          <Field label="年齢 (optional number)" hint="z.coerce.number().int().min(0).optional() — 未入力なら undefined">
            <input
              type="number"
              className="input"
              placeholder="空欄可"
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
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
