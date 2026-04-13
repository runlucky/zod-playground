interface ResultPanelProps {
  result: { success: boolean; data?: unknown; errors?: { path: string; message: string }[] } | null;
}

export default function ResultPanel({ result }: ResultPanelProps) {
  if (!result) return null;

  return (
    <div className="mt-6">
      {result.success ? (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4">
          <p className="text-green-700 font-semibold mb-2">✅ バリデーション成功 — 送信データ (JSON)</p>
          <pre className="text-sm text-green-900 bg-green-100 rounded p-3 overflow-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-red-700 font-semibold mb-2">❌ バリデーションエラー</p>
          <ul className="space-y-1">
            {result.errors?.map((e, i) => (
              <li key={i} className="text-sm text-red-800">
                <span className="font-mono bg-red-100 px-1 rounded">{e.path || '(root)'}</span>
                {' '}{e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
