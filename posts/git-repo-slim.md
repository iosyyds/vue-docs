---
title: Git 仓库瘦身：用 filter-repo 清理历史大文件
date: '2026-11-08'
categories:
  - 技术教程
tags:
  - Git
  - 仓库优化
cover: /images/covers/cover_git-slim.jpg
articleGPT: "仓库克隆越来越慢、体积涨到几个 G，通常不是代码多，而是历史里混进了大文件。git filter-repo 能从所有提交中彻底删除指定路径或超大文件，本文给出完整操作和误删后的恢复方案。"
---

# Git 仓库瘦身：用 filter-repo 清理历史大文件

博客仓库从几十兆涨到 800 MB，`git clone` 从几秒变成几分钟，GitHub Actions 每次构建都要完整拉一遍历史。打开 `.git` 目录一看，问题出在几年前误提交的几个视频和 PSD 源文件——即使后来删掉了，它们仍留在历史提交里。

`git rm` 只是让文件不再出现在最新版本，删不掉历史。真正清理要用 `git filter-repo`。

![仓库体积膨胀的常见原因](/images/tutorial/git-slim-1.svg)

## 一、先定位大文件

```bash
# 列出当前版本中最大的 20 个文件
git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  sed -n 's/^blob //p' |
  sort -k2 -nr |
  head -20
```

如果要看历史中所有大对象（包括已删除的）：

```bash
git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  awk '/^blob/ {print $3, $4}' |
  sort -nr | head -20
```

输出第三列是字节数，第四列是路径。锁定目标后再动手。

## 二、安装 filter-repo

```bash
pip install git-filter-repo
# 或者
apt install git-filter-repo
```

注意：新版本 Git 已不推荐 `git filter-branch`，filter-repo 更快也更安全。

## 三、备份之后再做

这一步必须做，filter-repo 会重写全部提交哈希：

```bash
cd ..
git clone --mirror 你的仓库 仓库-backup.git
```

本地已有仓库的话，至少再 clone 一份完整备份，并确认远程有可回退的版本。

## 四、删除指定大文件

```bash
git filter-repo --path assets/video/demo.mp4 --invert-paths
```

`--invert-paths` 表示「删除匹配的路径」，不写这个参数反而是只保留匹配路径，很容易搞反。

批量删除多个路径：

```bash
git filter-repo \
  --path assets/video/demo.mp4 \
  --path assets/psd/banner.psd \
  --path assets/zip/old-theme.zip \
  --invert-paths
```

## 五、按体积阈值清理

不想逐个指定路径，可以按大小一刀切：

```bash
git filter-repo --strip-blobs-bigger-than 10M
```

这会从全部历史里删除所有大于 10 MB 的 blob。执行后先检查关键文件是否误删：

```bash
git log --oneline -10
git ls-files | head -50
```

## 六、推送到远程

filter-repo 会移除原来的 remote（防止误推），需要重新添加：

```bash
git remote add origin git@github.com:用户名/仓库.git
git push --force --all
git push --force --tags
```

**注意**：这会改写远程历史，所有协作者必须重新 clone。个人博客仓库一般只有自己用，风险可控；团队仓库要先通知所有人。

![filter-repo 清理与推送流程](/images/tutorial/git-slim-2.svg)

## 七、清理后的验证

```bash
# 仓库体积
du -sh .git

# 历史中是否还有大对象
git rev-list --objects --all |
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' |
  awk '/^blob/ {print $3, $4}' | sort -nr | head -5
```

正常情况下 `.git` 会从几百兆降到几十兆，clone 时间显著缩短。

## 八、误删了怎么恢复

如果本地备份还在：

```bash
git reset --hard <清理前的提交哈希>
```

如果已经强推到远程且本地备份没了，只能从 GitHub 的事件记录或对象存储备份恢复，成本极高。所以**执行前一定做镜像备份**。

## 九、预防比清理更重要

- 视频、PSD、压缩包不要进 Git，放大文件用对象存储或 Release 附件
- `.gitignore` 里提前写好 `*.psd`、`*.mp4`、`*.zip`
- 提交前用 `git diff --cached --stat` 看体积
- 给仓库加 pre-commit 钩子，单文件超过 5 MB 直接拒绝提交

```bash
# .git/hooks/pre-commit
#!/bin/bash
limit=5242880
for f in $(git diff --cached --name-only --diff-filter=ACM); do
  size=$(git cat-file -s $(git hash-object "$f") 2>/dev/null || echo 0)
  [ "$size" -gt "$limit" ] && echo "文件过大: $f ($size bytes)" && exit 1
done
```

仓库瘦身是一次性的，但「不让大文件进来」是长期习惯。后者成本低得多。
