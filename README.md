# Zod Playground

Zodライブラリの各機能を体験できるサンプルWebアプリです。

## スクリーンショット

### ホーム画面
![Home](https://github.com/user-attachments/assets/25ef6dfc-3670-4cdb-bc15-f0d3314a698b)

### 文字列バリデーション
![String Validation](https://github.com/user-attachments/assets/be8f70d9-41fc-4c37-a5aa-fba4de7caa55)

## 技術スタック

- **React** + **TypeScript**
- **TailwindCSS** (via `@tailwindcss/vite`)
- **Zod v4**
- **React Router DOM**
- **Vite**

## 機能一覧

| ページ | 学べる内容 |
|--------|-----------|
| 文字列バリデーション | `z.string()` の min / max / email / url / regex |
| 数値バリデーション | `z.number()` / `z.coerce.number()` の min / max / int / positive |
| オブジェクト | `z.object()` のネスト構造・エラーパス |
| 配列 | `z.array()` の要素スキーマ・長さ制約 |
| Union型 | `z.union()` と `z.discriminatedUnion()` |
| Optional / Nullable | `.optional()` / `.nullable()` / `.default()` の違い |
| Enum | `z.enum()` と `z.nativeEnum()` |
| Transform & Refine | `.transform()` / `.refine()` / `.superRefine()` |

各ページにはフォームと送信ボタンがあり、送信ボタンを押すと実際の通信は行わずZodによるバリデーション結果がJSON形式で画面に表示されます。

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```
