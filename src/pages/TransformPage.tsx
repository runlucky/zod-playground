import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// .transform() example
const transformSchema = z.object({
  username: z
    .string()
    .min(3, '3文字以上で入力してください')
    .transform((val) => val.toLowerCase().trim()),
  birthYear: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .transform((year) => new Date().getFullYear() - year),
});

// .refine() example
const passwordSchema = z
  .object({
    password: z.string().min(8, 'パスワードは8文字以上'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// .superRefine() example
const creditCardSchema = z
  .object({
    cardNumber: z.string().regex(/^\d{16}$/, '16桁の数字を入力してください'),
    expiryMonth: z.coerce.number().int().min(1).max(12),
    expiryYear: z.coerce.number().int().min(new Date().getFullYear()),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    if (
      data.expiryYear === now.getFullYear() &&
      data.expiryMonth < now.getMonth() + 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'カードの有効期限が切れています',
        path: ['expiryMonth'],
      });
    }
  });

export default function TransformPage() {
  const [transformForm, setTransformForm] = useState({ username: '', birthYear: '' });
  const [transformResult, setTransformResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const [pwForm, setPwForm] = useState({ password: '', confirmPassword: '' });
  const [pwResult, setPwResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const [cardForm, setCardForm] = useState({ cardNumber: '', expiryMonth: '', expiryYear: '' });
  const [cardResult, setCardResult] = useState<ReturnType<typeof parseResult> | null>(null);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Transform & Refine</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">.transform()</code>{' '}
          でデータ変換、
          <code className="bg-gray-100 px-1 rounded">.refine()</code> /
          <code className="bg-gray-100 px-1 rounded">.superRefine()</code>{' '}
          でカスタムバリデーションを試せます。
        </p>
      </div>

      {/* transform */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">.transform() — データ変換</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTransformResult(parseResult(transformSchema, transformForm));
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">ユーザー名</label>
            <code className="text-xs text-indigo-600 mb-1 block">
              z.string().min(3).transform(v =&gt; v.toLowerCase().trim())
            </code>
            <input
              className="input"
              placeholder="ABC DEF (小文字+trimに変換)"
              value={transformForm.username}
              onChange={(e) => setTransformForm((f) => ({ ...f, username: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">生まれ年 → 年齢に変換</label>
            <code className="text-xs text-indigo-600 mb-1 block">
              z.coerce.number().transform(y =&gt; currentYear - y)
            </code>
            <input
              type="number"
              className="input"
              placeholder="1990"
              value={transformForm.birthYear}
              onChange={(e) => setTransformForm((f) => ({ ...f, birthYear: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={transformResult} />
      </div>

      {/* refine */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">.refine() — パスワード確認</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPwResult(parseResult(passwordSchema, pwForm));
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">パスワード</label>
            <code className="text-xs text-indigo-600 mb-1 block">z.string().min(8)</code>
            <input
              type="password"
              className="input"
              placeholder="8文字以上"
              value={pwForm.password}
              onChange={(e) => setPwForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">パスワード確認</label>
            <code className="text-xs text-indigo-600 mb-1 block">
              .refine(d =&gt; d.password === d.confirmPassword)
            </code>
            <input
              type="password"
              className="input"
              placeholder="同じパスワードを入力"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={pwResult} />
      </div>

      {/* superRefine */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">.superRefine() — クレジットカード有効期限</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCardResult(parseResult(creditCardSchema, cardForm));
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0.5">カード番号</label>
            <code className="text-xs text-indigo-600 mb-1 block">z.string().regex(/^\d{16}$/)</code>
            <input
              className="input"
              placeholder="1234567890123456"
              maxLength={16}
              value={cardForm.cardNumber}
              onChange={(e) => setCardForm((f) => ({ ...f, cardNumber: e.target.value }))}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-0.5">有効月 (1〜12)</label>
              <input
                type="number"
                className="input"
                placeholder="12"
                value={cardForm.expiryMonth}
                onChange={(e) => setCardForm((f) => ({ ...f, expiryMonth: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-0.5">有効年</label>
              <input
                type="number"
                className="input"
                placeholder={String(new Date().getFullYear())}
                value={cardForm.expiryYear}
                onChange={(e) => setCardForm((f) => ({ ...f, expiryYear: e.target.value }))}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={cardResult} />
      </div>
    </div>
  );
}
