# デプロイチェックリスト

アプリ公開までの進捗を管理するためのチェックリストです。

---

## Phase 1: アカウント準備

### Expo
- [ ] Expoアカウント作成 (https://expo.dev/signup)
- [ ] `eas login` でログイン確認

### Apple Developer Program
- [ ] https://developer.apple.com/programs/ で登録開始
- [ ] Apple ID でサインイン
- [ ] $99/年 の支払い完了
- [ ] 登録承認完了 (最大48時間)

### Google Play Developer
- [ ] https://play.google.com/console/ で登録開始
- [ ] $25 の登録料支払い
- [ ] 本人確認完了

---

## Phase 2: アプリ設定

### app.json
- [ ] `name` をストア表示名に変更
- [ ] `ios.bundleIdentifier` を設定 (例: `com.yourname.threeyeardiary`)
- [ ] `android.package` を設定 (例: `com.yourname.threeyeardiary`)
- [ ] `version` を確認 (`1.0.0`)
- [ ] `ios.buildNumber` を設定 (`1`)
- [ ] `android.versionCode` を設定 (`1`)

### EAS
- [ ] `npm install -g eas-cli`
- [ ] `eas build:configure` 実行
- [ ] `eas.json` の確認

---

## Phase 3: アセット準備

### アイコン
- [ ] アプリアイコン (1024x1024px, PNG)
- [ ] Android フォアグラウンドアイコン
- [ ] Android バックグラウンドアイコン

### スクリーンショット (iOS)
- [ ] iPhone 6.7インチ (1290 x 2796px) x 3-5枚
- [ ] iPad Pro 12.9インチ (2048 x 2732px) x 3-5枚 ※iPadサポート時

### スクリーンショット (Android)
- [ ] スマートフォン用 (1080 x 1920px以上) x 2-8枚

### その他
- [ ] フィーチャーグラフィック (1024 x 500px) - Android用

---

## Phase 4: ストア情報準備

### テキスト
- [ ] アプリ名 (30文字以内)
- [ ] サブタイトル/簡単な説明 (30-80文字)
- [ ] 詳細な説明文 (日本語)
- [ ] キーワード (iOS用、100文字以内)
- [ ] リリースノート

### 法的情報
- [ ] プライバシーポリシー作成
- [ ] プライバシーポリシーをWebに公開
- [ ] プライバシーポリシーURL取得

---

## Phase 5: ビルド

### 開発ビルドでテスト
- [ ] `eas build --profile preview --platform all`
- [ ] 実機でテスト確認

### 本番ビルド
- [ ] `eas build --profile production --platform ios`
- [ ] `eas build --profile production --platform android`
- [ ] ビルド成功確認

---

## Phase 6: ストア設定

### App Store Connect
- [ ] アプリ作成
- [ ] 基本情報入力
- [ ] スクリーンショットアップロード
- [ ] 説明文入力
- [ ] カテゴリ選択
- [ ] プライバシー情報入力
- [ ] 価格設定

### Google Play Console
- [ ] アプリ作成
- [ ] ストア掲載情報入力
- [ ] グラフィックアップロード
- [ ] コンテンツのレーティング完了
- [ ] データセーフティ入力
- [ ] 価格設定

---

## Phase 7: 提出

### iOS
- [ ] `eas submit --platform ios`
- [ ] TestFlightでテスト (任意)
- [ ] 審査に送信
- [ ] 審査結果待ち

### Android
- [ ] `eas submit --platform android`
- [ ] 内部テスト (任意)
- [ ] 製品版に送信
- [ ] 審査結果待ち

---

## Phase 8: 公開

- [ ] iOS 審査通過
- [ ] Android 審査通過
- [ ] アプリ公開確認
- [ ] ストアでダウンロードテスト

---

## 備考欄

### Bundle ID / Package Name
```
iOS:
Android:
```

### アカウント情報
```
Expo:
Apple ID:
Google:
```

### 重要な日付
```
開発開始:
ビルド完了:
審査提出:
公開日:
```
