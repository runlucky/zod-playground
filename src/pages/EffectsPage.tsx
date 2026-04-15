import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// .preprocess() — 入力をパース前に変換
const preprocessSchema = z.object({
  tags: z.preprocess(
    (val) => (typeof val === 'string' ? val.split(',').map((s) => s.trim()).filter(Boolean) : val),
    z.array(z.string().min(1)).min(1, '1つ以上のタグが必要です'),
  ),
  amount: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val.replace(/[¥,]/g, '')) : val),
    z.number().positive('正の数を入力してください'),
  ),
});

// .transform() chain — 複数の変換をパイプライン的に
const pipelineSchema = z.object({
  csv: z
    .string()
    .min(1, '入力は必須です')
    .transform((val) => val.split(',').map((s) => s.trim()))
    .transform((arr) => arr.filter((s) => s.length > 0))
    .transform((arr) => [...new Set(arr)])
    .transform((arr) => arr.sort()),
});

// .refine() + .transform() combination
const formSchema = z
  .object({
    price: z.coerce.number().min(0, '0以上を入力'),
    quantity: z.coerce.number().int().min(1, '1以上を入力'),
    coupon: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    subtotal: data.price * data.quantity,
    discount: data.coupon === 'SAVE10' ? 0.1 : 0,
  }))
  .refine((data) => data.subtotal > 0, {
    message: '小計は0より大きくなければなりません',
    path: ['price'],
  })
  .transform((data) => ({
    ...data,
    total: data.subtotal * (1 - data.discount),
  }));

// .pipe() — スキーマの連結
const pipeSchema = z
  .string()
  .transform((val) => {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  })
  .pipe(
    z.object({
      name: z.string().min(1, '名前は必須です'),
      age: z.number().int().min(0),
    }),
  );

