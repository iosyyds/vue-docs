// 百度主动推送：把文章 URL POST 给百度，缩短收录周期
// 用法：
//   BAIDU_TOKEN=xxx node scripts/baidu-push.mjs           # 推送全量 sitemap URL
//   BAIDU_TOKEN=xxx node scripts/baidu-push.mjs --changed # 只推送本次变更的文章（CI 用这个）
// token 在百度搜索资源平台 → 站点管理 → 普通收录 → API 提交 里获取
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const SITE = "https://xkbk.cn";
const token = (process.env.BAIDU_TOKEN || "").trim();

if (!token) {
  console.log("未配置 BAIDU_TOKEN，跳过百度推送（拿到 token 后加到仓库 Secrets 即可自动生效）");
  process.exit(0);
}

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
  return files
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f.startsWith("posts/") && f.endsWith(".md"))
    .map((f) => `${SITE}/${f.replace(/\.md$/, "")}`);
}

const useChanged = process.argv.includes("--changed");
const urls = useChanged ? changedUrls() : urlsFromSitemap();

if (!urls.length) {
  console.log("没有需要推送的 URL");
  process.exit(0);
}

console.log(`百度待推送 ${urls.length} 条`);

const res = await fetch(
  `http://data.zz.baidu.com/urls?site=${encodeURIComponent(SITE)}&token=${encodeURIComponent(token)}`,
  {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: urls.join("\n"),
  },
);

const text = await res.text();
console.log(`百度返回：HTTP ${res.status} ${text}`);

try {
  const json = JSON.parse(text);
  if (json.success) {
    console.log(`成功推送 ${json.success} 条，今日剩余额度 ${json.remain}`);
  } else if (json.message) {
    // 常见：over quota（新站配额为 0，需在平台填写备案号提升上限）
    console.log(`百度未接收：${json.message}（error ${json.error}）`);
    process.exitCode = 0;
  }
} catch {
  // 非 JSON 响应不视为错误
}
