// IndexNow 即时推送：把文章 URL 直接推给 Bing / Yandex 等搜索引擎
// 用法：
//   node scripts/indexnow.mjs            # 推送 sitemap.xml 全量 URL
//   node scripts/indexnow.mjs --changed  # 只推送最近一次提交变更的文章（CI 用这个）
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const HOST = "xkbk.cn";
const SITE = `https://${HOST}`;
// key 文件已放在 public/ 下，部署后可通过 /<key>.txt 访问
const KEY = "a1b2c3d4e5f67890abcdef1234567890";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const root = path.resolve(import.meta.dirname, "..");

function urlsFromSitemap() {
  const file = path.join(root, ".vitepress", "dist", "sitemap.xml");
  if (!fs.existsSync(file)) {
    console.error(`找不到 ${file}，请先 npm run build，或改用 --changed`);
    process.exit(1);
  }
  const xml = fs.readFileSync(file, "utf-8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function changedUrls() {
  const run = (cmd) => {
    try {
      return execSync(cmd, { cwd: root, encoding: "utf-8" }).trim();
    } catch {
      return "";
    }
  };
  let files = run("git diff --name-only HEAD~1 HEAD -- posts/");
  if (!files) files = run("git diff --name-only HEAD^ HEAD -- posts/");
  const urls = files
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f.startsWith("posts/") && f.endsWith(".md"))
    .map((f) => `${SITE}/${f.replace(/\.md$/, "")}`);
  return urls;
}

const useChanged = process.argv.includes("--changed");
const urls = useChanged ? changedUrls() : urlsFromSitemap();

if (!urls.length) {
  console.log("没有需要推送的 URL");
  process.exit(0);
}

console.log(`IndexNow 待推送 ${urls.length} 条：`);
urls.slice(0, 10).forEach((u) => console.log("  " + u));
if (urls.length > 10) console.log(`  ... 其余 ${urls.length - 10} 条`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});

const text = await res.text();
// 200 / 202 均视为成功
if (res.ok) {
  console.log(`IndexNow 推送成功：HTTP ${res.status} ${text || ""}`.trim());
} else {
  console.error(`IndexNow 推送失败：HTTP ${res.status} ${text}`);
  process.exit(1);
}
