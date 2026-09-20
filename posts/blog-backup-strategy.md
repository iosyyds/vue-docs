---
title: 博客数据备份策略：别等 GitHub 仓库丢了才后悔
date: '2026-09-19'
categories:
  - 博客搭建
tags:
  - 备份
  - Git
  - 博客
articleGPT: "博客内容就是数字资产。这篇讲三层备份策略：GitHub 主仓库 + 本地备份 + 定时推送到镜像仓库，防止仓库被删、本地硬盘挂、误删文章。"
---

# 博客数据备份策略：别等 GitHub 仓库丢了才后悔

博客写了一年，几百篇文章全在 GitHub 仓库里。仓库被封、本地硬盘挂、误 force push，任何一件事都能让你一年白干。这篇讲三层备份策略。

## 一、第一层：GitHub 主仓库

博客代码和文章都推到 GitHub，这是主版本。注意：

- **开 2FA**：GitHub 账号必须开两步验证，不然密码泄露仓库直接被删
- **保护 main 分支**：Settings → Branches → main 分支加 protection，禁止 force push
- **分支删除保护**：误删分支后 90 天内能恢复

## 二、第二层：本地备份

GitHub 也不是 100% 可靠（虽然很少）。本地定期拉一份：

```bash
# 每天跑一次，拉最新代码到本地备份目录
cd ~/backup/blog
git pull origin main
```

配合 crontab（Mac/Linux）：

```
0 3 * * * cd ~/backup/blog && git pull origin main >> /tmp/blog-backup.log 2>&1
```

## 三、第三层：镜像到另一个远程仓库

把仓库同时推到两个远程，防止 GitHub 单独出问题：

```bash
git remote set-url --add --origin --push https://github.com/用户名/vue-docs.git
git remote set-url --add --origin --push https://gitee.com/用户名/vue-docs.git
```

之后 `git push` 会同时推 GitHub 和 Gitee，两边同步。Gitee 在国内访问快，也是国内备份。

## 四、评论数据别忘

文章在 Git 仓库里，评论数据在后端（Twikoo 的 MongoDB）。这部分也要备：

- **MongoDB Atlas**：免费版自带备份（每 6 小时一次，保留 3 天）
- **定期导出**：写个脚本每月把评论导出成 JSON 存本地
- **管理后台定期看**：评论别攒太多才发现后端挂了

## 五、图床图片

图片在腾讯云 COS / Cloudflare R2：

- **COS 开启版本控制**：误删文件能恢复
- **生命周期规则**：30 天前的文件转低频存储，省钱
- **本地原图保留**：写完文章别删本地截图，图床挂了能重新传

## 六、灾难恢复流程

假设 GitHub 仓库被删了：

1. 从本地备份 `~/backup/blog` 重新 push 到新仓库
2. 改 GitHub remote 地址
3. 重新配 GitHub Actions / CF Pages 连接新仓库
4. 等 10 分钟，站点恢复

整个过程不超过半小时。没有备份的话，一年文章找不回来。

## 小结

备份原则：**3-2-1**——3 份副本、2 种介质、1 份异地。博客就是：GitHub 主仓库 + 本地 + Gitee 镜像，评论单独导一次，图床开版本控制。
