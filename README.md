# Brewery Inventory AI

ビール原料（モルト・ホップ・イースト・副原料）向け在庫管理アプリです。Next.js + Supabase + Vertex AI(Document AI) + Cloudflare Workers を前提に構成しています。

## アーキテクチャ

- **Frontend**: Next.js (TypeScript, React)
- **Auth/DB**: Supabase Auth + PostgreSQL + RLS + Realtime
- **PDF解析**: Supabase Edge Function -> Vertex AI Document AI
- **メール送信**: Cloudflare Worker + Email Service (`env.EMAIL.send()`)
- **CI/CD**: GitHub Actions
- **Deploy**: Cloudflare Pages (frontend), Cloudflare Workers, Supabase managed

## セットアップ

```bash
npm install
cp .env.example .env.local
npm run dev
```

### `.env.local` 設定例

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
VERTEX_PROJECT_ID=your-gcp-project
VERTEX_LOCATION=asia-northeast1
VERTEX_PROCESSOR_ID=processor-id
GOOGLE_APPLICATION_CREDENTIALS_JSON={...json...}
CLOUDFLARE_ACCOUNT_ID=xxxx
CLOUDFLARE_WORKER_ORDER_MAIL_URL=https://your-worker.example.workers.dev
CLOUDFLARE_WORKER_API_TOKEN=xxxx
MAIL_FROM=orders@example.com
```

## Supabase 構成

- マイグレーション: `supabase/migrations/202604170001_init.sql`
- テーブル:
  - `materials`
  - `lots`
  - `transactions`
  - `vendors`
  - `audit_logs`
- RLS ポリシー: `auth.uid() = user_id` を基本に所有者のみアクセス。
- Realtime: `materials`, `lots`, `transactions` を publication に追加。

## 認証

- `/auth/signup`, `/auth/login`
- メール + パスワード認証。
- パスワードは Zod で 8 文字以上をバリデーション。
- JWT は `supabase.auth.getSession()` から取得可能。
- MFA は Supabase Dashboard で有効化可能（このリポジトリでは拡張ポイントを残しています）。

## 画面

- `/dashboard`: 在庫一覧、カテゴリフィルタ、しきい値アラート
- `/materials`: 原料 CRUD
- `/lots`: ロット登録
- `/transactions`: 入出庫履歴 + PDF抽出結果表示
- `/vendors`: 発注先 CRUD
- `/orders`: 発注メール送信

## PDF 処理フロー

1. PDF を Supabase Storage にアップロード。
2. Edge Function `supabase/functions/process-pdf` を起動。
3. Vertex AI Document AI で項目抽出（item, quantity, unit price, lot no）。
4. 抽出結果を JSON として `transactions` に保存。
5. ユーザー確認後、`/api/pdf-confirm` で確定保存。

## 発注メール

- Worker 実装: `worker/order-mail-worker.ts`
- `env.EMAIL.send()` を使用し、PDF(Base64) 添付に対応。
- Next.js API `POST /api/orders/send` から Worker REST API へ送信。
- Edge Function から直接 Worker REST を叩くサンプルを `process-pdf` に同梱。

## i18n

- `next-i18next` を利用。
- 翻訳ファイル:
  - `public/locales/ja/common.json`
  - `public/locales/en/common.json`

## API 仕様

- OpenAPI: `openapi.yaml`
- 主要エンドポイント:
  - `POST /api/orders/send`
  - `POST /api/pdf-confirm`

## テスト

```bash
npm run lint
npm test
npm run test:e2e
```

- Unit: Jest (`tests/auth-schema.test.ts`)
- E2E: Playwright (`tests/e2e/home.spec.ts`)

## GitHub Actions

- `.github/workflows/ci.yml`
  - lint
  - unit test
  - e2e test
  - main ブランチへの deploy (Cloudflare Pages)

## 今後の改善候補

- Supabase MFA の UI 強化
- 期限切れアラート（lot expiry）
- 在庫需要予測モデル
- Slack / Teams 通知
