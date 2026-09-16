import { createContentLoader } from "vitepress";
import { writeFileSync } from "fs";
import { Feed } from "feed";
import path from "path";

/**
 * 生成 RSS
 * @param {*} config VitePress buildEnd
 * @param {*} themeConfig 主题配置
 */
export const createRssFile = async (config, themeConfig) => {
  // 配置信息
  const siteMeta = themeConfig.siteMeta;
  const hostLink = siteMeta.site;
  // 建站年份（用于版权）
  const sinceYear = String(themeConfig.since || "").split("-")[0] || "2026";
  // Feed 实例
  const feed = new Feed({
    title: siteMeta.title,
    description: siteMeta.description,
    id: hostLink,
    link: hostLink,
    language: "zh",
    generator: siteMeta.author.name,
    favicon: `${hostLink}/logo.svg`,
    copyright: `Copyright © ${sinceYear}-present ${siteMeta.author.name}`,
    updated: new Date(),
  });
  // 加载文章
  let posts = await createContentLoader("posts/**/*.md", {
    render: true,
  }).load();
  // 日期降序排序
  posts = posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB - dateA;
  });
  for (const { url, frontmatter, html } of posts) {
    // 仅保留最近 10 篇文章
    if (feed.items.length >= 10) break;
    // 文章信息
    let { title, description, date } = frontmatter;
    // 描述缺失时从正文提取摘要
    if (!description && html) {
      description = html
        .replace(/&ZeroWidthSpace;/g, "")
        .replace(/&zwnj;/g, "")
        .replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
      if (description) description += "…";
    }
    // 处理日期
    if (typeof date === "string") date = new Date(date);
    // 添加文章
    feed.addItem({
      title,
      id: `${hostLink}${url}`,
      link: `${hostLink}${url}`,
      description,
      date,
      // updated,
      author: [
        {
          name: siteMeta.author.name,
          email: siteMeta.author.email,
          link: siteMeta.author.link,
        },
      ],
    });
  }
  // 写入文件（标准 XML 模式 + XSL 排版，电脑/手机浏览器打开都有可读样式）
  let rss = feed.rss2();
  // 在 XML 声明后插入 XSL 样式表处理指令（浏览器打开时渲染成排版页面）
  rss = rss.replace(
    '<?xml version="1.0" encoding="utf-8"?>',
    '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>'
  );
  writeFileSync(path.join(config.outDir, "rss.xml"), rss, "utf-8");
};
