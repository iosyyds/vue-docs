---
title: GitHub Pages 国内访问慢？Cloudflare 橙云加速实测
date: '2026-09-19'
categories:
  - 博客搭建
tags:
  - GitHub Pages
  - Cloudflare
  - CDN
  - 博客
articleGPT: "博客挂 GitHub Pages，国内打开要转半天、CSS 加载超时排版全乱？这篇讲怎么用 Cloudflare 免费 CDN 橙云模式加速，不用备案、不用换服务器。"
---

# GitHub Pages 国内访问慢？Cloudflare 橙云加速实测

静态博客挂 GitHub Pages 最大的痛：**国内不挂梯子根本打不开**。HTML 出来了但 CSS/JS 加载超时，手机上排版全乱。这篇讲最省事的解法——Cloudflare 免费 CDN。

## 为什么慢

GitHub Pages 的服务器在国外（美西），国内移动网络直连 185.199.108.153 这几个 IP 经常被运营商干扰，表现为：
- 首页 HTML 能加载（2-3 秒）
- 但 CSS/JS/字体等静态资源加载超时（20 秒+）
- 手机上看到的是"裸 HTML"：logo 巨大、文字散开

## 解法：Cloudflare 橙云

1. **域名 NS 切到 Cloudflare**（如果还没）：Cloudflare 控制台添加站点后，把域名注册商的 NS 记录改成 Cloudflare 给的两个
2. **DNS 记录改橙云**：DNS → Records → 找到指向 GitHub Pages 的 CNAME/A 记录 → Proxy status 从 **DNS only（灰云）** 切成 **Proxied（橙云）**
3. 等 1-2 分钟生效

橙云模式下：
- 国内用户访问 Cloudflare 边缘节点（香港/新加坡/洛杉矶），不直接连 GitHub
- 静态资源被 CF 缓存，二次访问从 CF 边缘走
- HTTPS 由 CF 免费提供，不用自己管证书

## 灰云 vs 橙云对比

| 模式 | DNS only（灰云） | Proxied（橙云） |
|------|-----------------|----------------|
| 访问路径 | 用户 → GitHub Pages（国外） | 用户 → CF 节点 → GitHub Pages |
| 国内速度 | 慢/不稳定 | 快且稳定 |
| 缓存 | 无 | 有（静态资源秒回） |
| 隐藏源 IP | 否 | 是（防被打） |

## 还能优化什么

- **CF 缓存规则**：Rules → Page Rules → 对 `/assets/*` 设置 Cache Level = Cache Everything
- **自动压缩**：Speed → Optimization → 开启 HTML/CSS/JS Minify
- **Rocket Loader**：可选，延迟加载 JS，但可能影响评论区这种异步组件
- **图片格式**：CF Polish 自动转 WebP（免费版有一定额度）

## 注意

- CF 免费版国内速度不是 BGP 直连，比腾讯云/阿里云 CDN（需备案）慢一些，但比直连 GitHub 稳定太多
- 开橙云后 GitHub 那边 Pages 设置里的 Enforce HTTPS 保持开
- 如果域名没在 CF 而是在别处 DNS 管理，那灰云+国外解析是另一回事，必须把 NS 切到 CF 才能用橙云

## 小结

不花钱、不备案、不换服务器，把 DNS 记录从灰云切橙云，国内访问 GitHub Pages 博客立刻稳定。
