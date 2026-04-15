import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'ホーム' },
  { path: '/string', label: '文字列バリデーション' },
  { path: '/number', label: '数値バリデーション' },
  { path: '/object', label: 'オブジェクト' },
  { path: '/object-methods', label: 'Object メソッド' },
  { path: '/array', label: '配列' },
  { path: '/union', label: 'Union型' },
  { path: '/optional', label: 'Optional / Nullable' },
  { path: '/enum', label: 'Enum' },
  { path: '/transform', label: 'Transform & Refine' },
  { path: '/default', label: 'Default' },
  { path: '/effects', label: 'ZodEffects' },
  { path: '/intersection', label: 'Intersection' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <nav className="w-60 bg-indigo-700 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-indigo-600">
          <h1 className="text-xl font-bold">⚡ Zod Playground</h1>
          <p className="text-indigo-300 text-xs mt-1">Zodを学ぶサンプルアプリ</p>
        </div>
        <ul className="flex-1 py-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block px-6 py-2.5 text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-900 text-white font-semibold'
                    : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
