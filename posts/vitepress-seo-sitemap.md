---
title: VitePress 博客 SEO 实战：sitemap、TDK、主动推送三步让百度快速收录
date: '2026-09-19'
categories:
  - 博客搭建
tags:
  - VitePress
  - SEO
  - 百度收录
  - 博客
articleGPT: "VitePress 搭的博客发出去没人看？多半是没做 SEO。这篇整理从 sitemap 配置、TDK 标签到百度主动推送 API 的完整流程，让新文章几天内被百度收录。"
---

# VitePress 博客 SEO 实战：sitemap、TDK、主动推送三步让百度快速收录

静态博客最怕的不是没人写，是写完没人看。VitePress 默认对 SEO 已经很友好（每个页面预渲染成静态 HTML），但要让百度快速收录，还得主动做几件事。

## 一、开启 sitemap：告诉搜索引擎站点地图

VitePress 内置 sitemap 支持，在配置文件里加一行：

```ts
// .vitepress/config.ts
export default defineConfig({
  sitemap: {
    hostname: 'https://你的域名.com',
  },
})
```

构建后 `dist/sitemap.xml` 自动生成，包含所有页面链接。然后去各大站长平台提交：

- **百度搜索资源平台**：https://ziyuan.baidu.com → 普通收录 → sitemap → 填 `https://你的域名/sitemap.xml`
- **Google Search Console**：索引 → 站点地图 → 提交 `sitemap.xml`
- **Bing Webmaster Tools**：同样提交 sitemap

## 二、每个页面写好 TDK：标题、描述、关键词

VitePress 在 frontmatter 里直接控制：

```md
---
title: 文章标题
description: 一句话描述这篇文章讲什么（会出现在搜索结果摘要）
head:
  - - meta
    - name: keywords
      content: 关键词1,关键词2,关键词3
---
```

**关键点**：
- `title` 不要超过 30 个字，百度搜索结果只显示前 30 个左右
- `description` 写一句吸引人的摘要，百度会直接用作搜索结果描述
- `keywords` 现在对百度权重很低，但写上没坏处

## 三、百度主动推送：新文章秒收录

sitemap 是被动等蜘蛛来爬，主动推送更快。百度搜索资源平台提供 API：

```bash
curl -H 'Content-Type:text/plain' --data-binary @urls.txt \
  "http://data.zz.baidu.com/urls?site=https://你的域名&token=你的token"
```

把新文章 URL 一行一个写进 `urls.txt`，跑这个 curl 就推送了。配合 GitHub Actions，每次 push 后自动推送新文章 URL：

```yaml
- name: Push new URLs to Baidu
  run: |
    echo "https://你的域名/posts/$(git diff HEAD~1 --name-only | grep 'posts/.*\.md' | head -1 | sed 's|posts/||;s|\.md||')" > urls.txt
    curl -H 'Content-Type:text/plain' --data-binary @urls.txt \
      "http://data.zz.baidu.com/urls?site=https://你的域名&token=你的token"
```

## 四、别踩的坑

1. **cleanUrls 开了以后 URL 不带 .html**，提交时注意和 sitemap 一致
2. **百度站长平台验证文件**要放在站点根目录，VitePress 放 `public/` 下会自动复制到 dist
3. **404 页面**要做自定义跳转，死链会被降权
4. 移动适配：百度现在优先索引移动端，确保手机端排版正常

## 小结

SEO 不是玄学：sitemap 让蜘蛛能爬全、TDK 让标题摘要好看、主动推送让新文章秒到。三件事配置一次，之后每篇新文章自动生效。
