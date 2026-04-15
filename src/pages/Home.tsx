import { Link } from 'react-router-dom';

const features = [
  {
    path: '/string',
    title: '文字列バリデーション',
    description: 'min / max / email / url / regex など文字列の各種バリデーション',
    icon: '🔤',
  },
  {
    path: '/number',
    title: '数値バリデーション',
    description: 'min / max / int / positive / negative など数値の各種バリデーション',
    icon: '🔢',
  },
  {
    path: '/object',
    title: 'オブジェクト',
    description: 'ネストしたオブジェクトのスキーマ定義とバリデーション',
    icon: '📦',
  },
  {
    path: '/array',
    title: '配列',
    description: '要素のスキーマ・min / max 長さのバリデーション',
    icon: '📋',
  },
  {
    path: '/union',
    title: 'Union型',
    description: 'z.union と z.discriminatedUnion による複合型バリデーション',
    icon: '🔀',
  },
  {
    path: '/optional',
    title: 'Optional / Nullable',
    description: '.optional() / .nullable() / .default() の違いを体験',
    icon: '❓',
  },
  {
    path: '/enum',
    title: 'Enum',
    description: 'z.enum と z.nativeEnum による列挙型バリデーション',
    icon: '📌',
  },
  {
    path: '/transform',
    title: 'Transform & Refine',
    description: '.transform() でデータ変換、.refine() でカスタムバリデーション',
    icon: '⚙️',
  },
  {
    path: '/object-methods',
    title: 'Object メソッド',
    description: '.extend() / .pick() / .omit() / .partial() / .passthrough() / .strict()',
    icon: '🔧',
  },
  {
    path: '/default',
    title: 'Default',
    description: '.default() でデフォルト値の自動適用・動的生成を体験',
    icon: '🏷️',
  },
  {
    path: '/effects',
    title: 'ZodEffects',
    description: '.preprocess() / .pipe() / .transform() チェーンなど高度な変換',
    icon: '🔄',
  },
  {
    path: '/intersection',
    title: 'Intersection',
    description: 'z.intersection() / .and() で複数スキーマの合成',
    icon: '🔗',
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Zod Playground</h2>
        <p className="text-gray-500 mt-2">
          各カードをクリックして Zod の機能を試してみましょう。
          フォームを送信するとバリデーション結果が JSON で表示されます。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <Link
            key={f.path}
            to={f.path}
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600">
              {f.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{f.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
