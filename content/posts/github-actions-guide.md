---
title: "GitHub Actions 自动化部署实战入门"
date: 2026-09-14
slug: github-actions-guide
description: "什么是 GitHub Actions？ GitHub Actions 是 GitHub 提供的 CI/CD 服务，免费额度对于个人项目完全够用：公开仓库无限免费，私有仓库每月2000分钟。 基本概念 Workflow ：一个自动化流程文件 Job ：一个任务，里面包含多个步骤 Step ：具体执行的……"
categories: ["技术教程"]
tags: ["GitHub", "CI/CD"]
cover: "/images/covers/cover_github-actions.jpg"
aliases: [/posts/github-actions-guide]
toc: true
comment: true
---

![封面](/images/covers/cover_github-actions.jpg)

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的 CI/CD 服务，免费额度对于个人项目完全够用：公开仓库无限免费，私有仓库每月2000分钟。

## 基本概念

- **Workflow**：一个自动化流程文件
- **Job**：一个任务，里面包含多个步骤
- **Step**：具体执行的命令
- **Action**：可复用的步骤

## 示例：自动部署到服务器

在仓库 `.github/workflows/deploy.yml` 创建：

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
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/my-blog
            git pull origin main
```

## 配置密钥

在仓库 Settings → Secrets and variables → Actions 里添加：
- `SSH_HOST`：服务器IP
- `SSH_PRIVATE_KEY`：SSH私钥

## 常用场景

- push 代码自动构建部署
- 自动运行测试
- 自动发布 npm 包
- 自动生成文档

## 总结

GitHub Actions 是目前最简单的免费 CI/CD 方案，配置一个 yml 文件就能实现自动化部署。