# 小坤哥哥博客

基于 [vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve) 主题搭建的个人博客，记录技术分享、生活点滴和日常折腾。

## 快速开始

```bash
# 安装依赖（Node.js >= 20）
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 本地预览
npm run preview
```

## 目录结构

```
├── index.md                    # 首页（layout: home）
├── posts/                      # 文章目录（Markdown 即文章）
│   └── *.md
├── pages/                      # 独立页面
│   ├── archives.md             # 文章归档
│   ├── categories.md           # 分类列表
│   ├── tags.md                 # 标签列表
│   ├── link.md                 # 友情链接
│   ├── about.md                # 关于本站
│   ├── privacy.md              # 隐私政策
│   └── nav.md                  # 网址导航
├── public/                     # 静态资源
└── .vitepress/
    ├── config.mjs              # VitePress 主配置
    ├── init.mjs                # 主题配置加载
    └── theme/
        ├── assets/
        │   ├── themeConfig.mjs # 站点主题配置（站点信息、导航、页脚等）
        │   └── linkData.mjs    # 友链数据
        └── ...                 # 主题源码
```

## 文章 Frontmatter

```yaml
---
title: 文章标题
date: 2026-09-14          # 发布日期（必填，决定排序与归档）
categories: [技术教程]     # 分类
tags: [VitePress, 博客]    # 标签
description: 文章描述
cover: /images/xxx.jpg     # 封面（可选，不填则使用主题默认封面随机展示）
top: true                  # 是否置顶（可选）
---
```

## 站点配置

站点标题、导航、页脚、评论、音乐、搜索等均在 `.vitepress/theme/assets/themeConfig.mjs` 中配置，字段含义见文件内注释。

部署方式与原仓库一致（GitHub Actions 自动构建发布到 GitHub Pages），推送 `main` 分支即可。

## 致谢

- 主题：[vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve)
- 文档框架：[VitePress](https://vitepress.dev/)