export default function EffectsPage() {
  // preprocess
  const [prepForm, setPrepForm] = useState({ tags: '', amount: '' });
  const [prepResult, setPrepResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // pipeline
  const [pipelineForm, setPipelineForm] = useState({ csv: '' });
  const [pipelineResult, setPipelineResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // transform + refine
  const [formState, setFormState] = useState({ price: '', quantity: '', coupon: '' });
  const [formResult, setFormResult] = useState<ReturnType<typeof parseResult> | null>(null);

  // pipe
  const [pipeForm, setPipeForm] = useState({ json: '' });
  const [pipeResult, setPipeResult] = useState<ReturnType<typeof parseResult> | null>(null);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">ZodEffects</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">.transform()</code>、
          <code className="bg-gray-100 px-1 rounded">.refine()</code>、
          <code className="bg-gray-100 px-1 rounded">.preprocess()</code>、
          <code className="bg-gray-100 px-1 rounded">.pipe()</code>{' '}
          は内部的に <code className="bg-gray-100 px-1 rounded">ZodEffects</code> 型を生成します。
          バリデーションと変換を組み合わせた高度なスキーマを作れます。
        </p>
      </div>

      {/* preprocess */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">z.preprocess() — パース前変換</h3>
        <p className="text-xs text-gray-500 mb-3">
          バリデーション前にデータを変換します。文字列をパースして配列や数値に変換するのに便利です。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`tags: z.preprocess(
  val => typeof val === 'string'
    ? val.split(',').map(s => s.trim()) : val,
  z.array(z.string().min(1)).min(1)
)
amount: z.preprocess(
  val => Number(val.replace(/[¥,]/g, '')),
  z.number().positive()
)`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPrepResult(parseResult(preprocessSchema, { tags: prepForm.tags, amount: prepForm.amount }));
          }}
          className="space-y-3"
        >
          <Field label="タグ (カンマ区切り)" hint="文字列 → 配列に変換してからバリデーション">
            <input className="input" placeholder="react, typescript, zod" value={prepForm.tags} onChange={(e) => setPrepForm((f) => ({ ...f, tags: e.target.value }))} />
          </Field>
          <Field label="金額 (¥ やカンマ含む)" hint="'¥1,500' → 1500 に変換してからバリデーション">
            <input className="input" placeholder="¥1,500" value={prepForm.amount} onChange={(e) => setPrepForm((f) => ({ ...f, amount: e.target.value }))} />
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={prepResult} />
      </div>

      {/* transform chain */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.transform() チェーン — 段階的変換</h3>
        <p className="text-xs text-gray-500 mb-3">
          <code className="bg-gray-100 px-1 rounded">.transform()</code> を連鎖させて、段階的にデータを変換できます。
          各ステップが ZodEffects でラップされます。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`z.string()
  .transform(val => val.split(','))    // 分割
  .transform(arr => arr.filter(...))   // フィルタ
  .transform(arr => [...new Set(arr)]) // 重複除去
  .transform(arr => arr.sort())        // ソート`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPipelineResult(parseResult(pipelineSchema, { csv: pipelineForm.csv }));
          }}
          className="space-y-3"
        >
          <Field label="カンマ区切りテキスト" hint="分割 → フィルタ → 重複除去 → ソート の順に変換">
            <input className="input" placeholder="banana, apple, banana, cherry, apple" value={pipelineForm.csv} onChange={(e) => setPipelineForm({ csv: e.target.value })} />
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={pipelineResult} />
      </div>

      {/* transform + refine combined */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.transform() + .refine() — 変換とバリデーションの組み合わせ</h3>
        <p className="text-xs text-gray-500 mb-3">
          transform で計算フィールドを追加し、refine で計算結果をバリデーションする実践的なパターンです。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`z.object({ price, quantity, coupon })
  .transform(d => ({ ...d, subtotal: d.price * d.quantity }))
  .refine(d => d.subtotal > 0)
  .transform(d => ({ ...d, total: d.subtotal * (1 - discount) }))`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFormResult(parseResult(formSchema, {
              price: formState.price,
              quantity: formState.quantity,
              coupon: formState.coupon || undefined,
            }));
          }}
          className="space-y-3"
        >
          <Field label="単価" hint="z.coerce.number().min(0)">
            <input type="number" className="input" placeholder="1000" value={formState.price} onChange={(e) => setFormState((f) => ({ ...f, price: e.target.value }))} />
          </Field>
          <Field label="数量" hint="z.coerce.number().int().min(1)">
            <input type="number" className="input" placeholder="3" value={formState.quantity} onChange={(e) => setFormState((f) => ({ ...f, quantity: e.target.value }))} />
          </Field>
          <Field label="クーポンコード" hint="'SAVE10' で 10% 割引">
            <input className="input" placeholder="SAVE10" value={formState.coupon} onChange={(e) => setFormState((f) => ({ ...f, coupon: e.target.value }))} />
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={formResult} />
      </div>

      {/* pipe */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">.pipe() — スキーマの連結</h3>
        <p className="text-xs text-gray-500 mb-3">
          <code className="bg-gray-100 px-1 rounded">.pipe()</code> を使うと、あるスキーマの出力を別のスキーマの入力として連結できます。
          JSON 文字列をパースしてからオブジェクトスキーマで検証するパターンが典型的です。
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-xs text-gray-700 block whitespace-pre">{`z.string()
  .transform(val => JSON.parse(val))
  .pipe(z.object({ name: z.string(), age: z.number() }))`}</code>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPipeResult(parseResult(pipeSchema, pipeForm.json));
          }}
          className="space-y-3"
        >
          <Field label="JSON 文字列" hint="JSON.parse → z.object() で検証">
            <textarea
              className="input min-h-[80px] font-mono text-sm"
              placeholder='{"name": "太郎", "age": 25}'
              value={pipeForm.json}
              onChange={(e) => setPipeForm({ json: e.target.value })}
            />
          </Field>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={pipeResult} />
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
