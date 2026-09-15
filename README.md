# 小坤哥哥博客

基于 [Hugo](https://gohugo.io/) 与 [Solitude](https://solitude.js.org/) 主题搭建的个人博客，记录技术分享、生活点滴和日常折腾。

## 快速开始

环境要求：Hugo `v0.164.0` 或更高版本（本仓库使用 `v0.166.0`）。

```bash
# 拉取主题子模块
git submodule update --init --recursive

# 本地开发
hugo server

# 构建生产版本
hugo --gc --minify
```

## 目录结构

```
├── hugo.yaml                # 站点主配置（含 Solitude 主题参数）
├── content/
│   ├── posts/               # 文章目录（Markdown 即文章）
│   ├── about/               # 关于本站（数据驱动自 data/about.yaml）
│   ├── links/               # 友情链接（数据驱动自 data/links.yaml）
│   ├── archives/            # 文章归档
│   ├── categories/          # 全部分类
│   ├── tags/                # 全部标签
│   ├── guide/               # Vue 指南等独立页面
│   ├── nav.md               # 个人导航
│   └── privacy.md           # 隐私政策
├── data/                    # 页面数据（about / links）
├── static/                  # 静态资源（favicon、图片等）
└── themes/solitude          # Solitude 主题（Git submodule）
```

## 文章 Frontmatter

```yaml
---
title: 文章标题
date: 2026-09-14          # 发布日期（必填，决定排序与归档）
categories: [技术教程]     # 分类
tags: [Hugo, 博客]         # 标签
description: 文章描述      # 不填则自动取正文摘要
cover: /images/xxx.jpg     # 封面（可选，不填则使用主题默认封面）
toc: true                  # 是否显示目录
comment: true              # 是否开启评论
---
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages（主题子模块会自动初始化）。

## 致谢

- 主题：[hugo-solitude](https://github.com/everfu/hugo-solitude)
- 静态站点生成器：[Hugo](https://gohugo.io/)
