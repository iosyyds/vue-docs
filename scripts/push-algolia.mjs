#!/usr/bin/env node
/**
 * 推送站点文章到 Algolia 索引（DocSearch 记录格式）—— 纯 REST 版
 * 用法：
 *   ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=xxx ALGOLIA_INDEX=xkbk node scripts/push-algolia.mjs
 * 说明：Admin Key 只在本机使用，不会写入仓库。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appId = process.env.ALGOLIA_APP_ID;
const adminKey = process.env.ALGOLIA_ADMIN_KEY;
const indexName = process.env.ALGOLIA_INDEX || "xkbk";

if (!appId || !adminKey) {
  console.error("缺少环境变量：需要 ALGOLIA_APP_ID 和 ALGOLIA_ADMIN_KEY");
  process.exit(1);
}

const api = (path, opts = {}) =>
  fetch(`https://${appId}.algolia.net/1/${path}`, {
    method: opts.method || "GET",
    headers: {
      "X-Algolia-API-Key": adminKey,
      "X-Algolia-Application-Id": appId,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(async (r) => {
    const text = await r.text();
    const data = text ? JSON.parse(text) : {};
    if (!r.ok) throw new Error(`${r.status} ${data.message || text}`);
    return data;
  });

// 等待异步任务完成
const waitTask = async (taskID, timeout = 60000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const t = await api(`indexes/${indexName}/task/${taskID}`);
    if (t.status === "published") return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("任务等待超时");
};

// 提取正文纯文本
const extractText = (body) => {
  return body
    .replace(/^---[\s\S]*?---/, "") // frontmatter
    .replace(/^\s*#+\s+[^\n]+\n?/gm, "") // 标题
    .replace(/```[\s\S]*?```/g, " ") // 代码块
    .replace(/<[^>]+>/g, " ") // HTML
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 链接文字
    .replace(/[*_`~>|#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// 解析 frontmatter
const parseFrontmatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
  return fm;
};

// 收集文章
const records = [];
const postsDir = join(root, "posts");
for (const file of readdirSync(postsDir).filter((f) => f.endsWith(".md"))) {
  const content = readFileSync(join(postsDir, file), "utf-8");
  const fm = parseFrontmatter(content);
  const title = fm.title || file.replace(".md", "");
  const url = `/posts/${file.replace(".md", ".html")}`;
  const text = extractText(content);
  records.push({
    objectID: url,
    url,
    type: "lvl1",
    hierarchy: {
      lvl0: fm.categories || "文章",
      lvl1: title,
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    content: text.slice(0, 500),
    anchor: "",
    tags: (fm.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    date: fm.date || "",
  });
}

console.log(`共 ${records.length} 篇文章，推送到索引 ${indexName} ...`);

// 1. 清空旧记录（索引不存在时忽略）
try {
  const clear = await api(`indexes/${indexName}/clear`, { method: "POST" });
  await waitTask(clear.taskID);
  console.log("已清空旧数据 ✓");
} catch (e) {
  console.log("清空跳过：", e.message);
}

// 2. 全量写入（batch addObject）
const batch = await api(`indexes/${indexName}/batch`, {
  method: "POST",
  body: { requests: records.map((r) => ({ action: "addObject", body: r })) },
});
await waitTask(batch.taskID);
console.log(`推送完成 ✓（${records.length} 条，task ${batch.taskID}）`);

// 3. 索引设置
const settings = await api(`indexes/${indexName}/settings`, {
  method: "PUT",
  body: {
    searchableAttributes: ["hierarchy.lvl1", "content", "tags", "hierarchy.lvl0"],
    attributesToHighlight: ["hierarchy.lvl1", "content"],
    highlightPreTag: "__ais-highlight__",
    highlightPostTag: "__/ais-highlight__",
    customRanking: ["desc(date)"],
  },
});
await waitTask(settings.taskID);
console.log("索引设置已更新 ✓");
