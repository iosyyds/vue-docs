---
title: 博客 RSS 订阅正确姿势：让读者能在 RSS 阅读器里追更
date: '2026-09-19'
categories:
  - 博客
tags:
  - RSS
  - 订阅
  - 博客
articleGPT: "RSS 没死，反而在复兴。这篇讲静态博客怎么正确生成 RSS/Atom，提交到 RSS 阅读器，让读者不用开网站也能追更。"
---

# 博客 RSS 订阅正确姿势：让读者能在 RSS 阅读器里追更

RSS 这几年反而复兴了——太多人受不了算法推荐，想用 RSS 阅读器按时间线追博客。但很多静态博客的 RSS 要么格式错，要么没做样式，手机打开乱成一锅粥。

## 一、RSS 和 Atom 是什么

- **RSS**（Really Simple Syndication）：XML 格式的文章列表，阅读器定时拉取
- **Atom**：RSS 的标准升级，结构更严谨
- 现代阅读器（Feedly/Inoreader/NetNewsWire）两种都吃

VitePress 有官方 RSS 插件，Hugo 内置，Hexo 有 hexo-generator-feed。

## 二、VitePress 配 RSS

```ts
// .vitepress/config.ts
import { RSSOptions } from 'vitepress-plugin-rss';

export default {
  rss: {
    base: 'https://你的域名',
    title: '小坤哥哥博客',
    description: '记录技术与折腾',
    copyright: 'Copyright (c) 2026 小坤哥哥',
  }
}
```

构建后自动生成 `feed.xml`，把它放到页脚：

```html
<a href="/feed.xml">RSS 订阅</a>
```

## 三、RSS 页别裸 XML

直接访问 `https://你的域名/feed.xml`，浏览器默认把 XML 当代码显示，手机上排版全乱。两种解法：

1. **加 XSL 样式表**：在 feed.xml 头加 `<?xml-stylesheet?>` 引用一个 XSL，浏览器打开时渲染成好看的文章列表
2. **告诉阅读器地址**：HTML `<head>` 里加：
   ```html
   <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml">
   ```
   阅读器订阅时会自动发现

## 四、提交到 RSS 目录

让更多人发现你的 RSS：

- **RSS Search**：https://rsssearchhub.com 提交
- **Feedly**：自己搜索订阅测试
- **友链页写清楚 RSS 地址**

## 五、常见坑

1. **feed.xml 路径和实际不一致**：VitePress 开了 cleanUrls，feed.xml 在根目录就 `/feed.xml`，别写错
2. **文章内容不完整**：RSS 默认只发摘要，想看全文在插件配置里开 `fullText: true`
3. **更新不及时**：RSS 是静态生成的，每次部署才更新，别指望实时
4. **中文乱码**：确保 XML 声明 `encoding="UTF-8"`

## 小结

RSS 是博客"反算法"的基本盘。花 10 分钟配好 feed.xml，加 XSL 样式，页脚放订阅入口，读者就能在阅读器里追更。
