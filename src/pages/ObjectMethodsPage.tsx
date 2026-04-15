import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// Base schema
const baseSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  age: z.coerce.number().int().min(0),
});

// .extend()
const extendedSchema = baseSchema.extend({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

// .pick()
const pickedSchema = baseSchema.pick({ name: true });

// .omit()
const omittedSchema = extendedSchema.omit({ age: true });

// .partial()
const partialSchema = baseSchema.partial();

// .passthrough()
const passthroughSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
}).passthrough();

// .strict()
const strictSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
}).strict();

export default function ObjectMethodsPage() {
  // extend
  const [extForm, setExtForm] = useState({ name: '', age: '', email: '' });
  const [extResult, setExtResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // pick
  const [pickForm, setPickForm] = useState({ name: '' });
  const [pickResult, setPickResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // omit
  const [omitForm, setOmitForm] = useState({ name: '', email: '' });
  const [omitResult, setOmitResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // partial
  const [partialForm, setPartialForm] = useState({ name: '', age: '' });
  const [partialResult, setPartialResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // passthrough / strict
  const [extraForm, setExtraForm] = useState({ name: '', extra: '' });
  const [passthroughResult, setPassthroughResult] = useState<ReturnType<typeof parseResult> | null>(null);
  const [strictResult, setStrictResult] = useState<ReturnType<typeof parseResult> | null>(null);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">ZodObject メソッド</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">z.object()</code>{' '}
          のスキーマ操作メソッドを試せます。既存スキーマの加工・拡張ができます。
        </p>
      </div>

      {/* extend */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.extend() — プロパティ追加</h3>
        <p className="text-xs text-gray-500 mb-3">
          既存の <code className="bg-gray-100 px-1 rounded">z.object()</code> にフィールドを追加した新しいスキーマを作成します。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`const base = z.object({ name: z.string(), age: z.number() })
const extended = base.extend({ email: z.string().email() })`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setExtResult(parseResult(extendedSchema, { name: extForm.name, age: extForm.age, email: extForm.email }));
          }}
          className="space-y-3"
        >
          <Field label="名前" hint="name: z.string().min(1)">
            <input className="input" placeholder="山田 太郎" value={extForm.name} onChange={(e) => setExtForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="年齢" hint="age: z.coerce.number().int().min(0)">
            <input type="number" className="input" placeholder="30" value={extForm.age} onChange={(e) => setExtForm((f) => ({ ...f, age: e.target.value }))} />
          </Field>
          <Field label="メール (追加)" hint="email: z.string().email()">
            <input className="input" placeholder="user@example.com" value={extForm.email} onChange={(e) => setExtForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={extResult} />
      </div>

      {/* pick / omit */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.pick() / .omit() — プロパティ選択・除外</h3>
        <p className="text-xs text-gray-500 mb-3">
          TypeScript の <code className="bg-gray-100 px-1 rounded">Pick</code> / <code className="bg-gray-100 px-1 rounded">Omit</code> のように、必要なフィールドだけを選択・除外できます。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`base.pick({ name: true })        // { name: string }
extended.omit({ age: true })     // { name: string; email: string }`}</code>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* pick */}
          <div>
            <p className="text-sm font-semibold text-indigo-600 mb-2">.pick({'{ name: true }'})</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPickResult(parseResult(pickedSchema, { name: pickForm.name }));
              }}
              className="space-y-3"
            >
              <Field label="名前" hint="name のみ">
                <input className="input" placeholder="山田 太郎" value={pickForm.name} onChange={(e) => setPickForm({ name: e.target.value })} />
              </Field>
              <button type="submit" className="btn-primary w-full text-sm">送信 (pick)</button>
            </form>
            <ResultPanel result={pickResult} />
          </div>

          {/* omit */}
          <div>
            <p className="text-sm font-semibold text-indigo-600 mb-2">.omit({'{ age: true }'})</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setOmitResult(parseResult(omittedSchema, { name: omitForm.name, email: omitForm.email }));
              }}
              className="space-y-3"
            >
              <Field label="名前" hint="name">
                <input className="input" placeholder="山田 太郎" value={omitForm.name} onChange={(e) => setOmitForm((f) => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label="メール" hint="email">
                <input className="input" placeholder="a@b.com" value={omitForm.email} onChange={(e) => setOmitForm((f) => ({ ...f, email: e.target.value }))} />
              </Field>
              <button type="submit" className="btn-primary w-full text-sm">送信 (omit)</button>
            </form>
            <ResultPanel result={omitResult} />
          </div>
        </div>
      </div>

      {/* partial */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.partial() — 全フィールドをオプショナルに</h3>
        <p className="text-xs text-gray-500 mb-3">
          TypeScript の <code className="bg-gray-100 px-1 rounded">Partial&lt;T&gt;</code> のように、すべてのフィールドが省略可能になります。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`base.partial()
// => { name?: string; age?: number }`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data: Record<string, unknown> = {};
            if (partialForm.name) data.name = partialForm.name;
            if (partialForm.age) data.age = partialForm.age;
            setPartialResult(parseResult(partialSchema, data));
          }}
          className="space-y-3"
        >
          <Field label="名前 (省略可)" hint="name?: string">
            <input className="input" placeholder="空欄でも OK" value={partialForm.name} onChange={(e) => setPartialForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="年齢 (省略可)" hint="age?: number">
            <input type="number" className="input" placeholder="空欄でも OK" value={partialForm.age} onChange={(e) => setPartialForm((f) => ({ ...f, age: e.target.value }))} />
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={partialResult} />
      </div>

      {/* passthrough vs strict */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.passthrough() / .strict() — 未知のキーの扱い</h3>
        <p className="text-xs text-gray-500 mb-3">
          <code className="bg-gray-100 px-1 rounded">.passthrough()</code> は未知のキーを保持、
          <code className="bg-gray-100 px-1 rounded">.strict()</code> は未知のキーがあるとエラーになります。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`schema.passthrough()  // 未知のキーを通す
schema.strict()       // 未知のキーでエラー`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data: Record<string, unknown> = { name: extraForm.name };
            if (extraForm.extra) data.extraField = extraForm.extra;
            setPassthroughResult(parseResult(passthroughSchema, data));
            setStrictResult(parseResult(strictSchema, data));
          }}
          className="space-y-3"
        >
          <Field label="名前" hint="name: z.string().min(1)">
            <input className="input" placeholder="山田 太郎" value={extraForm.name} onChange={(e) => setExtraForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="追加フィールド (スキーマ未定義)" hint="extraField — スキーマに無いキー">
            <input className="input" placeholder="何か入力すると動作の違いがわかります" value={extraForm.extra} onChange={(e) => setExtraForm((f) => ({ ...f, extra: e.target.value }))} />
          </Field>
          <button type="submit" className="btn-primary w-full">両方で送信</button>
        </form>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-semibold text-green-600 mb-1">.passthrough()</p>
            <ResultPanel result={passthroughResult} />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-600 mb-1">.strict()</p>
            <ResultPanel result={strictResult} />
          </div>
        </div>
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
