import fs from "node:fs";
import path from "node:path";

const target = "./node_modules/@quartz-community/og-image/dist/index.js";
const fontPath = path.resolve("./og-fonts/NotoSansCJKtc-Regular.otf");
const source = fs.readFileSync(target, "utf8");

const original = "  if (fonts.length > 0) {\n    return fonts;\n  }";

const replacement = `  if (fonts.length > 0) {
    const chineseFont = await fs.readFile(${JSON.stringify(fontPath)});
    fonts.push({
      name: "Noto Sans TC",
      data: chineseFont,
      weight: 400,
      style: "normal"
    });
    return fonts;
  }`;

if (source.includes('const chineseFont = await fs.readFile(')) {
  console.log("已經修補過，不需要重複修改");
} else if (!source.includes(original)) {
  console.error("找不到預期的程式碼，未修改外掛");
  process.exitCode = 1;
} else {
  fs.writeFileSync(target, source.replace(original, replacement));
  console.log("SUCCESS：已加入 Noto Sans TC 字型");
}

