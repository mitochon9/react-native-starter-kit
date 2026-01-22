# iOS ストア公開ガイド

Three Year DiaryアプリをApp Storeに公開するための手順です。

## 目次

1. [全体の流れ](#全体の流れ)
2. [事前準備](#事前準備)
3. [EASビルド](#easビルド)
4. [App Store Connect設定](#app-store-connect設定)
5. [ストア掲載情報の入力](#ストア掲載情報の入力)
6. [アプリのアップロード](#アプリのアップロード)
7. [審査・公開](#審査公開)
8. [アップデート時の手順](#アップデート時の手順)

---

## 全体の流れ

```
1. Apple Developer Programに登録
       ↓
2. EASでproductionビルド（.ipa生成）
       ↓
3. App Store Connectでアプリ作成
       ↓
4. ストア掲載情報を入力（説明文、スクリーンショット等）
       ↓
5. EAS Submitまたは手動でアップロード
       ↓
6. 審査提出
       ↓
7. 審査通過後、公開
```

**所要時間の目安:**
- EASビルド: 20〜40分
- ストア掲載情報入力: 1〜2時間（初回のみ）
- 審査: 24時間〜数日

---

## 事前準備

### 必要なアカウント

| 項目 | 詳細 |
|-----|------|
| Apple Developer Program | 年額 $99（約¥15,800） |
| Expo アカウント | EASビルド用 |

### Apple Developer Program登録

1. https://developer.apple.com/programs/ にアクセス
2. 「Enroll」から登録開始
3. Apple IDでサインイン（2ファクタ認証必須）
4. 個人 or 組織を選択
5. 年額 $99 を支払い
6. 承認まで最大48時間待つ

### 必要な素材

| 素材 | サイズ | 備考 |
|-----|-------|------|
| アプリアイコン | 1024x1024 px | PNG、透過・角丸なし |
| スクリーンショット（6.7インチ） | 1290x2796 px | iPhone 15 Pro Max等 |
| スクリーンショット（6.5インチ） | 1284x2778 px | iPhone 14 Plus等 |
| スクリーンショット（5.5インチ） | 1242x2208 px | iPhone 8 Plus等（任意） |
| iPad スクリーンショット | 2048x2732 px | 任意 |
| 説明文 | 4000文字以内 | |
| キーワード | 100文字以内 | カンマ区切り |

---

## EASビルド

### 1. Apple認証情報の設定

初回ビルド時、EASがApple Developer認証情報を要求します。

```bash
# 認証情報の設定（初回のみ）
eas credentials
```

または、ビルド時に自動で設定されます。

### 2. ビルドコマンド

```bash
# package.jsonに登録済みのスクリプトを使用
bun run build:ios

# または直接実行
eas build --platform ios --profile production
```

### 3. Apple ID認証

ビルド中に以下を聞かれます:

```
? Do you want to log in to your Apple account? Yes
? Apple ID: your-email@example.com
? Password: [hidden]
```

2ファクタ認証コードも求められます。

### 4. 証明書・プロビジョニングプロファイル

EASが自動で作成・管理します:

- **Distribution Certificate**: アプリ署名用証明書
- **Provisioning Profile**: App Store配布用プロファイル

### 5. ビルド完了後

ビルドが完了すると `.ipa` ファイルが生成されます。

```bash
# 最新のビルドを確認
eas build:list --platform ios
```

---

## App Store Connect設定

### 1. アプリの作成

1. https://appstoreconnect.apple.com/ にログイン
2. 「マイApp」→「+」→「新規App」
3. 以下を入力:

| 項目 | 値 |
|-----|-----|
| プラットフォーム | iOS |
| 名前 | Three Year Diary |
| プライマリ言語 | 日本語 |
| バンドルID | com.revedge.threeyeardiary |
| SKU | threeyeardiary（任意の一意な文字列） |
| ユーザアクセス | フルアクセス |

### 2. App情報の設定

「App情報」タブで以下を設定:

| 項目 | 値 |
|-----|-----|
| カテゴリ | ライフスタイル or ユーティリティ |
| サブカテゴリ | 任意 |
| コンテンツ配信権 | 該当なし |
| 年齢制限指定 | 設定が必要 |

---

## ストア掲載情報の入力

### 1. バージョン情報

「App Store」タブ → 該当バージョンを選択

#### スクリーンショット

| デバイス | 必須 | サイズ |
|---------|------|--------|
| 6.7インチ（iPhone 15 Pro Max） | 必須 | 1290x2796 px |
| 6.5インチ（iPhone 14 Plus） | 必須 | 1284x2778 px |
| iPad Pro 12.9インチ | 任意 | 2048x2732 px |

※ 最低2枚、最大10枚

#### プロモーションテキスト・説明文

```
プロモーションテキスト（170文字）:
3年間の日記を1画面で振り返れる、シンプルな日記アプリ。今日書いた日記が、来年・再来年の自分へのメッセージになります。

説明文:
Three Year Diaryは、同じ日付の日記を3年分並べて表示できるユニークな日記アプリです。

【特徴】
・1年前、2年前の自分と対話するような日記体験
・シンプルで使いやすいインターフェース
・オフライン対応で、いつでもどこでも記録可能
・プライバシーを重視した設計（データは端末内のみに保存）

【こんな方におすすめ】
・日記を習慣にしたい方
・過去の自分を振り返りたい方
・シンプルな日記アプリを探している方

【プライバシー】
すべてのデータは端末内にのみ保存されます。外部サーバーへの送信は一切行いません。
```

#### キーワード

```
日記,diary,3年日記,ライフログ,振り返り,習慣,シンプル,メモ,ジャーナル
```

（100文字以内、カンマ区切り）

### 2. 年齢制限指定

「App情報」→「年齢制限指定」

質問に回答:

| 項目 | 回答 |
|-----|------|
| 暴力的なコンテンツ | なし |
| 性的なコンテンツ | なし |
| ギャンブル | なし |
| アルコール・タバコ | なし |
| ホラー/恐怖テーマ | なし |

→ 通常「4+」のレーティングになります

### 3. App プライバシー

「Appのプライバシー」で以下を設定:

Three Year Diaryの場合（広告なし・外部送信なしの場合）:

| 質問 | 回答 |
|-----|------|
| データを収集していますか？ | いいえ |

※ 広告を入れる場合は「はい」→ 広告関連のデータ収集を申告

### 4. プライバシーポリシーURL

プライバシーポリシーのURLが必須です。

例: `https://your-domain.com/privacy-policy`

GitHubのリポジトリにPRIVACY.mdを置いてリンクすることも可能。

---

## アプリのアップロード

### 方法1: EAS Submit（推奨）

EASで直接App Store Connectにアップロード:

```bash
eas submit --platform ios
```

オプション:
```bash
# 最新のビルドを使用
eas submit --platform ios --latest

# 特定のビルドを使用
eas submit --platform ios --id BUILD_ID
```

### 方法2: Transporter（手動）

1. Mac App Storeから「Transporter」をダウンロード
2. EASダッシュボードから `.ipa` をダウンロード
3. Transporterを開いてファイルをドラッグ&ドロップ
4. 「配信」をクリック

### 方法3: Xcode経由

1. Xcodeの「Window」→「Organizer」
2. 「Archives」タブ
3. `.ipa` を選択して「Distribute App」

---

## 審査・公開

### 1. ビルドの選択

App Store Connect で:

1. 該当バージョンを選択
2. 「ビルド」セクションで「+」をクリック
3. アップロードしたビルドを選択

### 2. 輸出コンプライアンス

`app.json` に設定済み:

```json
{
  "ios": {
    "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    }
  }
}
```

これにより、毎回の質問がスキップされます。

### 3. 審査提出

1. すべての必須項目が入力されていることを確認
2. 「審査へ提出」をクリック

### 審査で確認されること

- ガイドライン違反がないか
- アプリが正常に動作するか
- 説明とアプリ内容の一致
- プライバシーポリシーの適切性
- ユーザーデータの取り扱い

### 審査期間

- 通常: 24〜48時間
- 長い場合: 最大1週間

### 却下（リジェクト）された場合

1. 「Resolution Center」で理由を確認
2. 問題を修正
3. 必要に応じてAppleに返信
4. 修正後、再提出

よくある却下理由:
- メタデータの問題（スクリーンショットが不適切など）
- バグや クラッシュ
- プライバシーポリシーの不備
- ガイドライン4.2（最低限の機能）

---

## アップデート時の手順

### 1. バージョン更新

`app.json` を更新:

```json
{
  "expo": {
    "version": "1.1.0",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

※ EASの `autoIncrement` を使う場合、`buildNumber` は自動更新されます

### 2. ビルド

```bash
bun run build:ios
```

### 3. アップロード

```bash
eas submit --platform ios --latest
```

### 4. App Store Connectで新バージョン作成

1. 「App Store」タブ → 「+」バージョン
2. 新しいバージョン番号を入力（例: 1.1.0）
3. リリースノート（「このバージョンの新機能」）を入力
4. ビルドを選択
5. 審査へ提出

---

## TestFlight（ベータテスト）

本番公開前にTestFlightでテストすることを推奨。

### 内部テスター

1. App Store Connect → TestFlight
2. 「内部テスト」→「+」グループ作成
3. チームメンバーを追加（最大100人）
4. ビルドをアップロード後、自動で配信

### 外部テスター

1. 「外部テスト」→「+」グループ作成
2. メールでテスターを招待（最大10,000人）
3. 外部テストはAppleの簡易審査が必要（24時間程度）

---

## トラブルシューティング

### ビルドが失敗する

```bash
# キャッシュクリアしてビルド
eas build --platform ios --profile production --clear-cache
```

### 証明書の問題

```bash
# 認証情報を確認・再設定
eas credentials

# 証明書をリセット（注意: 既存の証明書が無効になります）
eas credentials --platform ios
```

### App Store Connectにアップロードできない

- ビルドバージョンが重複していないか確認
- 証明書が有効か確認
- Apple Developer Programの有効期限を確認

### 審査でクラッシュを指摘された

1. Crashlyticsやセントリーでクラッシュログを確認
2. TestFlightで同じ端末・OSバージョンでテスト
3. 問題を修正して再提出

---

## チェックリスト

### 初回リリース

- [ ] Apple Developer Program登録（$99/年）
- [ ] アプリアイコン（1024x1024）準備
- [ ] スクリーンショット準備（6.7インチ、6.5インチ）
- [ ] プライバシーポリシーURL準備
- [ ] EASでproductionビルド
- [ ] App Store Connectでアプリ作成
- [ ] ストア掲載情報入力
- [ ] 年齢制限指定
- [ ] Appプライバシー設定
- [ ] EAS Submitでアップロード
- [ ] TestFlightでテスト（推奨）
- [ ] 審査へ提出
- [ ] 審査通過

### アップデート

- [ ] 変更内容をコミット
- [ ] バージョン番号を更新
- [ ] EASでproductionビルド
- [ ] EAS Submitでアップロード
- [ ] 新バージョンを作成
- [ ] リリースノート記入
- [ ] 審査へ提出

---

## 参考リンク

- [App Store Connect](https://appstoreconnect.apple.com/)
- [Apple Developer](https://developer.apple.com/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [EAS Submit ドキュメント](https://docs.expo.dev/submit/introduction/)
- [App Store Connect ヘルプ](https://developer.apple.com/help/app-store-connect/)
