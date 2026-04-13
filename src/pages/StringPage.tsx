import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

const schema = z.object({
  name: z.string().min(2, '2文字以上で入力してください').max(50, '50文字以下で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  website: z.string().url('有効なURLを入力してください (https://... など)'),
  zipCode: z.string().regex(/^\d{3}-\d{4}$/, '郵便番号は 000-0000 の形式で入力してください'),
  bio: z.string().max(200, '200文字以内で入力してください').optional(),
});

type FormData = z.infer<typeof schema>;

export default function StringPage() {
  const [form, setForm] = useState<Partial<FormData>>({});
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
      <h2 className="text-2xl font-bold text-gray-900 mb-1">文字列バリデーション</h2>
      <p className="text-gray-500 text-sm mb-6">
        <code className="bg-gray-100 px-1 rounded">z.string()</code> の各種メソッドを試せます。
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="名前 (min: 2, max: 50)" hint="z.string().min(2).max(50)">
            <input
              className="input"
              placeholder="山田 太郎"
              value={form.name ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </Field>

          <Field label="メールアドレス" hint="z.string().email()">
            <input
              className="input"
              placeholder="example@mail.com"
              value={form.email ?? ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Field>

          <Field label="ウェブサイト" hint="z.string().url()">
            <input
              className="input"
              placeholder="https://example.com"
              value={form.website ?? ''}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </Field>

          <Field label="郵便番号" hint="z.string().regex(/^\\d{3}-\\d{4}$/)">
            <input
              className="input"
              placeholder="123-4567"
              value={form.zipCode ?? ''}
              onChange={(e) => handleChange('zipCode', e.target.value)}
            />
          </Field>

          <Field label="自己紹介 (任意, max: 200)" hint="z.string().max(200).optional()">
            <textarea
              className="input"
              rows={3}
              placeholder="任意入力です"
              value={form.bio ?? ''}
              onChange={(e) => handleChange('bio', e.target.value)}
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
