import { createContentLoader } from "vitepress";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";

/**
 * 生成全文搜索索引（本地搜索，替代 Algolia）
 * 在 VitePress buildEnd 时调用，产物为 search-index.json
 * @param {*} config VitePress buildEnd config
 * @param {*} themeConfig 主题配置
 */
export const createSearchIndex = async (config, themeConfig) => {
  // 加载全部文章与页面（排除分页、README 等）
  let docs = await createContentLoader(["posts/**/*.md", "pages/**/*.md", "index.md"], {
    render: true,
  }).load();

  // 排除分页页面（内容与首页重复）
  docs = docs.filter((doc) => !doc.url.startsWith("/page/"));

  // 构建索引
  const index = [];
  for (const { url, frontmatter, html } of docs) {
    // 标题
    let title = frontmatter.title || "";
    if (!title && html) {
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1) title = h1[1].replace(/<[^>]+>/g, "").trim();
    }
    // 清理 HTML 实体与零宽字符
    title = title
      .replace(/&ZeroWidthSpace;/g, "")
      .replace(/&zwnj;/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    if (!title) continue;

    // 正文纯文本（去标签、去代码块、压缩空白），截断控制体积
    let content = (html || "")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&ZeroWidthSpace;/g, "")
      .replace(/&zwnj;/g, "")
      .replace(/&[a-zA-Z#0-9]+;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 600);

    if (!content) continue;

    index.push({ title, url, content });
  }

  // 写入 dist（本次构建生效）
  const outPath = path.resolve(config.outDir, "search-index.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(index));

  // 同时写一份到 public（供本地 dev 直接使用）
  const publicDir = path.resolve(config.srcDir, "public");
  writeFileSync(path.resolve(publicDir, "search-index.json"), JSON.stringify(index));
};
