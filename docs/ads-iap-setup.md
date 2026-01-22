# 広告・課金（広告除去）実装ガイド

Three Year Diaryアプリに広告表示と、課金による広告除去機能を実装するためのガイドです。

## 目次

1. [概要](#概要)
2. [事前準備](#事前準備)
3. [AdMobセットアップ](#admobセットアップ)
4. [広告SDKの実装](#広告sdkの実装)
5. [課金アイテムの設定](#課金アイテムの設定)
6. [課金SDKの実装](#課金sdkの実装)
7. [Development Buildの作成](#development-buildの作成)
8. [テスト方法](#テスト方法)

---

## 概要

### 機能
- **バナー広告**: 画面下部に表示
- **広告除去（買い切り）**: 一度購入すれば永久に広告非表示

### 使用ライブラリ
- `react-native-google-mobile-ads` - Google AdMob SDK
- `react-native-iap` - アプリ内課金

---

## 事前準備

### 必要なアカウント

| サービス | 用途 | URL |
|---------|------|-----|
| Google AdMob | 広告配信 | https://admob.google.com/ |
| Apple Developer | iOS課金 | https://developer.apple.com/ |
| Google Play Console | Android課金 | https://play.google.com/console/ |

### アプリ情報

```
iOS Bundle ID: com.revedge.threeyeardiary
Android Package: com.revedge.threeyeardiary
```

---

## AdMobセットアップ

### 1. AdMobアカウント作成

1. https://admob.google.com/ にアクセス
2. Googleアカウントでログイン
3. AdMobアカウントを作成

### 2. アプリの登録

#### iOSアプリ
1. 「アプリ」→「アプリを追加」
2. プラットフォーム: iOS
3. アプリ名: Three Year Diary
4. **アプリID** をメモ（例: `ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy`）

#### Androidアプリ
1. 「アプリ」→「アプリを追加」
2. プラットフォーム: Android
3. アプリ名: Three Year Diary
4. **アプリID** をメモ

### 3. 広告ユニットの作成

各アプリで「広告ユニット」→「広告ユニットを追加」

#### バナー広告ユニット
- 広告フォーマット: バナー
- 広告ユニット名: `banner_bottom`
- **広告ユニットID** をメモ（例: `ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy`）

### 4. 取得するIDまとめ

```
# iOS
ADMOB_IOS_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
ADMOB_IOS_BANNER_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy

# Android
ADMOB_ANDROID_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy
ADMOB_ANDROID_BANNER_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
```

### テスト用広告ID（開発中はこちらを使用）

```
# iOS
ca-app-pub-3940256099942544/2934735716  # バナー

# Android
ca-app-pub-3940256099942544/6300978111  # バナー
```

---

## 広告SDKの実装

### 1. パッケージのインストール

```bash
bun add react-native-google-mobile-ads
```

### 2. app.jsonの設定

```json
{
  "expo": {
    "plugins": [
      "expo-router",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
          "iosAppId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
        }
      ]
    ]
  }
}
```

### 3. 広告コンポーネントの作成

`src/features/ads/ui/banner-ad.tsx`:

```tsx
import { Platform, View } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { usePremium } from "@/src/features/premium";

const AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy",
      android: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy",
    }) ?? TestIds.BANNER;

export const AdBanner = () => {
  const { isPremium } = usePremium();

  // 課金済みなら広告を表示しない
  if (isPremium) {
    return null;
  }

  return (
    <View className="items-center">
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};
```

### 4. 画面への配置

`app/(tabs)/_layout.tsx` などで、タブの上に表示:

```tsx
import { AdBanner } from "@/src/features/ads";

// タブバーの上に広告を表示
<AdBanner />
<Tabs>
  ...
</Tabs>
```

---

## 課金アイテムの設定

### App Store Connect（iOS）

1. https://appstoreconnect.apple.com/ にログイン
2. 「マイApp」→「Three Year Diary」を選択
3. 「収益化」→「アプリ内課金」→「+」

#### 課金アイテム設定
- タイプ: **非消耗型**（一度購入すれば永続）
- 参照名: Remove Ads
- 製品ID: `com.revedge.threeyeardiary.removeads`
- 価格: 任意（例: ¥160, $0.99）
- 表示名・説明を各言語で設定

### Google Play Console（Android）

1. https://play.google.com/console/ にログイン
2. アプリを選択
3. 「収益化」→「商品」→「アプリ内アイテム」→「商品を作成」

#### 課金アイテム設定
- 商品ID: `remove_ads`（iOSと異なってもOK）
- 商品タイプ: 管理対象アイテム（非消耗型相当）
- 価格: 任意

### 製品IDまとめ

```
iOS:     com.revedge.threeyeardiary.removeads
Android: remove_ads
```

---

## 課金SDKの実装

### 1. パッケージのインストール

```bash
bun add react-native-iap
```

### 2. app.jsonのplugins追加（必要に応じて）

```json
{
  "expo": {
    "plugins": [
      "react-native-iap"
    ]
  }
}
```

### 3. Premium状態管理のhook

`src/features/premium/model/use-premium.ts`:

```tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  type ProductPurchase,
  type PurchaseError,
} from "react-native-iap";

const PREMIUM_KEY = "is_premium";
const PRODUCT_IDS = Platform.select({
  ios: ["com.revedge.threeyeardiary.removeads"],
  android: ["remove_ads"],
}) ?? [];

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  // 初期化
  useEffect(() => {
    const init = async () => {
      try {
        await initConnection();

        // 商品情報を取得
        const items = await getProducts({ skus: PRODUCT_IDS });
        setProducts(items);

        // 購入済みかチェック（復元）
        const purchases = await getAvailablePurchases();
        const hasPurchased = purchases.some((p) =>
          PRODUCT_IDS.includes(p.productId)
        );

        if (hasPurchased) {
          await AsyncStorage.setItem(PREMIUM_KEY, "true");
          setIsPremium(true);
        } else {
          const stored = await AsyncStorage.getItem(PREMIUM_KEY);
          setIsPremium(stored === "true");
        }
      } catch (error) {
        // ローカルの状態を確認
        const stored = await AsyncStorage.getItem(PREMIUM_KEY);
        setIsPremium(stored === "true");
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // 購入リスナー
    const purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        if (PRODUCT_IDS.includes(purchase.productId)) {
          await finishTransaction({ purchase });
          await AsyncStorage.setItem(PREMIUM_KEY, "true");
          setIsPremium(true);
        }
      }
    );

    const purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.warn("Purchase error:", error);
      }
    );

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
      endConnection();
    };
  }, []);

  // 購入処理
  const purchaseRemoveAds = useCallback(async () => {
    try {
      await requestPurchase({ sku: PRODUCT_IDS[0] });
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // 購入復元
  const restorePurchases = useCallback(async () => {
    try {
      const purchases = await getAvailablePurchases();
      const hasPurchased = purchases.some((p) =>
        PRODUCT_IDS.includes(p.productId)
      );

      if (hasPurchased) {
        await AsyncStorage.setItem(PREMIUM_KEY, "true");
        setIsPremium(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, []);

  return {
    isPremium,
    isLoading,
    products,
    purchaseRemoveAds,
    restorePurchases,
  };
};
```

### 4. 設定画面に購入UIを追加

`app/(tabs)/settings.tsx` に追加:

```tsx
import { usePremium } from "@/src/features/premium";

// コンポーネント内
const { isPremium, products, purchaseRemoveAds, restorePurchases } = usePremium();

// UI
{!isPremium && (
  <View className="mb-8">
    <Text className="text-[13px] mb-3 text-gray-400">
      広告を除去
    </Text>
    <Pressable
      onPress={purchaseRemoveAds}
      className="py-3.5 px-4 rounded-xl border border-gray-100 bg-blue-500"
    >
      <Text className="text-white text-center">
        広告を除去する（{products[0]?.localizedPrice ?? "¥160"}）
      </Text>
    </Pressable>
    <Pressable
      onPress={restorePurchases}
      className="py-2 mt-2"
    >
      <Text className="text-blue-500 text-center text-[13px]">
        購入を復元
      </Text>
    </Pressable>
  </View>
)}
```

---

## Development Buildの作成

広告・課金をテストするにはDevelopment Buildが必要です。

### 1. ビルドコマンド

```bash
# iOS（実機またはシミュレーター）
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### 2. インストール

ビルド完了後、QRコードまたはリンクからインストール。

iOSの場合は実機にインストールするか、`--simulator` オプションでシミュレーター用ビルドを作成:

```bash
eas build --profile development --platform ios --simulator
```

### 3. 開発サーバーへの接続

```bash
bun start
```

Development Buildアプリを起動し、開発サーバーに接続。

---

## テスト方法

### 広告のテスト

開発中は自動的にテスト広告が表示されます（`__DEV__` で判定）。

### 課金のテスト

#### iOS（Sandbox）
1. App Store Connectで「Sandboxテスター」を作成
2. デバイスの設定 → App Store → サインアウト
3. アプリ内で購入時にSandboxアカウントでサインイン

#### Android（テストトラック）
1. Google Play Consoleで「内部テスト」トラックを設定
2. テスターのGoogleアカウントを追加
3. テストリンクからインストール

---

## ファイル構成（完成後）

```
src/features/
├── ads/
│   ├── index.ts
│   └── ui/
│       └── banner-ad.tsx
└── premium/
    ├── index.ts
    └── model/
        └── use-premium.ts
```

---

## チェックリスト

### AdMob
- [ ] AdMobアカウント作成
- [ ] iOSアプリ登録 → アプリID取得
- [ ] Androidアプリ登録 → アプリID取得
- [ ] バナー広告ユニット作成（iOS）
- [ ] バナー広告ユニット作成（Android）

### App Store Connect（iOS課金）
- [ ] アプリ登録済み
- [ ] 非消耗型アプリ内課金アイテム作成
- [ ] 価格設定
- [ ] Sandboxテスター作成

### Google Play Console（Android課金）
- [ ] アプリ登録済み
- [ ] アプリ内アイテム作成
- [ ] 価格設定
- [ ] 内部テストトラック設定

### 実装
- [ ] `react-native-google-mobile-ads` インストール
- [ ] `react-native-iap` インストール
- [ ] app.jsonにAdMob設定追加
- [ ] AdBannerコンポーネント作成
- [ ] usePremium hook作成
- [ ] 設定画面に購入UI追加
- [ ] Development Build作成
- [ ] テスト

---

## 参考リンク

- [react-native-google-mobile-ads](https://github.com/invertase/react-native-google-mobile-ads)
- [react-native-iap](https://github.com/dooboolab-community/react-native-iap)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [AdMob ヘルプ](https://support.google.com/admob/)
- [App Store Connect ヘルプ](https://developer.apple.com/help/app-store-connect/)
