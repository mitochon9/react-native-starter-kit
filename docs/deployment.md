# アプリストア公開ガイド

このドキュメントでは、Three Year DiaryアプリをApp Store (iOS) および Google Play Store (Android) に公開する手順を説明します。

## 目次

1. [事前準備](#1-事前準備)
2. [開発者アカウントの登録](#2-開発者アカウントの登録)
3. [app.json の設定](#3-appjson-の設定)
4. [EAS のセットアップ](#4-eas-のセットアップ)
5. [アプリのビルド](#5-アプリのビルド)
6. [ストアへの提出](#6-ストアへの提出)
7. [App Store Connect の設定](#7-app-store-connect-の設定)
8. [Google Play Console の設定](#8-google-play-console-の設定)
9. [審査対応](#9-審査対応)
10. [トラブルシューティング](#10-トラブルシューティング)

---

## 1. 事前準備

### 必要なもの

- [ ] Node.js (v18以上推奨)
- [ ] Expoアカウント (無料)
- [ ] Apple Developer Program アカウント ($99/年)
- [ ] Google Play Developer アカウント ($25 一回のみ)
- [ ] アプリアイコン (1024x1024px)
- [ ] スクリーンショット (各デバイスサイズ)
- [ ] プライバシーポリシー (URL)

### Expoアカウントの作成

```bash
# Expo アカウントがない場合は作成
npx expo register

# または https://expo.dev/signup からブラウザで登録
```

---

## 2. 開発者アカウントの登録

### Apple Developer Program

1. https://developer.apple.com/programs/ にアクセス
2. 「Enroll」をクリック
3. Apple IDでサインイン (なければ作成)
4. 個人または組織として登録
   - **個人**: 本人確認書類が必要
   - **組織**: D-U-N-S番号が必要
5. $99/年 の支払い
6. 登録完了まで最大48時間

### Google Play Developer

1. https://play.google.com/console/ にアクセス
2. Googleアカウントでサインイン
3. 「デベロッパーアカウントを作成」をクリック
4. デベロッパー名、連絡先情報を入力
5. $25 の登録料を支払い
6. 本人確認 (数日かかる場合あり)

---

## 3. app.json の設定

ストア公開に必要な設定を追加します。

### 現在の設定

```json
{
  "expo": {
    "name": "three-year-diary",
    "slug": "three-year-diary",
    "version": "1.0.0"
  }
}
```

### 公開用に更新

```json
{
  "expo": {
    "name": "Three Year Diary",
    "slug": "three-year-diary",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "threeyeardiary",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.threeyeardiary",
      "buildNumber": "1",
      "infoPlist": {
        "CFBundleDisplayName": "Three Year Diary",
        "NSCameraUsageDescription": "写真を日記に添付するために使用します",
        "NSPhotoLibraryUsageDescription": "写真を日記に添付するために使用します"
      }
    },
    "android": {
      "package": "com.yourcompany.threeyeardiary",
      "versionCode": 1,
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "permissions": []
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 重要な設定項目

| 項目 | 説明 | 例 |
|------|------|-----|
| `name` | アプリ名 (ストアに表示) | `Three Year Diary` |
| `ios.bundleIdentifier` | iOS用の一意識別子 | `com.yourname.threeyeardiary` |
| `android.package` | Android用パッケージ名 | `com.yourname.threeyeardiary` |
| `version` | ユーザー向けバージョン | `1.0.0` |
| `ios.buildNumber` | iOS内部ビルド番号 | `1` |
| `android.versionCode` | Android内部バージョン | `1` |

> **注意**: `bundleIdentifier` と `package` は一度公開すると変更できません。慎重に決めてください。

---

## 4. EAS のセットアップ

### EAS CLI のインストール

```bash
npm install -g eas-cli
```

### Expoにログイン

```bash
eas login
```

### プロジェクトの初期化

```bash
eas build:configure
```

これにより `eas.json` が生成されます。

### eas.json の設定

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## 5. アプリのビルド

### 本番用ビルド

```bash
# iOS と Android 両方をビルド
eas build --platform all --profile production

# iOS のみ
eas build --platform ios --profile production

# Android のみ
eas build --platform android --profile production
```

### ビルドの確認

```bash
# ビルド状況を確認
eas build:list

# 特定のビルドの詳細
eas build:view
```

ビルドは Expo のサーバーで実行され、完了まで10-30分程度かかります。

### ビルド成果物

- **iOS**: `.ipa` ファイル
- **Android**: `.aab` ファイル (App Bundle)

---

## 6. ストアへの提出

### 自動提出 (推奨)

```bash
# 両プラットフォームに提出
eas submit --platform all

# iOS のみ
eas submit --platform ios

# Android のみ
eas submit --platform android
```

### 手動提出

ビルド完了後、Expo ダッシュボードからファイルをダウンロードして手動でアップロードすることも可能です。

---

## 7. App Store Connect の設定

### 7.1 アプリの作成

1. https://appstoreconnect.apple.com/ にアクセス
2. 「マイApp」→「+」→「新規App」
3. 以下を入力:
   - プラットフォーム: iOS
   - 名前: Three Year Diary
   - プライマリ言語: 日本語
   - バンドルID: (app.jsonで設定したもの)
   - SKU: threeyeardiary (任意の識別子)

### 7.2 アプリ情報の入力

#### 基本情報

| 項目 | 内容例 |
|------|--------|
| サブタイトル | 3年分の日記を振り返る |
| カテゴリ | ライフスタイル / 日記 |
| コンテンツ配信権 | いいえ |

#### 説明文 (例)

```
毎日の気持ちと体調を記録して、3年分の変化を振り返ることができる日記アプリです。

【主な機能】
- 気分と体調のスコア記録
- プライベートと仕事の日記を分けて記録
- 過去の同じ日の日記を振り返り
- 統計グラフで傾向を確認
- ダークモード対応

【特徴】
- シンプルで落ち着いたデザイン
- オフラインで動作
- データは端末内に保存され、外部送信されません
```

### 7.3 スクリーンショット

必要なサイズ:
- iPhone 6.7インチ (1290 x 2796px) - 必須
- iPhone 6.5インチ (1284 x 2778px)
- iPhone 5.5インチ (1242 x 2208px)
- iPad Pro 12.9インチ (2048 x 2732px) - iPadサポート時

### 7.4 プライバシー

1. App プライバシーセクションで「始める」
2. 収集するデータを選択
   - このアプリはデータを外部送信しないため「データを収集していません」を選択可能
3. プライバシーポリシーURL を入力

### 7.5 価格と配信地域

1. 価格: 無料 または 有料
2. 配信地域: 日本 / 全世界

---

## 8. Google Play Console の設定

### 8.1 アプリの作成

1. https://play.google.com/console/ にアクセス
2. 「アプリを作成」をクリック
3. 以下を入力:
   - アプリ名: Three Year Diary
   - デフォルトの言語: 日本語
   - アプリ/ゲーム: アプリ
   - 無料/有料: 無料
   - デベロッパープログラムポリシーに同意

### 8.2 ストア掲載情報

#### メインのストア掲載情報

| 項目 | 内容 |
|------|------|
| アプリ名 | Three Year Diary |
| 簡単な説明 (80文字以内) | 3年分の日記を振り返れるシンプルな日記アプリ |
| 詳しい説明 | (App Storeと同様) |

#### グラフィック

- アイコン: 512 x 512px
- フィーチャーグラフィック: 1024 x 500px
- スクリーンショット: 最低2枚

### 8.3 コンテンツのレーティング

1. 「コンテンツのレーティング」→「アンケートを開始」
2. 質問に回答
3. 通常、日記アプリは「全ユーザー対象」になります

### 8.4 データセーフティ

1. 「データセーフティ」セクションを開く
2. 以下の質問に回答:
   - データ収集: いいえ
   - データ共有: いいえ
   - データの暗号化: はい
   - データの削除: ユーザーがアプリを削除すると削除される

### 8.5 アプリのリリース

1. 「製品版」→「新しいリリースを作成」
2. App Bundle (.aab) をアップロード
3. リリースノートを記入
4. 「審査に送信」

---

## 9. 審査対応

### iOS 審査でよくあるリジェクト理由

1. **メタデータの問題**
   - スクリーンショットが実際のアプリと異なる
   - 説明文に誤解を招く表現がある

2. **機能の問題**
   - 最小限の機能しかない (UIが空っぽなど)
   - クラッシュする

3. **プライバシーの問題**
   - プライバシーポリシーがない
   - 権限の説明が不十分

### Android 審査でよくあるリジェクト理由

1. **ポリシー違反**
   - データセーフティの申告と実際の動作が異なる

2. **品質の問題**
   - ANR (Application Not Responding) が多い
   - クラッシュ率が高い

### 審査期間

| プラットフォーム | 通常の審査期間 |
|------------------|----------------|
| iOS | 1-3日 |
| Android | 数時間-2日 |

---

## 10. トラブルシューティング

### ビルドエラー

```bash
# キャッシュをクリア
eas build --clear-cache --platform ios

# ローカルでビルドテスト
npx expo prebuild --clean
cd ios && pod install && cd ..
```

### 証明書の問題 (iOS)

```bash
# 証明書を再生成
eas credentials

# プロビジョニングプロファイルをリセット
eas credentials --platform ios
```

### Google Play の署名

```bash
# AABの署名確認
eas credentials --platform android
```

### よくあるエラー

| エラー | 解決策 |
|--------|--------|
| `Missing bundle identifier` | app.json に `ios.bundleIdentifier` を追加 |
| `Missing package name` | app.json に `android.package` を追加 |
| `Build failed: provisioning profile` | `eas credentials` で証明書を再設定 |

---

## 参考リンク

- [Expo EAS Build ドキュメント](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit ドキュメント](https://docs.expo.dev/submit/introduction/)
- [App Store Review ガイドライン](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play ポリシー](https://play.google.com/about/developer-content-policy/)

---

## 更新履歴

| バージョン | 日付 | 内容 |
|------------|------|------|
| 1.0 | 2026-01-10 | 初版作成 |
