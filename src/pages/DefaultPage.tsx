import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// Basic default values
const basicSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  role: z.string().default('member'),
  score: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

// Default with nested object
const nestedSchema = z.object({
  user: z.object({
    name: z.string().min(1, '名前は必須です'),
    settings: z
      .object({
        theme: z.string().default('light'),
        language: z.string().default('ja'),
        notifications: z.boolean().default(true),
      })
      .default({ theme: 'light', language: 'ja', notifications: true }),
  }),
});

// Default with dynamic value (function)
const dynamicSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  createdAt: z.string().default(() => new Date().toISOString()),
  id: z.string().default(() => crypto.randomUUID()),
});

export default function DefaultPage() {
  // basic
  const [basicForm, setBasicForm] = useState({ name: '', role: '', score: '', active: '' });
  const [basicResult, setBasicResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // nested
  const [nestedForm, setNestedForm] = useState({ name: '', theme: '', language: '', notifications: '' });
  const [nestedResult, setNestedResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // dynamic
  const [dynamicForm, setDynamicForm] = useState({ title: '' });
  const [dynamicResult, setDynamicResult] = useState<ReturnType<typeof parseResult> | null>(null);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">ZodDefault</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">.default()</code>{' '}
          で値が <code className="bg-gray-100 px-1 rounded">undefined</code> のときにデフォルト値を自動適用できます。
        </p>
      </div>

      {/* Basic defaults */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">基本的な .default()</h3>
        <p className="text-xs text-gray-500 mb-3">
          各型に <code className="bg-gray-100 px-1 rounded">.default()</code> を付けると、undefined のときにデフォルト値が使われます。空欄にして送信してみてください。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`z.object({
  name:   z.string().min(1),          // 必須
  role:   z.string().default('member'),
  score:  z.coerce.number().default(0),
  active: z.boolean().default(true),
})`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data: Record<string, unknown> = { name: basicForm.name };
            if (basicForm.role) data.role = basicForm.role;
            if (basicForm.score) data.score = basicForm.score;
            if (basicForm.active) data.active = basicForm.active === 'true';
            setBasicResult(parseResult(basicSchema, data));
          }}
          className="space-y-3"
        >
          <Field label="名前 (必須)" hint="z.string().min(1) — default なし">
            <input className="input" placeholder="山田 太郎" value={basicForm.name} onChange={(e) => setBasicForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="ロール" hint="z.string().default('member') — 空欄 → 'member'">
            <input className="input" placeholder="空欄 → 'member'" value={basicForm.role} onChange={(e) => setBasicForm((f) => ({ ...f, role: e.target.value }))} />
          </Field>
          <Field label="スコア" hint="z.coerce.number().default(0) — 空欄 → 0">
            <input type="number" className="input" placeholder="空欄 → 0" value={basicForm.score} onChange={(e) => setBasicForm((f) => ({ ...f, score: e.target.value }))} />
          </Field>
          <Field label="アクティブ" hint="z.boolean().default(true) — 空欄 → true">
            <select className="input" value={basicForm.active} onChange={(e) => setBasicForm((f) => ({ ...f, active: e.target.value }))}>
              <option value="">未指定 (default: true)</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={basicResult} />
      </div>

      {/* Nested object defaults */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">ネストされたオブジェクトの .default()</h3>
        <p className="text-xs text-gray-500 mb-3">
          オブジェクト全体に <code className="bg-gray-100 px-1 rounded">.default()</code> を付けると、
          オブジェクトが省略されたときにデフォルト値が使われます。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`z.object({
  user: z.object({
    name: z.string().min(1),
    settings: z.object({
      theme: z.string().default('light'),
      language: z.string().default('ja'),
      notifications: z.boolean().default(true),
    }).default({ theme: 'light', language: 'ja', notifications: true }),
  }),
})`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const settings: Record<string, unknown> = {};
            if (nestedForm.theme) settings.theme = nestedForm.theme;
            if (nestedForm.language) settings.language = nestedForm.language;
            if (nestedForm.notifications) settings.notifications = nestedForm.notifications === 'true';
            const data = {
              user: {
                name: nestedForm.name,
                ...(Object.keys(settings).length > 0 ? { settings } : {}),
              },
            };
            setNestedResult(parseResult(nestedSchema, data));
          }}
          className="space-y-3"
        >
          <Field label="名前 (必須)" hint="user.name: z.string().min(1)">
            <input className="input" placeholder="山田 太郎" value={nestedForm.name} onChange={(e) => setNestedForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <div className="pl-4 border-l-2 border-indigo-200 space-y-3">
            <p className="text-xs font-semibold text-indigo-500">settings (.default(…))</p>
            <Field label="テーマ" hint="theme: z.string().default('light')">
              <input className="input" placeholder="空欄 → 'light'" value={nestedForm.theme} onChange={(e) => setNestedForm((f) => ({ ...f, theme: e.target.value }))} />
            </Field>
            <Field label="言語" hint="language: z.string().default('ja')">
              <input className="input" placeholder="空欄 → 'ja'" value={nestedForm.language} onChange={(e) => setNestedForm((f) => ({ ...f, language: e.target.value }))} />
            </Field>
            <Field label="通知" hint="notifications: z.boolean().default(true)">
              <select className="input" value={nestedForm.notifications} onChange={(e) => setNestedForm((f) => ({ ...f, notifications: e.target.value }))}>
                <option value="">未指定 (default: true)</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={nestedResult} />
      </div>

      {/* Dynamic defaults */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.default(() =&gt; ...) — 動的デフォルト値</h3>
        <p className="text-xs text-gray-500 mb-3">
          関数を渡すと、パースのたびに動的な値が生成されます。タイムスタンプや UUID の自動生成に便利です。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`z.object({
  title:     z.string().min(1),
  createdAt: z.string().default(() => new Date().toISOString()),
  id:        z.string().default(() => crypto.randomUUID()),
})`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDynamicResult(parseResult(dynamicSchema, { title: dynamicForm.title }));
          }}
          className="space-y-3"
        >
          <Field label="タイトル (必須)" hint="z.string().min(1)">
            <input className="input" placeholder="記事タイトル" value={dynamicForm.title} onChange={(e) => setDynamicForm({ title: e.target.value })} />
          </Field>
          <p className="text-xs text-gray-400">
            ※ createdAt と id は自動生成されます。何度か送信して値が変わることを確認してください。
          </p>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={dynamicResult} />
      </div>
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
