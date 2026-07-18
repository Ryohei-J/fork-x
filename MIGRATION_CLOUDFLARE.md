# Vercel → Cloudflare Workers（静的アセット配信）移行計画

このアプリは静的サイト（クライアントサイド完結・APIルート/middlewareなし）のため、移行のハードルは低い。

方式は **Next.jsの静的出力（`output: "export"`）+ Cloudflare Workersの静的アセット配信機能** を採用する。Cloudflareのダッシュボードは現在Next.jsを検出すると自動的に`@opennextjs/cloudflare`（Node.jsランタイムでNext.jsをサーバーとして動かすアダプタ）を提案してくるが、これは不採用。理由:

- このアプリは動的機能（SSR/APIルート/middleware）を一切使っていないため、SSR用のアダプタはオーバースペック
- `CLAUDE.md`の設計方針「サーバーは持たず、静的ホスティングで完結させる」に反する
- Cloudflareが進めている「PagesをWorkersに統合していく」流れは配信基盤（アセットの置き場所）の話であり、アプリ側にサーバーを持たせる必要があるという意味ではない
- Workersには`wrangler.jsonc`の`assets`設定だけでNode.jsランタイムなしに静的ファイルを配信できる機能があり、これが実質的に旧Pagesと同等（compute要素ゼロ）

## 前提・現状確認済みの内容

- `next/image`・`@vercel/*`パッケージ・middleware・APIルートは未使用
- `next/font/google`（Geist）はビルド時にフォントを取得するだけなので静的出力でも問題なし
- `vercel.json`なし（リダイレクト等の移植対象なし）
- 現在: GitHubの`main`へのpush → Vercel自動デプロイ（本番: https://fork-x.vercel.app）

## 懸念・確認ポイント

- [x] **静的出力との互換性チェック**: `pnpm build`で`/out`が生成されエラーなし（フェーズ1で確認済み）。
- [ ] **末尾スラッシュ・ルーティングの挙動差**: 静的ホスティングでは`/foo`と`/foo/`の扱いがVercelと微妙に異なる場合がある。デプロイ後に主要ページの直リンクアクセスを確認する。
- [ ] **独自ドメインの有無**: 現状`fork-x.vercel.app`のVercelサブドメインのみ使用。独自ドメインを設定していないなら、Cloudflare側では新しい`*.workers.dev`のURLになる。
- [ ] **Vercelの解約タイミング**: 動作確認が終わるまでVercelのデプロイは残しておき、Cloudflare側で問題ないことを確認してから停止する（ロールバック手段を残すため）。
- [x] **`robots.ts`/`sitemap.ts`の静的出力対応**: `output: "export"`では`generateStaticParams`のない動的メタルート（`/robots.txt`・`/sitemap.xml`）がそのままではビルドエラーになるため、両ファイルに`export const dynamic = "force-static"`を追加して解消済み。
- [ ] **`sitemap.ts`/`robots.ts`にハードコードされた本番URL**: `src/app/sitemap.ts`の`BASE_URL`と`src/app/robots.ts`内のsitemap URLが`https://fork-x.vercel.app`に固定されている。独自ドメインまたは新しいURLに切り替える際は、この2箇所を更新し忘れないこと（本番URL確定時に対応）。
- [ ] **JSハイドレーション後の実動作確認**: ローカルで`serve out`により静的HTML配信・アセット参照までは確認済みだが、ブラウザでのJS実行（フォーム入力→計算結果表示などのクライアントサイド動作）は自動化ツールがなく未確認。人がブラウザで実際に操作して確認する必要がある。
- [ ] **CloudflareダッシュボードのBuild/Deployコマンド設定**: 現状ダッシュボードには自動検出で`pnpm opennextjs-cloudflare build`が設定されている想定。これを`pnpm build`（ビルド）+ `wrangler deploy`（デプロイ、`wrangler.jsonc`のassets設定を読む）に変更する必要がある（フェーズ3参照）。

## 移行手順

### フェーズ1: ローカルでの静的出力対応（Claude・完了）

1. `next.config.ts`に`output: "export"`を追加
2. `robots.ts`/`sitemap.ts`に`export const dynamic = "force-static"`を追加
3. `pnpm-workspace.yaml`を削除し`ignoredBuiltDependencies`は`package.json`の`pnpm`フィールドに移設（後述「実際に遭遇した問題」参照）
4. `pnpm build`を実行し、`/out`ディレクトリが生成されエラーが出ないことを確認
5. `serve out`でローカル配信し、主要ルート（`/`・`/disclaimer`・`/robots.txt`・`/sitemap.xml`）が200を返すことを確認

### フェーズ1.5: Workers静的アセット配信への切り替え（Claude・完了）

1. `wrangler`を devDependencies に追加
2. `wrangler.jsonc`を作成（`assets.directory: "out"`、`main`スクリプトなしの純粋な静的アセットWorkerとして構成）
3. `pnpm exec wrangler deploy --dry-run`でconfigの妥当性を確認（67ファイルを`/out`から読み込み、bindingなしで認識されることを確認済み）
4. `.gitignore`に`.wrangler`を追加

