---
title: 从 GitHub Pages 迁到 Cloudflare Pages：国内访问更稳的选择
date: '2026-09-19'
categories:
  - 运维部署
tags:
  - Cloudflare Pages
  - GitHub Pages
  - 迁移
  - 博客
articleGPT: "GitHub Pages 国内访问不稳定，迁到 Cloudflare Pages 是更稳的方案。这篇讲怎么无缝迁移：GitHub 仓库直接连 CF Pages，自定义域名、HTTPS、缓存全免费。"
---

# 从 GitHub Pages 迁到 Cloudflare Pages：国内访问更稳的选择

GitHub Pages 国内访问慢，Cloudflare 橙云只是 CDN 加速，源站还是 GitHub。彻底一点的做法：直接把博客托管迁到 Cloudflare Pages。

## 和 GitHub Pages 的区别

| 维度 | GitHub Pages | Cloudflare Pages |
|------|-------------|------------------|
| 免费额度 | 无限静态文件 | 无限构建次数 + 无限流量 |
| 国内访问 | 慢/不稳定 | 走 CF 节点，更稳 |
| 构建 | GitHub Actions | 内置（直连 GitHub 仓库自动构建） |
| HTTPS | GitHub 提供 | CF 提供 |
| 自定义域名 | 支持 | 支持 |
| 回滚 | 手动 | 每次部署自动留版本，一键回滚 |

## 迁移步骤

### 1. CF Pages 连接仓库

1. 登录 Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. 授权 GitHub，选你的博客仓库
3. 构建配置：
   - Framework preset: VitePress
   - Build command: `npm run build`
   - Build output directory: `.vitepress/dist`
4. 环境变量加 `NODE_VERSION=22`（如果需要）

### 2. 绑自定义域名

1. Pages 项目 → Custom domains → Add domain
2. 输入 `你的域名.com`
3. CF 自动给你 CNAME 记录，如果域名 NS 已在 CF，自动加好 DNS
4. HTTPS 证书自动签发，1-5 分钟生效

### 3. 关掉 GitHub Pages

GitHub 仓库 → Settings → Pages → Source 改成 "Deploy from a branch" 关掉，或者直接删掉。

## 迁移中的注意点

1. **DNS 记录**：迁移前把原来指向 GitHub Pages 的 CNAME/A 记录先留着，CF Pages 配好后再切
2. **sitemap 和 robots.txt**：构建产物里本来就有，不用改
3. **环境变量**：GitHub Actions 里的 Secrets（如百度推送 token）要搬到 CF Pages 的环境变量里
4. **构建命令**：VitePress 的 `npm run build` 输出到 `.vitepress/dist`，和 GitHub Pages 一样
5. **预览部署**：CF Pages 每个 PR 自动给预览 URL，改主题时可以先看效果再合并

## 性能上的差别

- **CF Pages 自带 CDN**：不用再开橙云，源站就是 CF 自己
- **全球节点**：国内访问 CF 香港/新加坡节点，比 GitHub Pages 的美西快
- **无限带宽**：GitHub Pages 有软限制（100GB/月），CF Pages 免费版无限

## 什么时候不迁

- 博客访问量极小（一个月几百 PV），GitHub Pages 够
- 依赖 GitHub Pages 特有的功能（如 GitHub 组织页）
- 已经用 Cloudflare 橙云加速得不错，没必要折腾

## 小结

CF Pages = 免费 CDN + 免费托管 + 自动构建，和 GitHub Pages 用法几乎一样，但国内访问更稳。迁过去 10 分钟搞定。
