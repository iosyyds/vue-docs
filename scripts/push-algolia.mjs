#!/usr/bin/env node
/**
 * 推送站点文章到 Algolia 索引（DocSearch 记录格式）
 * 用法：
 *   ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=xxx ALGOLIA_INDEX=xkbk node scripts/push-algolia.mjs
 * 说明：Admin Key 只在本机使用，不会写入仓库。
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { algoliasearch } from "algoliasearch";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appId = process.env.ALGOLIA_APP_ID;
const adminKey = process.env.ALGOLIA_ADMIN_KEY;
const indexName = process.env.ALGOLIA_INDEX || "xkbk";

if (!appId || !adminKey) {
  console.error("缺少环境变量：需要 ALGOLIA_APP_ID 和 ALGOLIA_ADMIN_KEY");
  process.exit(1);
}

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

console.log(`共 ${records.length} 篇文章，开始推送到索引 ${indexName} ...`);

const client = algoliasearch(appId, adminKey);
const index = client.initIndex(indexName);

// 清理旧记录后全量写入
try {
  await index.clearObjects();
  const res = await index.saveObjects(records, { autoGenerateObjectIDIfNotExist: false });
  console.log("推送完成：", res.taskIDs?.length ? "任务已提交" : "未知");
} catch (e) {
  console.error("推送失败：", e.message);
  process.exit(1);
}

// 设置可搜索属性（首次需要）
try {
  await index.setSettings({
    searchableAttributes: ["hierarchy.lvl1", "content", "tags", "hierarchy.lvl0"],
    attributesToHighlight: ["hierarchy.lvl1", "content"],
    highlightPreTag: "__ais-highlight__",
    highlightPostTag: "__/ais-highlight__",
    customRanking: ["desc(date)"],
  });
  console.log("索引设置已更新 ✓");
} catch (e) {
  console.warn("设置更新失败（可忽略）：", e.message);
}
