---
title: 百度主动推送 API 接入：新文章发布当天就能被收录
date: '2026-09-19'
categories:
  - 博客搭建
tags:
  - 百度
  - SEO
  - GitHub Actions
  - 自动推送
articleGPT: "发了新文章等百度收录要几周？用百度主动推送 API 配合 GitHub Actions，每次 push 自动把新 URL 推给百度，几天内就能收录。"
---

# 百度主动推送 API 接入：新文章发布当天就能被收录

百度收录新站/新文章很慢，sitemap 提交后蜘蛛可能几周才来爬。**主动推送 API** 是官方提供的"敲门砖"接口，你把新文章 URL 直接 POST 给百度，它当天就来爬。

## 一、拿 API 地址

1. 登录百度搜索资源平台 https://ziyuan.baidu.com
2. 站点管理 → 选你的站 → 普通收录 → API 提交
3. 复制接口地址，形如：
   `http://data.zz.baidu.com/urls?site=https://你的域名&token=一串token`

## 二、手动推一次试试

把新文章 URL 写进 `urls.txt`（一行一个）：

```
https://你的域名/posts/new-post
```

然后跑：

```bash
curl -H 'Content-Type:text/plain' \
  --data-binary @urls.txt \
  "http://data.zz.baidu.com/urls?site=https://你的域名&token=你的token"
```

返回 `{"remain":999999,"success":1}` 就是成功了（success=推送成功条数）。

## 三、接入 GitHub Actions 自动推送

把上面的 curl 加进部署 workflow：

```yaml
- name: Push new URLs to Baidu
  env:
    BAIDU_TOKEN: ${{ secrets.BAIDU_TOKEN }}
  run: |
    # 找本次提交新增/修改的 posts 文章
    git diff HEAD~1 --name-only -- 'posts/*.md' \
      | sed 's|posts/|https://你的域名/posts/|;s|\.md$|.html|' \
      > /tmp/urls.txt
    if [ -s /tmp/urls.txt ]; then
      cat /tmp/urls.txt
      curl -H 'Content-Type:text/plain' \
        --data-binary @/tmp/urls.txt \
        "http://data.zz.baidu.com/urls?site=https://你的域名&token=$BAIDU_TOKEN"
    fi
```

token 存到 GitHub 仓库 Secrets（Settings → Secrets and variables → Actions），别写进代码。

## 四、注意事项

1. **每日配额**：普通收录每天 10 万条起步，个人博客完全用不完
2. **只推新 URL**：重复推旧文章没意义，脚本里用 `git diff HEAD~1` 只取本次新文章
3. **推送≠收录**：API 只是告诉百度"来爬"，收录与否还要看内容质量
4. **HTTPS 接口**：百度也支持 `https://data.zz.baidu.com`，用 http 就行
5. **观察收录**：百度搜索资源平台 → 索引量 → 看每天收录曲线

## 小结

主动推送 + GitHub Actions = 零维护。每次 push 代码后自动推新文章 URL，百度当天来爬，几天内收录。比纯靠 sitemap 等蜘蛛快 5-10 倍。