### フェーズ2: Cloudflareアカウント・プロジェクトの準備（人・完了）

1. Cloudflareアカウントを作成
2. Cloudflareダッシュボード上でGitHubリポジトリ（`fork-x`）と連携するプロジェクトを作成
   - ※Next.js自動検出により`@opennextjs/cloudflare`ベースの設定が入った状態になっている（フェーズ3で修正）

### フェーズ3: ビルド/デプロイ設定の修正（人、Cloudflareダッシュボード上）

ダッシュボードのプロジェクト設定で、Build/Deployコマンドを以下に変更する:

- ビルドコマンド: `pnpm build`
- デプロイコマンド: `pnpm exec wrangler deploy`（`wrangler.jsonc`のassets設定に従い`/out`をアップロードする。account_idなど認証まわりはCloudflareのWorkers Builds連携が自動的に処理する想定だが、初回は要確認）
- ルートディレクトリ: リポジトリ直下（変更不要）

### フェーズ4: デプロイ確認（人 + Claude）

1. Cloudflareが自動的にデプロイを実行 → 発行された`*.workers.dev`のURLで動作確認（人が実際にブラウザで操作、Claudeは必要ならビルドログのエラー調査を手伝う）
2. 主要な入力パターン（正社員/フリーランス、年収・月給切り替え、扶養人数、青色/白色申告など）でVercel版と表示が一致するか比較確認
3. スマホ表示の確認（TODO.mdに既存の未対応タスクとしても記載あり、移行のついでに崩れがないかは見ておく）

### フェーズ5: 本番切り替え（人）

1. 独自ドメインを使う場合はCloudflare Workersにカスタムドメインを設定し、DNSを向き先変更
2. `sitemap.ts`/`robots.ts`のハードコードURLを新しい本番URLに更新（Claudeに依頼可）
3. `README.md`の本番URL記載を更新（Claudeに依頼可）
4. 問題なければVercel側のプロジェクトを削除 or 自動デプロイを無効化

## 作業分担まとめ

| フェーズ | 人 | Claude |
|---|---|---|
| 1. 静的出力対応 | - | 設定変更・ビルド確認・修正 |
| 1.5. Workers静的アセット化 | - | wrangler設定・dry-run確認 |
| 2. アカウント/プロジェクト作成 | Cloudflareアカウント作成、GitHub連携の許可 | - |
| 3. Build/Deployコマンド修正 | ダッシュボードでの設定変更 | 設定値の確認・提示 |
| 4. デプロイ確認 | 実ブラウザでの動作確認 | ビルドエラー調査・修正 |
| 5. 本番切り替え | DNS設定、Vercel停止判断 | README・sitemap/robots更新 |

## 未確定で要確認な事項

- 独自ドメインを新規に取得・設定する予定があるかどうか（現状Vercelサブドメインのみなので、方針次第で手順5が変わる）
- Cloudflare側の「Workers Builds」（Git連携の自動ビルド/デプロイ機能）が、`wrangler deploy`実行に必要な認証（account_id等）をどこまで自動で解決してくれるか。初回のデプロイ時にビルドログで確認する。

## 実際に遭遇した問題と対応

- [x] **`pnpm install --frozen-lockfile`が`ERROR packages field missing or empty`で失敗**: `pnpm-workspace.yaml`が`ignoredBuiltDependencies`のみを記載した状態（`packages`フィールドなし）で存在しており、Cloudflareのビルド環境のpnpmがこれを「空のworkspace定義」とみなしてエラーになった。ローカルのpnpm 10.28.2ではたまたまエラーにならなかったが、本来`pnpm-workspace.yaml`が存在する場合は`packages`必須。
  - **対応**: このリポジトリは単一パッケージ構成でworkspace機能自体が不要なため、`pnpm-workspace.yaml`を削除し、`ignoredBuiltDependencies`は`package.json`の`pnpm`フィールドに移設。`pnpm install --frozen-lockfile`・`pnpm build`ともにローカルで再確認済み。
- [x] **`pnpm opennextjs-cloudflare build`が失敗**: Cloudflareダッシュボードのフレームワーク自動検出により、Next.jsプロジェクトに対して`@opennextjs/cloudflare`（SSR用アダプタ）ベースのビルドコマンドが設定されていた。このリポジトリはSSR等の動的機能を使っておらず、`next.config.ts`の`output: "export"`（静的出力）と`@opennextjs/cloudflare`は方式として競合する。
  - **対応**: OpenNextアダプタは導入せず、`wrangler.jsonc`で`assets.directory: "out"`を指定した純粋な静的アセットWorkerとして構成し直した。Cloudflareダッシュボード側のBuild/Deployコマンドも変更が必要（フェーズ3）。
