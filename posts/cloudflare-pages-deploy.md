---
title: Cloudflare Pages 免费部署静态网站完整指南
date: '2026-09-13'
categories:
  - 技术教程
tags:
  - Cloudflare
  - 网站部署
articleGPT: "前言 很多人做完个人博客或者静态网站后，苦于没有便宜好用的托管服务。Cloudflare Pages 就是一个绝佳选择—— 完全免费 、自带 CDN、全球加速、支持自定义域名，还能自动部署。 Cloudflare Pages 优势 完全免费 ：不限流量、不限构建次数 全球 CDN ：300+ 节点加……"
---

# Cloudflare Pages 免费部署静态网站完整指南

## 前言

很多人做完个人博客或者静态网站后，苦于没有便宜好用的托管服务。Cloudflare Pages 就是一个绝佳选择——**完全免费**、自带 CDN、全球加速、支持自定义域名，还能自动部署。

## Cloudflare Pages 优势

- **完全免费**：不限流量、不限构建次数
- **全球 CDN**：300+ 节点加速，国内访问也快
- **自动 HTTPS**：自动签发和续期 SSL 证书
- **Git 自动部署**：连接 GitHub 后 push 代码自动构建
- **预览部署**：每个 PR 自动生成预览链接
- **自定义域名**：免费接入自己的域名

## 部署方式一：Git 连接（推荐）

### 1. 准备代码仓库

确保你的项目已经推送到 GitHub 仓库，并且项目可以构建成静态文件。

### 2. 创建 Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Connect to Git**
4. 授权 Cloudflare 访问你的 GitHub 仓库
5. 选择要部署的仓库

### 3. 配置构建设置

根据你的项目类型填写：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| Project name | 项目名（决定域名） | my-blog |
| Production branch | 生产分支 | main |
| Framework preset | 框架预设 | VitePress |
| Build command | 构建命令 | npm run docs:build |
| Build output directory | 输出目录 | .vitepress/dist |

### 4. 部署完成

点击 **Save and Deploy**，等待 1-2 分钟构建完成。部署成功后会获得一个 `xxx.pages.dev` 的免费域名。

## 部署方式二：直接上传

如果不想连接 Git，也可以直接拖拽上传：

1. Workers & Pages → Create application → Pages
2. 选择 **Direct upload**
3. 输入项目名称
4. 把构建好的静态文件文件夹拖进去
5. 点击 **Deploy site**

这种方式适合纯静态 HTML 页面，缺点是每次更新都要手动上传。

## 绑定自定义域名

1. 在 Pages 项目中进入 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名，比如 `blog.example.com`
4. Cloudflare 会自动配置 DNS 记录
5. 如果域名不在 Cloudflare 管理，需要手动到 DNS 提供商添加 CNAME 记录指向 `xxx.pages.dev`

::: tip 提示
如果你的主域名已经接入 Cloudflare，绑定子域名只需要点几下就自动配置好了。
:::

## 常见问题

### 构建失败怎么办？

检查 Build command 和 output directory 是否正确。在 Cloudflare 的部署日志里可以看到详细错误。

### 自定义域名 404？

- 确认 DNS 记录已生效（可能需要几分钟）
- 确认在 Pages 项目的 Custom domains 里显示 Active
- 清除浏览器缓存后重试

### 国内访问慢？

Cloudflare 免费版国内节点较少，如果主要面向国内用户访问，建议配合国内 CDN 或者使用国内对象存储托管。

## 总结

Cloudflare Pages 对于个人开发者和小型项目来说是最香的免费托管方案之一。配合 GitHub 自动部署，push 代码就能上线，体验非常丝滑。
