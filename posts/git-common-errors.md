---
title: Git 常见报错解决：merge conflict、detached HEAD、push rejected
date: '2026-09-20'
categories:
  - 工具资源
tags:
  - Git
  - 版本控制
  - 报错解决
articleGPT: "Git 报错别慌。这篇整理新手最常遇到的 6 个 Git 错误：合并冲突、detached HEAD、push 被拒绝、文件名太长、大小写不敏感，每个都给解决方案。"
---

# Git 常见报错解决：merge conflict、detached HEAD、push rejected

![Git 报错解决](https://picsum.photos/seed/git-error/800/400)

用 Git 总会遇到报错，别慌。这篇整理新手最常碰到的 6 个，每个都给解决方案。

## 1. merge conflict（合并冲突）

```
CONFLICT (content): Merge conflict in index.html
```

打开冲突文件，会看到：

```
<<<<<< HEAD
我的代码
=======
别人的代码
>>>>>>> branch-name
```

手动保留正确代码，删掉 `<<<<<<` `=======` `>>>>>>` 标记，然后：

```bash
git add .
git commit -m "解决冲突"
```

## 2. detached HEAD（分离头指针）

```
You are in 'detached HEAD' state...
```

checkout 到某个历史 commit 后改代码，想保存：

```bash
git checkout -b new-branch-name
# 然后正常 commit
git push -u origin new-branch-name
```

## 3. push 被拒绝（rejected）

```
! [rejected] main -> main (fetch first)
```

远程有新提交，本地没拉：

```bash
git pull --rebase origin main
git push origin main
```

## 4. 文件名太长

```
fatal: cannot create ... : File name too long
```

Windows 上常见，开启长路径：

```bash
git config --system core.longpaths true
```

## 5. 大小写不敏感改了文件名

```
# 把 readme.md 改成 README.md
git mv readme.md README.md
git commit -m "rename"
```

Mac 默认大小写不敏感，直接改名 Git 识别不到。

## 6. 撤销最近一次 commit（没推远程）

```bash
git reset --soft HEAD~1
# 代码还在暂存区，改完重新 commit
```

想彻底丢弃：

```bash
git reset --hard HEAD~1
```

## 预防建议

1. 每次 push 前先 `git pull --rebase`
2. 小步提交，别一次改 100 个文件
3. 不确定时 `git status` 看一下
4. 重要操作前 `git log --oneline` 记一下 commit hash

## 小结

Git 报错不可怕，看懂提示就知道怎么修。最常用的就是 `pull --rebase`、`reset --soft`、解决冲突这三个。
