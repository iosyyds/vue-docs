// 友链互相添加检测：构建时抓取每个友链站（首页 + 常见友链子页），检测是否收录本站
// 判定标准：出现指向本站的链接（href/src 含 xkbk.cn）或 本站名称+专属图标 才算好友
// 输出 public/links-status.json（vitepress build 会自动复制到站点根目录）
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MY_SITE = "xkbk.cn";
const MY_NAME = "小坤哥哥";
const MY_LOGO = "xkbk.cn/logo.svg"; // 本站专属友链图标

// 常见友链路径（按出现概率排序；"" 为首页）
const PATHS = ["", "/friends", "/links", "/link", "/friends/", "/links/"];
const MAX_PATHS_PER_SITE = 4; // 每站最多探测页数
const FETCH_TIMEOUT = 6000; // 单页超时
const CONCURRENCY = 6; // 全局并发

const timeout = (ms) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 强命中：页面里出现指向本站的链接（href/src）
const linkRe = /(?:href|src)\s*=\s*["'](?:\/\/|https?:\/\/)?(?:www\.)?xkbk\.cn["'\/]/i;
// 名称 + 专属图标同时出现（友链卡片特征）
const nameRe = new RegExp(MY_NAME);
const logoRe = new RegExp(MY_LOGO.replace(/\./g, "\\."));

const isFriend = (html) => {
  const t = html || "";
  if (linkRe.test(t)) return true;
  // 图标 + 名称 同时出现 → 友链卡片（防止页面里仅闲聊提及名称）
  if (nameRe.test(t) && logoRe.test(t)) return true;
  return false;
};

const fetchPage = async (url) => {
  const res = await Promise.race([
    fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; LinkChecker/1.0; +https://xkbk.cn)",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    }),
    timeout(FETCH_TIMEOUT),
  ]);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return text || "";
};

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
let pendingQueue = [...urls];
let active = 0;

const processSite = async (site) => {
  // 依次探测各路径：首页先行，命中即返回
  for (const p of PATHS.slice(0, MAX_PATHS_PER_SITE)) {
    const url = p === "" ? site : site.replace(/\/?$/, "") + p;
    try {
      const html = await fetchPage(url);
      if (isFriend(html)) {
        return "friend";
      }
    } catch (e) {
      // 单页失败（404/超时）继续下一个路径
    }
  }
  // 有页面成功但都没命中 → 待回；全部失败 → 未知
  return "pending";
};

// 并发调度
const run = async () => {
  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (pendingQueue.length) {
      const site = pendingQueue.shift();
      results[site] = await processSite(site);
      await sleep(120); // 礼貌限速
    }
  });
  await Promise.all(workers);
};

await run();

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
