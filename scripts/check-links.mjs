// 友链互相添加检测：构建时抓取每个友链站首页，搜索是否收录本站
// 输出 public/links-status.json（vitepress build 会自动复制到站点根目录）
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MY_SITE = "xkbk.cn";
const MY_NAME = "小坤哥哥";

const timeout = (ms) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms));

let linkData;
try {
  linkData = (await import(path.join(ROOT, ".vitepress/theme/assets/linkData.mjs")))
    .default;
} catch (e) {
  console.error("读取 linkData 失败:", e.message);
  process.exit(1);
}

const friends = (linkData || []).find((t) => t.type === "friends");
const urls = (friends?.typeList || []).map((l) => l.url);

const results = {};
for (const u of urls) {
  try {
    const res = await Promise.race([
      fetch(u, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; LinkChecker/1.0; +https://xkbk.cn)",
        },
        redirect: "follow",
      }),
      timeout(10000),
    ]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const t = (text || "").toLowerCase();
    results[u] =
      t.includes(MY_SITE) || t.includes(MY_NAME) ? "friend" : "pending";
  } catch (e) {
    results[u] = "unknown"; // 抓取失败：不确定
  }
  // 礼貌限速
  await new Promise((r) => setTimeout(r, 300));
}

const out = {
  checkedAt: new Date().toISOString(),
  mySite: MY_SITE,
  map: results,
};

await fs.mkdir(path.join(ROOT, "public"), { recursive: true });
await fs.writeFile(
  path.join(ROOT, "public/links-status.json"),
  JSON.stringify(out, null, 2),
);

const friendCount = Object.values(results).filter((v) => v === "friend").length;
console.log(
  `友链检测完成：共 ${urls.length} 个，已互加 ${friendCount} 个，待回 ${
    Object.values(results).filter((v) => v === "pending").length
  } 个，未知 ${Object.values(results).filter((v) => v === "unknown").length} 个`,
);
