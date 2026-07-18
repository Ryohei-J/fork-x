# Vercel → Cloudflare Pages 移行計画

このアプリは静的サイト（クライアントサイド完結・APIルート/middlewareなし）のため、移行のハードルは低い。方式は **Next.jsの静的出力（`output: "export"`）+ Cloudflare Pages** を採用する（`@cloudflare/next-on-pages` によるWorkers上でのNext.js実行は、サーバーを持たないという設計方針に対して過剰なので不採用）。

## 前提・現状確認済みの内容

- `next/image`・`@vercel/*`パッケージ・middleware・APIルートは未使用
- `next/font/google`（Geist）はビルド時にフォントを取得するだけなので静的出力でも問題なし
- `vercel.json`なし（リダイレクト等の移植対象なし）
- 現在: GitHubの`main`へのpush → Vercel自動デプロイ（本番: https://fork-x.vercel.app）

## 懸念・確認ポイント（事前に潰しておくべき点）

- [ ] **静的出力との互換性チェック**: `output: "export"`にすると、動的レンダリングが必要な機能（`generateStaticParams`が必要な動的ルート、Route Handlers等）はビルドエラーになる。現状使っていないはずだが、`pnpm build`で実際に確認する。
- [ ] **末尾スラッシュ・ルーティングの挙動差**: 静的ホスティングでは`/foo`と`/foo/`の扱いがVercelと微妙に異なる場合がある。ページ数が少ないので影響は小さい想定だが、デプロイ後に主要ページの直リンクアクセスを確認する。
- [ ] **独自ドメインの有無**: 現状`fork-x.vercel.app`のVercelサブドメインのみ使用。独自ドメインを設定していないなら、Cloudflare側では新しい`*.pages.dev`のURLになる（後述の移行手順を参照）。
- [ ] **Vercelの解約タイミング**: 動作確認が終わるまでVercelのデプロイは残しておき、Cloudflare側で問題ないことを確認してから停止する（ロールバック手段を残すため）。
- [ ] **Cloudflareアカウントの要否**: 未保有の場合はアカウント作成が必要（人がやる作業）。
- [x] **`robots.ts`/`sitemap.ts`の静的出力対応**: `output: "export"`にすると`generateStaticParams`のない動的メタルート（`/robots.txt`・`/sitemap.xml`）はそのままではビルドエラーになる。両ファイルに`export const dynamic = "force-static"`を追加して解消済み（フェーズ1で対応）。
- [ ] **`sitemap.ts`/`robots.ts`にハードコードされた本番URL**: `src/app/sitemap.ts`の`BASE_URL`と`src/app/robots.ts`内のsitemap URLが`https://fork-x.vercel.app`に固定されている。独自ドメインまたは新しい`*.pages.dev`のURLに切り替える際は、この2箇所を更新し忘れないこと（フェーズ5で本番URLが確定した時点で対応）。
- [ ] **JSハイドレーション後の実動作確認**: ローカルで`serve out`により静的HTML配信・アセット参照までは確認済みだが、ブラウザでのJS実行（フォーム入力→計算結果表示などのクライアントサイド動作）は自動化ツールがなく未確認。人がブラウザで実際に操作して確認する必要がある。

## 移行手順

### フェーズ1: ローカルでの静的出力対応（Claude）

1. `next.config.ts`に`output: "export"`を追加
2. `pnpm build`を実行し、`/out`ディレクトリが生成されエラーが出ないことを確認
3. `pnpm dlx serve out`等でローカルの静的ファイルを配信し、主要な画面（入力→計算結果表示）が問題なく動くか確認
4. 問題があれば（動的機能への依存など）修正

### フェーズ2: Cloudflareアカウント・プロジェクトの準備（人）

1. Cloudflareアカウントを作成（未保有の場合）
2. Cloudflareダッシュボード → Workers & Pages → 「Pages」からプロジェクトを作成
3. GitHubリポジトリ（`fork-x`）と連携を許可（Cloudflareからのアクセス許可はGitHub側の操作が必要）

### フェーズ3: ビルド設定（人、Cloudflareダッシュボード上）

以下をCloudflare Pagesのプロジェクト設定に入力:

- ビルドコマンド: `pnpm build`
- 出力ディレクトリ: `out`
- ルートディレクトリ: リポジトリ直下（変更不要）
- 環境変数: Node.jsバージョン・pnpm使用の指定が必要な場合はここで設定（要確認、下記参照）

### フェーズ4: デプロイ確認（人 + Claude）

1. Cloudflareが自動的に最初のデプロイを実行 → 発行された`*.pages.dev`のURLで動作確認（人が実際にブラウザで操作、Claudeは必要ならビルドログのエラー調査を手伝う）
2. 主要な入力パターン（正社員/フリーランス、年収・月給切り替え、扶養人数、青色/白色申告など）でVercel版と表示が一致するか比較確認
3. スマホ表示の確認（TODO.mdに既存の未対応タスクとしても記載あり、移行のついでに崩れがないかは見ておく）

### フェーズ5: 本番切り替え（人）

1. 独自ドメインを使う場合はCloudflare Pagesにカスタムドメインを設定し、DNSを向き先変更
2. `README.md`の本番URL記載を更新（Claudeに依頼可）
3. 問題なければVercel側のプロジェクトを削除 or 自動デプロイを無効化

## 作業分担まとめ

| フェーズ | 人 | Claude |
|---|---|---|
| 1. 静的出力対応 | - | 設定変更・ビルド確認・修正 |
| 2. アカウント/プロジェクト作成 | Cloudflareアカウント作成、GitHub連携の許可 | - |
| 3. ビルド設定入力 | ダッシュボードでの設定入力 | 設定値の確認・提示 |
| 4. デプロイ確認 | 実ブラウザでの動作確認 | ビルドエラー調査・修正 |
| 5. 本番切り替え | DNS設定、Vercel停止判断 | README更新 |

## 未確定で要確認な事項

- 独自ドメインを新規に取得・設定する予定があるかどうか（現状Vercelサブドメインのみなので、方針次第で手順3が変わる）

## 実際に遭遇した問題と対応（フェーズ2・3実施時）

- [x] **`pnpm install --frozen-lockfile`が`ERROR packages field missing or empty`で失敗**: `pnpm-workspace.yaml`が`ignoredBuiltDependencies`のみを記載した状態（`packages`フィールドなし）で存在しており、Cloudflareのビルド環境のpnpmがこれを「空のworkspace定義」とみなしてエラーになった。ローカルのpnpm 10.28.2ではたまたまエラーにならなかったが、本来`pnpm-workspace.yaml`が存在する場合は`packages`必須。
  - **対応**: このリポジトリは単一パッケージ構成でworkspace機能自体が不要なため、`pnpm-workspace.yaml`を削除し、`ignoredBuiltDependencies`は`package.json`の`pnpm`フィールドに移設。`pnpm install --frozen-lockfile`・`pnpm build`ともにローカルで再確認済み。
