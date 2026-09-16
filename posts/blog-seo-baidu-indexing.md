---
title: 博客被百度收录全流程：验证、sitemap、主动推送与 over quota 踩坑
date: '2026-09-16'
categories:
  - 博客
  - 技术教程
tags:
  - SEO
  - 百度
  - 收录
  - sitemap
  - robots
  - 踩坑
cover: /images/covers/cover_seo.jpg
articleGPT: "这篇文章完整记录博客被百度收录的实操流程：robots.txt 与 sitemap.xml 的配置检查、百度搜索资源平台添加站点、验证文件部署上线、sitemap 提交，以及 API 主动推送遇到的 over quota（新站配额为 0）问题及应对方案，最后给出没备案域名也能慢慢被收录的务实建议。"
---

# 博客被百度收录全流程：验证、sitemap、主动推送与 over quota 踩坑

![封面](/images/covers/cover_seo.jpg)

博客搭好了、文章也写了不少，但百度搜不到？很多新手都会问"RSS 订阅地址能不能被收录"——先说结论：**RSS 是给读者订阅用的，不是搜索引擎收录的入口**。百度收录靠的是「站点验证 + sitemap 提交 + 主动推送」。这篇把我踩过的坑全写出来。

## 第一步：检查 SEO 基础设施

VitePress 默认不会生成 sitemap，需要在配置里开启（`sitemap` 插件）。我检查了线上状态：

| 项目 | 作用 | 状态 |
|---|---|---|
| `robots.txt` | 告诉爬虫可以抓哪些路径 | 配置 `Allow: /` + 声明 Sitemap |
| `sitemap.xml` | 列出全站所有页面链接 | 自动生成，含全部文章/分类/标签 |
| 页面 title/description | 搜索结果展示的信息 | 主题自带，按文章 frontmatter 生成 |

robots.txt 内容长这样：

```txt
User-agent: *
Allow: /
Allow: /pages/
Allow: /posts/

Sitemap: https://xkbk.cn/sitemap.xml
```

## 第二步：百度搜索资源平台添加站点

1. 打开 https://ziyuan.baidu.com ，用百度账号登录
2. 「用户中心」→「站点管理」→「添加网站」，输入 `https://xkbk.cn`
3. 选择**文件验证**方式，平台会给你一个验证文件（如 `baidu_verify_codeva-xxx.html`）
4. 把验证文件放进博客 `public/` 目录，重新构建部署，线上能访问就点「完成验证」

> 小技巧：验证文件内容就一行随机字符串，放到 `public/` 下 VitePress 会原样复制到站点根目录。

## 第三步：提交 sitemap

验证通过后，「普通收录」→「sitemap」页签，填入：

```
https://xkbk.cn/sitemap.xml
```

百度会定期抓取这个文件，自动发现里面的所有链接（我这边 33 条：首页 + 32 篇文章）。

## 第四步：API 主动推送（踩坑重灾区）

百度给了个主动推送接口，可以把新文章链接实时推给它：

```bash
curl -H 'Content-Type:text/plain' --data-binary @urls.txt \
  "http://data.zz.baidu.com/urls?site=https://xkbk.cn&token=你的token"
```

我把 sitemap 里所有文章链接整理成一个文件推过去，结果：

```json
{"error":400,"message":"over quota"}
```

**over quota = 配额超限**。去后台一看：「今日提交上限：0条，今日提交余额：0条」——**新站点 API 配额默认是 0**，页面提示"填写站点的主体备案号，可以提高每日提交上限"。

也就是说：**没有 ICP 备案的域名，API 主动推送基本用不了**（配额 0）。而备案需要国内服务器 + 域名实名，对 GitHub Pages 免费博客来说门槛有点高。

## 没备案的务实方案

既然 API 推送用不了，就用"慢但有效"的方式：

1. **sitemap 提交**（配额 1 条，人人可用）——上面第三步
2. **持续更新内容**——百度对持续更新的小站抓取频率会逐渐提高
3. **外部链接**——在贴吧、知乎、掘金等平台发文章时挂上博客链接，爬虫顺着外链就来了
4. **等待**——新站收录周期 1-4 周不等，别急

## 其他搜索引擎

- **必应 Bing**（国内可用）：https://www.bing.com/webmasters 提交同样的 sitemap，收录比百度快
- **Google**：Search Console，需要科学上网，可选
- 360 / 搜狗：站长平台价值低，暂不折腾

百度收录没有捷径，把内容做好、sitemap 提交上、持续更新，剩下的交给时间。
