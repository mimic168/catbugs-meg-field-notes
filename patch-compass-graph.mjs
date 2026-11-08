import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageDir = path.join(
  root,
  "node_modules",
  "@quartz-community",
  "graph"
);
const patchDir = path.join(root, "compass-patches", "graph-1.0.0");

const packageJson = JSON.parse(
  fs.readFileSync(path.join(packageDir, "package.json"), "utf8")
);

if (packageJson.version !== "1.0.0") {
  console.error(
    `Graph 版本不符：預期 1.0.0，實際 ${packageJson.version}`
  );
  process.exit(1);
}

const files = ["index.js", "components/index.js"];

// 先檢查所有檔案，避免只修補成功一半
for (const file of files) {
  const source = path.join(patchDir, file);
  const target = path.join(packageDir, "dist", file);

  if (!fs.existsSync(source) || !fs.existsSync(target)) {
    console.error(`缺少必要檔案：${file}`);
    process.exit(1);
  }
}

for (const file of files) {
  const source = path.join(patchDir, file);
  const target = path.join(packageDir, "dist", file);

  const custom = fs.readFileSync(source);
  const current = fs.readFileSync(target);

  if (custom.equals(current)) {
    console.log(`SKIP：${file} 已是星海羅盤客製版`);
  } else {
    fs.copyFileSync(source, target);
    console.log(`SUCCESS：已修補 ${file}`);
  }
}

console.log("星海羅盤 Graph 補丁檢查完成");
