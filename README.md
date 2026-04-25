# brewery-inventory-ai-

樽（KEG）管理のためのWebサイトとスマホアプリのプロトタイプです。

## 構成

- `apps/web`: 在庫の登録・一覧表示・削除ができるシンプルな管理サイト（Vanilla JS）。
- `apps/mobile`: 検索とステータス切り替えができるReact Native（Expo想定）アプリ。
- `shared/domain.ts`: Web/モバイル共通のドメインモデル。
- `api/openapi.yaml`: 今後バックエンド実装を行うためのAPI契約。

## Webアプリ起動（簡易）

`apps/web` 配下を静的サーバーで配信してください。

例:

```bash
cd apps/web
python3 -m http.server 4173
```

ブラウザで `http://localhost:4173` を開くと利用できます。

## モバイルアプリ起動（Expo）

Expoプロジェクトに `apps/mobile/App.tsx` を配置して起動してください。

## 今後の拡張案

1. APIサーバー実装（認証/ロール管理）。
2. QRコードで樽IDをスキャン登録。
3. 店舗・取引先ごとの返却期限アラート。
