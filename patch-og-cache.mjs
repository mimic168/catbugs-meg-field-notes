import fs from "node:fs";

const target = "./node_modules/@quartz-community/og-image/dist/index.js";
const source = fs.readFileSync(target, "utf8");
const version = "2";

const original = "const ogImagePath = userDefinedOgImagePath ?? generatedOgImagePath ?? defaultOgImagePath;";
const replacement = `const ogImagePath = userDefinedOgImagePath ?? (generatedOgImagePath ? generatedOgImagePath + "?v=${version}" : defaultOgImagePath);`;

if (source.includes(replacement)) {
  console.log("OG 圖片版本控制已存在");
} else if (!source.includes(original)) {
  console.error("找不到 OG 圖片網址設定，未修改外掛");
  process.exitCode = 1;
} else {
  fs.writeFileSync(target, source.replace(original, replacement));
  console.log("SUCCESS：已加入 OG 圖片版本控制 v" + version);
}
