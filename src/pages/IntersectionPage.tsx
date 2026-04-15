import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// Basic intersection: two objects merged
const personSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  age: z.coerce.number().int().min(0),
});

const contactSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  phone: z.string().regex(/^\d{2,4}-\d{2,4}-\d{4}$/, '電話番号の形式: 000-0000-0000'),
});

// z.intersection()
const personContactSchema = z.intersection(personSchema, contactSchema);

// .and() — same as z.intersection() but chainable
const employeeSchema = personSchema.and(contactSchema).and(
  z.object({
    department: z.string().min(1, '部署は必須です'),
    employeeId: z.string().regex(/^EMP-\d{4}$/, 'EMP-0000 形式で入力してください'),
  }),
);

// Intersection with different types (object + refinement)
const rangeSchema = z.object({
  min: z.coerce.number(),
  max: z.coerce.number(),
});

const validRangeSchema = rangeSchema.and(
  z.object({
    min: z.number(),
    max: z.number(),
  }).refine((data) => data.min <= data.max, {
    message: 'min は max 以下にしてください',
    path: ['min'],
  }),
);

export default function IntersectionPage() {
  // basic intersection
  const [basicForm, setBasicForm] = useState({ name: '', age: '', email: '', phone: '' });
  const [basicResult, setBasicResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // chained .and()
  const [empForm, setEmpForm] = useState({ name: '', age: '', email: '', phone: '', department: '', employeeId: '' });
  const [empResult, setEmpResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // intersection with refine
  const [rangeForm, setRangeForm] = useState({ min: '', max: '' });
  const [rangeResult, setRangeResult] = useState<ReturnType<typeof parseResult> | null>(null);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">ZodIntersection</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">z.intersection()</code> /
          <code className="bg-gray-100 px-1 rounded">.and()</code>{' '}
          で複数のスキーマを合成できます。TypeScript の{' '}
          <code className="bg-gray-100 px-1 rounded">A &amp; B</code> に相当します。
        </p>
      </div>

      {/* Basic intersection */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">z.intersection() — 2 つのスキーマを合成</h3>
        <p className="text-xs text-gray-500 mb-3">
          独立して定義した 2 つのオブジェクトスキーマを合成し、両方のプロパティを持つスキーマを作成します。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`const person  = z.object({ name: z.string(), age: z.number() })
const contact = z.object({ email: z.string().email(), phone: z.string() })

const personContact = z.intersection(person, contact)
// => { name, age, email, phone } すべて必須`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setBasicResult(parseResult(personContactSchema, {
              name: basicForm.name,
              age: basicForm.age,
              email: basicForm.email,
              phone: basicForm.phone,
            }));
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-indigo-500">person スキーマ</p>
              <Field label="名前" hint="name: z.string().min(1)">
                <input className="input" placeholder="山田 太郎" value={basicForm.name} onChange={(e) => setBasicForm((f) => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label="年齢" hint="age: z.coerce.number()">
                <input type="number" className="input" placeholder="30" value={basicForm.age} onChange={(e) => setBasicForm((f) => ({ ...f, age: e.target.value }))} />
              </Field>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-indigo-500">contact スキーマ</p>
              <Field label="メール" hint="email: z.string().email()">
                <input className="input" placeholder="a@b.com" value={basicForm.email} onChange={(e) => setBasicForm((f) => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field label="電話" hint="phone: z.string().regex(...)">
                <input className="input" placeholder="03-1234-5678" value={basicForm.phone} onChange={(e) => setBasicForm((f) => ({ ...f, phone: e.target.value }))} />
              </Field>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={basicResult} />
      </div>

      {/* Chained .and() */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.and() チェーン — 3 つ以上のスキーマを合成</h3>
        <p className="text-xs text-gray-500 mb-3">
          <code className="bg-gray-100 px-1 rounded">.and()</code> をチェーンすることで、3 つ以上のスキーマを合成できます。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`person
  .and(contact)
  .and(z.object({
    department: z.string().min(1),
    employeeId: z.string().regex(/^EMP-\\d{4}$/),
  }))`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmpResult(parseResult(employeeSchema, {
              name: empForm.name,
              age: empForm.age,
              email: empForm.email,
              phone: empForm.phone,
              department: empForm.department,
              employeeId: empForm.employeeId,
            }));
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-indigo-500">person</p>
              <Field label="名前" hint="name">
                <input className="input" placeholder="山田 太郎" value={empForm.name} onChange={(e) => setEmpForm((f) => ({ ...f, name: e.target.value }))} />
              </Field>
              <Field label="年齢" hint="age">
                <input type="number" className="input" placeholder="30" value={empForm.age} onChange={(e) => setEmpForm((f) => ({ ...f, age: e.target.value }))} />
              </Field>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-indigo-500">contact</p>
              <Field label="メール" hint="email">
                <input className="input" placeholder="a@b.com" value={empForm.email} onChange={(e) => setEmpForm((f) => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field label="電話" hint="phone">
                <input className="input" placeholder="03-1234-5678" value={empForm.phone} onChange={(e) => setEmpForm((f) => ({ ...f, phone: e.target.value }))} />
              </Field>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-indigo-500">employee</p>
              <Field label="部署" hint="department">
                <input className="input" placeholder="開発部" value={empForm.department} onChange={(e) => setEmpForm((f) => ({ ...f, department: e.target.value }))} />
              </Field>
              <Field label="社員ID" hint="EMP-0000">
                <input className="input" placeholder="EMP-1234" value={empForm.employeeId} onChange={(e) => setEmpForm((f) => ({ ...f, employeeId: e.target.value }))} />
              </Field>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={empResult} />
      </div>

      {/* Intersection with refine */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.and() + .refine() — 合成後にカスタムバリデーション</h3>
        <p className="text-xs text-gray-500 mb-3">
          <code className="bg-gray-100 px-1 rounded">.and()</code> でスキーマを合成し、
          <code className="bg-gray-100 px-1 rounded">.refine()</code> でフィールド間の関係をバリデーションします。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`const range = z.object({ min: z.number(), max: z.number() })

range.and(
  z.object({ min: z.number(), max: z.number() })
    .refine(d => d.min <= d.max, { message: 'min ≤ max' })
)`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setRangeResult(parseResult(validRangeSchema, {
              min: rangeForm.min,
              max: rangeForm.max,
            }));
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="最小値" hint="min: z.coerce.number()">
              <input type="number" className="input" placeholder="10" value={rangeForm.min} onChange={(e) => setRangeForm((f) => ({ ...f, min: e.target.value }))} />
            </Field>
            <Field label="最大値" hint="max: z.coerce.number()">
              <input type="number" className="input" placeholder="100" value={rangeForm.max} onChange={(e) => setRangeForm((f) => ({ ...f, max: e.target.value }))} />
            </Field>
          </div>
          <p className="text-xs text-gray-400">※ min &gt; max にするとバリデーションエラーになります。</p>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={rangeResult} />
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
