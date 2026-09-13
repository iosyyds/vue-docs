---
id: blog-setup-guide
title: 个人博客搭建完整指南：从域名到上线
datetime: '2026-09-14 00:00:00'
category: 技术教程
tags:
  - 博客
  - VitePress
---

# 个人博客搭建完整指南：从域名到上线

## 前言

很多人想有自己的个人博客，但觉得技术门槛很高。其实现在用静态站点生成器，半小时就能搭好一个专业的博客。本文记录从零开始搭建一个 VitePress 博客的完整流程。

## 准备工作

你需要：

- 一个 GitHub 账号
- 一个域名（可选，没有也能用 `用户名.github.io`）
- 基础的 Markdown 写作能力

## 第一步：创建项目

推荐使用 VitePress，基于 Vue 构建，速度快、主题多、对中文友好。

```bash
mkdir my-blog && cd my-blog
npm init
npm install -D vitepress
npx vitepress init
```

按照提示选择配置，完成后会生成基础项目结构。

## 第二步：写文章

在 `posts/` 目录下新建 Markdown 文件：

```markdown
---
title: 我的第一篇文章
datetime: '2026-09-14 10:00:00'
category: 随笔
tags:
  - 日常
---

# 我的第一篇文章

这里是正文内容...
```

## 第三步：配置主题

推荐使用 `vitepress-theme-minimalism` 主题，自带博客布局、分类、标签、归档功能。

```bash
npm install vitepress-theme-minimalism
```

在配置文件中引入即可，详细配置参考主题文档。

## 第四步：部署到 GitHub Pages

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist
      - uses: actions/deploy-pages@v4
```

然后在仓库 Settings → Pages，Source 选择 **GitHub Actions**。

## 第五步：绑定域名

1. 在域名 DNS 管理添加 CNAME 记录，指向 `用户名.github.io`
2. 在仓库 Settings → Pages → Custom domain 填入域名
3. 勾选 Enforce HTTPS

## 进阶功能

- **评论系统**：用 Giscus，基于 GitHub Discussions，完全免费
- **访问统计**：用 Google Analytics 或 Umami
- **广告变现**：Google AdSense
- **站点地图**：VitePress 内置 sitemap 支持

## 总结

搭建个人博客其实很简单，关键是开始写。工具只是辅助，持续输出内容才是最重要的。
