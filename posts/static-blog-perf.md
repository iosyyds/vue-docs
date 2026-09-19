---
title: 静态博客性能优化清单：首屏 2 秒内加载完
date: '2026-09-19'
categories:
  - 前端
tags:
  - 性能优化
  - VitePress
  - 博客
  - CDN
articleGPT: "博客打开慢？这篇整理静态博客性能优化清单：图片压缩、字体子集化、JS 按需加载、CDN 缓存策略，把首屏压到 2 秒内。"
---

# 静态博客性能优化清单：首屏 2 秒内加载完

静态博客理论上应该秒开，但图片、字体、第三方脚本一多，照样卡。这篇整理从构建到上线的优化清单。

## 一、图片：最大的性能杀手

博客文章图片随便一张截图就 2-3MB，是首屏最大的负担。

- **格式**：用 WebP/AVIF，比 PNG 小 30-50%
- **尺寸**：不要传 4K 原图，博客内容区最大宽 800-1000px 足够
- **懒加载**：`<img loading="lazy">`，VitePress 默认给 markdown 图片加了
- **CDN**：图床绑 CDN，腾讯云 COS 自带 CDN 加速

## 二、字体：子集化 + 系统字体兜底

中文字体文件动辄 5-10MB，是第二大坑。

- **字体子集化**：用 fontmin/中文网字计划把字体按文章用到的字裁剪
- **WOFF2 格式**：比 TTF 小 30%
- **系统字体兜底**：`font-family: -apple-system, "PingFang SC", sans-serif`，别所有站都加载中文 Web 字体
- **font-display: swap**：字体没加载完先用系统字体渲染

## 三、JS/CSS：按需加载

- **VitePress 自带 code split**：每个页面单独 chunk，首屏只加载当前页 JS
- **评论组件异步加载**：Twikoo/Waline 这种第三方脚本用动态 import，不要首屏加载
- **统计/广告脚本**：放 head 但加 `defer`，不阻塞渲染
- **第三方域名预连接**：`<link rel="preconnect" href="https://xxx.com">`

## 四、CDN 缓存策略

Cloudflare/七牛/腾讯云 CDN 都支持按路径配缓存：

```
/assets/*       → 缓存 1 年（文件名带 hash）
/*.html         → 缓存 1 小时（HTML 更新频繁）
/sitemap.xml    → 缓存 6 小时
/favicon.ico    → 缓存 1 个月
```

文件名带 hash 的资源（VitePress 构建出来的 `style.abc123.css`）永久缓存，HTML 短缓存，这是标准做法。

## 五、别踩的坑

1. **首页 Banner 图太大**：超过 200KB 就压一下
2. **侧边栏挂件一堆**：时钟/天气/音乐播放器全是 JS，首屏慢一半
3. **评论区脚本同步加载**：必须 defer 或动态加载
4. **字体文件全量加载**：哪怕只用到 100 个字，别把整个中文字体传上去

## 六、怎么测

- Google PageSpeed Insights：https://pagespeed.web.dev
- Chrome DevTools → Lighthouse → 手机/桌面跑分
- 重点看：First Contentful Paint（首屏渲染）、Largest Contentful Paint（最大内容渲染）、Total Blocking Time（总阻塞时间）

## 小结

静态博客性能 = 图片小 + 字体小 + JS 少 + CDN 缓存对。按这个清单过一遍，首屏从 5 秒压到 2 秒不难。
