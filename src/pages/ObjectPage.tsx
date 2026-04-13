import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

const schema = z.object({
  user: z.object({
    name: z.string().min(1, '名前は必須です'),
    age: z.coerce.number().int().min(0),
    address: z.object({
      city: z.string().min(1, '都市は必須です'),
      prefecture: z.string().min(1, '都道府県は必須です'),
    }),
  }),
  company: z.object({
    name: z.string().min(1, '会社名は必須です'),
    employees: z.coerce.number().int().positive('正の整数を入力してください'),
  }),
});

export default function ObjectPage() {
  const [form, setForm] = useState({
    userName: '',
    userAge: '',
    city: '',
    prefecture: '',
    companyName: '',
    employees: '',
  });
  const [result, setResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      user: {
        name: form.userName,
        age: form.userAge,
        address: {
          city: form.city,
          prefecture: form.prefecture,
        },
      },
      company: {
        name: form.companyName,
        employees: form.employees,
      },
    };
    setResult(parseResult(schema, data));
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">オブジェクトバリデーション</h2>
      <p className="text-gray-500 text-sm mb-6">
        <code className="bg-gray-100 px-1 rounded">z.object()</code>{' '}
        のネスト構造を試せます。エラーパスも確認できます。
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Section title="user">
            <Field label="名前" hint="user.name: z.string().min(1)">
              <input className="input" placeholder="山田 太郎" value={form.userName} onChange={(e) => handleChange('userName', e.target.value)} />
            </Field>
            <Field label="年齢" hint="user.age: z.coerce.number().int().min(0)">
              <input type="number" className="input" placeholder="30" value={form.userAge} onChange={(e) => handleChange('userAge', e.target.value)} />
            </Field>
            <div className="pl-4 border-l-2 border-indigo-200 space-y-3 mt-2">
              <p className="text-xs font-semibold text-indigo-500">address (ネスト)</p>
              <Field label="都市" hint="user.address.city: z.string().min(1)">
                <input className="input" placeholder="渋谷区" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
              </Field>
              <Field label="都道府県" hint="user.address.prefecture: z.string().min(1)">
                <input className="input" placeholder="東京都" value={form.prefecture} onChange={(e) => handleChange('prefecture', e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="company">
            <Field label="会社名" hint="company.name: z.string().min(1)">
              <input className="input" placeholder="株式会社サンプル" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
            </Field>
            <Field label="従業員数" hint="company.employees: z.coerce.number().int().positive()">
              <input type="number" className="input" placeholder="100" value={form.employees} onChange={(e) => handleChange('employees', e.target.value)} />
            </Field>
          </Section>

          <button type="submit" className="btn-primary w-full">
            送信（バリデーション実行）
          </button>
        </form>
      </div>

      <ResultPanel result={result} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-600 mb-2 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">
        {title}
      </p>
      <div className="space-y-3 pl-2">{children}</div>
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
