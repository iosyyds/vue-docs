---
title: 免费SSL证书申请完整指南：Let's Encrypt
date: '2026-09-14'
categories:
  - 博客搭建
tags:
  - SSL
  - HTTPS
articleGPT: "为什么需要SSL证书？ 没有HTTPS的网站会被浏览器标记为\"不安全\"，不仅影响用户体验，还会影响SEO排名。好消息是，你完全可以免费获得受信任的SSL证书。 Let's Encrypt Let's Encrypt https://letsencrypt.org 是目前最流行的免费CA机构，由互联网……"
---

# 免费SSL证书申请完整指南：Let's Encrypt

## 为什么需要SSL证书？

没有HTTPS的网站会被浏览器标记为"不安全"，不仅影响用户体验，还会影响SEO排名。好消息是，你完全可以免费获得受信任的SSL证书。

## Let's Encrypt

[Let's Encrypt](https://letsencrypt.org) 是目前最流行的免费CA机构，由互联网安全研究小组（ISRG）提供，所有主流浏览器都信任它签发的证书。

### 特点

- **完全免费**：不管多少个域名，都不花钱
- **自动续期**：证书90天有效，可以自动续期
- **自动化**：通过ACME协议自动申请和部署
- **支持通配符**：可以申请 `*.example.com` 通配符证书

## 申请方式

### 方式一：certbot（推荐）

certbot是最常用的Let's Encrypt客户端：

```bash
# 安装certbot
sudo apt install certbot

# 手动申请（Web服务器先停掉）
sudo certbot certonly --standalone -d example.com -d www.example.com

# 证书位置
# /etc/letsencrypt/live/example.com/fullchain.pem
# /etc/letsencrypt/live/example.com/privkey.pem
```

### 方式二：宝塔面板

如果用宝塔面板，直接在"网站"设置里点"SSL" → "Let's Encrypt"，勾选域名申请即可，自动续期也帮你配好。

### 方式三：Cloudflare

如果域名在Cloudflare管理，直接开启"SSL/TLS" → "完整"模式，Cloudflare会自动给你配好证书，不用自己申请。

## 自动续期

certbot安装时会自动添加定时任务，检查证书是否快到期：

```bash
# 测试自动续期
sudo certbot renew --dry-run
```

## 总结

免费SSL证书已经非常成熟，Let's Encrypt + certbot 是最稳定的组合。如果你不想折腾，直接用Cloudflare CDN就自动解决了。
