---
title: GitHub Actions 博客自动部署拆解：push 代码到上线只要 2 分钟
date: '2026-09-19'
categories:
  - 运维部署
tags:
  - GitHub Actions
  - CI/CD
  - 博客
articleGPT: "push 完代码怎么自动构建+部署到 GitHub Pages？这篇拆解一个 VitePress 博客的完整 workflow，从 checkout 到 deploy 每一步在干嘛。"
---

# GitHub Actions 博客自动部署拆解：push 代码到上线只要 2 分钟

本地写完文章 push 到 GitHub，2 分钟后线上自动更新——这就是 GitHub Actions。这篇拆解一个博客 workflow 的每一步。

## 完整 workflow 长什么样

`.github/workflows/deploy.yml` 基本结构：

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]        # 推到 main 才触发
  workflow_dispatch:         # 允许手动点按钮触发

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false # 并发不取消，避免部署中断

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm install
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 每一步在干嘛

1. **checkout**：把仓库代码拉到 Actions runner
2. **setup-node**：装 Node.js 22
3. **npm install**：装依赖（有 package-lock.json 会快很多）
4. **npm run build**：VitePress 构建，输出到 `.vitepress/dist`
5. **configure-pages**：配置 GitHub Pages 目标
6. **upload-pages-artifact**：把 dist 打包上传
7. **deploy-pages**：把上传的 artifact 部署到 GitHub Pages CDN

## 加自定义步骤

博客常见的额外步骤：

```yaml
# 1. 构建前跑友链检测
- run: node scripts/check-links.mjs

# 2. 构建后推新文章到百度
- run: |
  curl -H 'Content-Type:text/plain' \
    --data-binary @urls.txt \
    "http://data.zz.baidu.com/urls?site=...&token=..."

# 3. 定时跑
on:
  schedule:
    - cron: '0 20 * * *'  # 北京时间凌晨 4 点
```

## 常见坑

1. **Node 版本不对**：本地 22，Actions 用 20 可能构建失败，在 `setup-node` 写死版本
2. **依赖缓存**：加 `actions/cache@v4` 缓存 node_modules，构建从 2 分钟压到 30 秒
3. **Secrets 存敏感信息**：token 别写死在 yml，用 `${{ secrets.XXX }}`
4. **定时任务延迟**：GitHub Actions 免费版 schedule 触发可能延迟几小时，不是 bug
5. **push 不触发**：用 `GITHUB_TOKEN` 自动 commit 不会触发 workflow（安全限制），用 PAT 才行

## 小结

GitHub Actions 把"本地 build → 传服务器 → 重启"这种手动流程全自动化，push 即部署。博客类项目 workflow 基本是模板，改改 build 命令就行。
