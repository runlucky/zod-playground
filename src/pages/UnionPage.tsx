import { useState } from 'react';
import { z } from 'zod';
import ResultPanel from '../components/ResultPanel';
import { parseResult } from '../utils/parseResult';

// z.union
const contactSchema = z.union([
  z.object({ type: z.literal('email'), value: z.string().email('有効なメールアドレス') }),
  z.object({ type: z.literal('phone'), value: z.string().regex(/^\d{10,11}$/, '10〜11桁の数字') }),
  z.object({ type: z.literal('fax'), value: z.string().regex(/^\d{10,11}$/, '10〜11桁の数字') }),
]);

// z.discriminatedUnion
const shapeSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('circle'), radius: z.coerce.number().positive('正の数') }),
  z.object({ kind: z.literal('rectangle'), width: z.coerce.number().positive('正の数'), height: z.coerce.number().positive('正の数') }),
  z.object({ kind: z.literal('triangle'), base: z.coerce.number().positive('正の数'), height: z.coerce.number().positive('正の数') }),
]);

export default function UnionPage() {
  const [contactType, setContactType] = useState<'email' | 'phone' | 'fax'>('email');
  const [contactValue, setContactValue] = useState('');
  const [contactResult, setContactResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const [shapeKind, setShapeKind] = useState<'circle' | 'rectangle' | 'triangle'>('circle');
  const [shapeFields, setShapeFields] = useState({ radius: '', width: '', height: '', base: '' });
  const [shapeResult, setShapeResult] = useState<ReturnType<typeof parseResult> | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactResult(parseResult(contactSchema, { type: contactType, value: contactValue }));
  };

  const handleShapeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data =
      shapeKind === 'circle'
        ? { kind: shapeKind, radius: shapeFields.radius }
        : shapeKind === 'rectangle'
        ? { kind: shapeKind, width: shapeFields.width, height: shapeFields.height }
        : { kind: shapeKind, base: shapeFields.base, height: shapeFields.height };
    setShapeResult(parseResult(shapeSchema, data));
  };

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Union型</h2>
        <p className="text-gray-500 text-sm">
          <code className="bg-gray-100 px-1 rounded">z.union()</code> と{' '}
          <code className="bg-gray-100 px-1 rounded">z.discriminatedUnion()</code> を試せます。
        </p>
      </div>

      {/* z.union */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">z.union — 連絡先</h3>
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">連絡手段</label>
            <select
              className="input"
              value={contactType}
              onChange={(e) => setContactType(e.target.value as typeof contactType)}
            >
              <option value="email">メール</option>
              <option value="phone">電話</option>
              <option value="fax">FAX</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              値{' '}
              <code className="text-xs text-indigo-600">
                {contactType === 'email' ? 'z.string().email()' : 'z.string().regex(/^\\d{10,11}$/)'}
              </code>
            </label>
            <input
              className="input"
              placeholder={contactType === 'email' ? 'user@example.com' : '09012345678'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={contactResult} />
      </div>

      {/* z.discriminatedUnion */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">z.discriminatedUnion — 図形</h3>
        <form onSubmit={handleShapeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">図形の種類 (kind)</label>
            <select
              className="input"
              value={shapeKind}
              onChange={(e) => setShapeKind(e.target.value as typeof shapeKind)}
            >
              <option value="circle">円 (circle)</option>
              <option value="rectangle">長方形 (rectangle)</option>
              <option value="triangle">三角形 (triangle)</option>
            </select>
          </div>

          {shapeKind === 'circle' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5">半径</label>
              <code className="text-xs text-indigo-600 mb-1 block">radius: z.coerce.number().positive()</code>
              <input type="number" step="any" className="input" placeholder="5" value={shapeFields.radius} onChange={(e) => setShapeFields((s) => ({ ...s, radius: e.target.value }))} />
            </div>
          )}
          {(shapeKind === 'rectangle' || shapeKind === 'triangle') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">
                  {shapeKind === 'rectangle' ? '幅 (width)' : '底辺 (base)'}
                </label>
                <code className="text-xs text-indigo-600 mb-1 block">z.coerce.number().positive()</code>
                <input
                  type="number"
                  step="any"
                  className="input"
                  placeholder="10"
                  value={shapeKind === 'rectangle' ? shapeFields.width : shapeFields.base}
                  onChange={(e) =>
                    setShapeFields((s) => ({
                      ...s,
                      [shapeKind === 'rectangle' ? 'width' : 'base']: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-0.5">高さ (height)</label>
                <code className="text-xs text-indigo-600 mb-1 block">z.coerce.number().positive()</code>
                <input type="number" step="any" className="input" placeholder="5" value={shapeFields.height} onChange={(e) => setShapeFields((s) => ({ ...s, height: e.target.value }))} />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary w-full">送信</button>
        </form>
        <ResultPanel result={shapeResult} />
      </div>
    </div>
  );
}
