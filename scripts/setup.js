#!/usr/bin/env node

/**
 * テンプレートから新しいプロジェクトを初期化するセットアップスクリプト
 * 使用方法: node scripts/setup.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toScheme(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function toBundleId(orgName, appName) {
  const org = orgName.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const app = appName.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `com.${org}.${app}`;
}

async function main() {
  console.log("\n🚀 React Native Starter Kit セットアップ\n");
  console.log("新しいプロジェクトを設定します。\n");

  // アプリ名を取得
  const appName = await question("アプリ名（例: My App）: ");
  if (!appName.trim()) {
    console.error("❌ アプリ名は必須です");
    process.exit(1);
  }

  // 組織名を取得
  const orgName = await question("組織名（例: mycompany）: ");
  if (!orgName.trim()) {
    console.error("❌ 組織名は必須です");
    process.exit(1);
  }

  const slug = toSlug(appName);
  const scheme = toScheme(appName);
  const bundleId = toBundleId(orgName, appName);

  console.log("\n📋 設定内容:\n");
  console.log(`  アプリ名:      ${appName}`);
  console.log(`  スラッグ:      ${slug}`);
  console.log(`  スキーム:      ${scheme}`);
  console.log(`  バンドルID:    ${bundleId}`);
  console.log("");

  const confirm = await question("この設定で続行しますか？ (y/N): ");
  if (confirm.toLowerCase() !== "y") {
    console.log("❌ セットアップをキャンセルしました");
    process.exit(0);
  }

  // app.json を更新
  const appJsonPath = path.join(__dirname, "..", "app.json");
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));

  appJson.expo.name = appName;
  appJson.expo.slug = slug;
  appJson.expo.scheme = scheme;
  appJson.expo.ios.bundleIdentifier = bundleId;
  appJson.expo.android.package = bundleId;

  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + "\n");
  console.log("✅ app.json を更新しました");

  // package.json を更新
  const packageJsonPath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  packageJson.name = slug;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + "\n"
  );
  console.log("✅ package.json を更新しました");

  // 生成されたフォルダを削除
  const foldersToRemove = ["ios", "android", ".expo"];
  for (const folder of foldersToRemove) {
    const folderPath = path.join(__dirname, "..", folder);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ ${folder}/ を削除しました`);
    }
  }

  console.log("\n🎉 セットアップ完了！\n");
  console.log("次のステップ:");
  console.log("  1. npm install");
  console.log("  2. npx expo prebuild  （ios/ と android/ を生成）");
  console.log("  3. npm run ios  または  npm run android");
  console.log("");
  console.log("EAS Build を使用する場合:");
  console.log("  eas init");
  console.log("");

  rl.close();
}

main().catch((err) => {
  console.error("エラー:", err);
  rl.close();
  process.exit(1);
});
