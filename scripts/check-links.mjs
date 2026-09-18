// 友链互相添加检测（v3）：只认站长正式友链
// - 抓取对方首页 + 常见友链子页 HTML
// - 仅识别原生 <a href> 指向 xkbk.cn 的链接；纯文本域名不算
// - 过滤规则：
//     * comment/reply/guestbook/message/feedback 等评论区容器内的链接一律无效
//     * rel 含 "ugc" 的 a 标签无效（UGC 链接）
//     * JS 伪链接(href="javascript:")、iframe 内容、中转跳转链接无效
// - 返回：存在有效回链 / 无有效回链，并备注是否在留言区发现我方链接
// 输出 public/links-status.json（map 兼容旧前端；details 记录明细）
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const MY_SITE = "xkbk.cn";

// 常见友链路径（按概率排序；"" 为首页）
const PATHS = ["", "/friends", "/links", "/link", "/friends/", "/links/"];
const MAX_PATHS_PER_SITE = 4;
const FETCH_TIMEOUT = 6000;
const CONCURRENCY = 6;

// 评论区/UGC 容器关键词（class/id/标签名命中即视为留言区）
const COMMENT_KEYWORDS = [
  "comment", "reply", "guestbook", "message", "feedback",
  "review", "danmaku", "twikoo", "giscus", "waline", "valine",
  "artalk", "utteranc", "discuss", "chat",
];

// 指向本站的原生链接（href 属性值，允许 http/https/协议相对/无协议）
const XKBK_HREF = /href\s*=\s*["'](?:\/\/|https?:\/\/)?(?:www\.)?xkbk\.cn["'\/]/i;
// rel 含 ugc
const UGC_RE = /\brel\s*=\s*["'][^"']*\bugc\b/i;
// JS 伪链接
const JS_HREF = /href\s*=\s*["']\s*javascript:/i;

const timeout = (ms) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 分析一段 HTML：返回 { valid, inComment }
// valid: 存在有效回链（友链板块原生 a href 指向本站）
// inComment: 是否在评论区/留言区发现指向本站的链接（仅备注，不作回链依据）
const analyzeHtml = (html) => {
  const text = html || "";
  // 标签 tokenize
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^"'>])*)>/g;
  // 栈：保存 { tag, attrs, isComment }
  const stack = [];
  let valid = false;
  let inComment = false;
  let m;

  while ((m = tagRe.exec(text)) !== null) {
    const isClose = m[1] === "/";
    const tag = (m[2] || "").toLowerCase();
    const attrs = m[3] || "";

    if (isClose) {
      // 弹出到最近匹配的开标签（含自闭合外的常规闭合）
      const idx = stack.map((s) => s.tag).lastIndexOf(tag);
      if (idx !== -1) stack.splice(idx);
      continue;
    }

    const isSelfClose =
      /\/\s*>$/.test(m[0]) ||
      ["meta", "link", "img", "input", "br", "hr", "source", "wbr", "base", "col", "iframe"].includes(tag);

    if (tag === "a") {
      const isXkbk = XKBK_HREF.test(attrs);
      const isUgc = UGC_RE.test(attrs);
      const isJs = JS_HREF.test(attrs);
      const inCommentary = stack.some((s) => s.isComment);
      if (isXkbk && !isUgc && !isJs) {
        if (inCommentary) {
          inComment = true; // 留言区发现我方链接（不算回链）
        } else {
          valid = true; // 友链板块原生链接 → 有效回链
        }
      }
      if (!isSelfClose) stack.push({ tag, attrs, isComment: false });
      continue;
    }

    // 其他标签入栈，标注是否评论区容器
    const isComment = COMMENT_KEYWORDS.some((k) => attrs.toLowerCase().includes(k));
    if (!isSelfClose) stack.push({ tag, attrs, isComment });
  }

  return { valid, inComment };
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
  return (await res.text()) || "";
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

const results = {}; // map: site -> friend/pending/unknown（兼容前端）
const details = {}; // 明细：{ validIn: "页面路径", inComment: bool, note }
let pendingQueue = [...urls];

const processSite = async (site) => {
  // 本站自身：直接视为已收录（前端单独展示"博主"）
  if (site === `https://${MY_SITE}` || site === `https://${MY_SITE}/` || site === `http://${MY_SITE}`) {
    details[site] = { validIn: "本站", inComment: false, note: "本站" };
    return "friend";
  }
  let sawCommentLink = false;
  for (const p of PATHS.slice(0, MAX_PATHS_PER_SITE)) {
    const url = p === "" ? site : site.replace(/\/?$/, "") + p;
    try {
      const html = await fetchPage(url);
      const { valid, inComment } = analyzeHtml(html);
      if (inComment) sawCommentLink = true;
      if (valid) {
        details[site] = { validIn: p === "" ? "首页" : p, inComment: sawCommentLink, note: "发现有效回链" };
        return "friend";
      }
    } catch (e) {
      // 单页失败继续下一路径
    }
  }
  const note = sawCommentLink
    ? "无有效回链；留言区发现我方链接（UGC，不作依据）"
    : "无有效回链";
  details[site] = { validIn: null, inComment: sawCommentLink, note };
  return "pending";
};

// 并发调度
const run = async () => {
  const workers = Array.from({ length: Math.min(CONCURRENCY, urls.length) }, async () => {
    while (pendingQueue.length) {
      const site = pendingQueue.shift();
      results[site] = await processSite(site);
      await sleep(120);
    }
  });
  await Promise.all(workers);
};

await run();

const out = {
  checkedAt: new Date().toISOString(),
  mySite: MY_SITE,
  map: results,
  details,
};

await fs.mkdir(path.join(ROOT, "public"), { recursive: true });
await fs.writeFile(
  path.join(ROOT, "public/links-status.json"),
  JSON.stringify(out, null, 2),
);

// 控制台友好输出
console.log(`友链检测完成（仅认站长正式友链）：`);
for (const u of urls) {
  const s = results[u];
  const d = details[u] || {};
  if (s === "friend") {
    console.log(`  ✅ ${u} → 存在有效回链（${d.validIn}）`);
  } else if (s === "pending") {
    console.log(`  ⬜ ${u} → 无有效回链${d.inComment ? "；⚠️ 留言区发现我方链接（UGC，不算）" : ""}`);
  } else {
    console.log(`  ❓ ${u} → 抓取失败（未知）`);
  }
}
