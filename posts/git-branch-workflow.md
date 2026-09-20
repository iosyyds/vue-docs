---
title: Git 分支管理与团队协作：一套靠谱的工作流
date: '2026-09-15'
categories:
  - 工具资源
tags:
  - Git
  - 协作
  - 版本控制
articleGPT: "这篇文章讲 Git 分支管理与团队协作的最佳实践：分支模型怎么设计、功能分支工作流的完整流程、rebase 与 merge 的区别、冲突怎么解决，以及代码评审与发布流程的配合。"
---

# Git 分支管理与团队协作工作流

一个人开发 Git 随便用，但**团队协作时没有规则就是灾难**。这篇文章给出一套经过实践检验的分支工作流，覆盖日常 90% 的场景。

## 分支模型：主干 + 功能分支

最常用的是 GitHub Flow 变体：

- `main`：随时可发布的主干，永远保持可用
- `feat/xxx`：功能分支，从 main 切出，合并后删除
- `fix/xxx`：修复分支，修 bug 专用

```bash
# 切功能分支（命名带语义）
git checkout -b feat/user-login

# 提交（写清楚"做了什么+为什么"）
git add .
git commit -m "feat: 新增用户登录功能

- 支持邮箱密码登录
- 登录后跳转首页
- 补充登录失败提示"
```

提交信息建议用 `type: 描述` 格式：`feat`（新功能）、`fix`（修复）、`docs`（文档）、`refactor`（重构）、`chore`（杂务）。

## 日常流程

```bash
# 1. 先同步主干
git checkout main
git pull origin main

# 2. 切新分支干活
git checkout -b feat/xxx

# 3. 干完提交
git add . && git commit -m "feat: xxx"

# 4. 推送分支，发 Pull Request
git push origin feat/xxx
```

PR（Pull Request）是团队协作的核心：代码在合并前经过**评审**，而不是直接推到主干。

![Git 分支协作工作流](/images/tutorial/git.svg)

## merge 还是 rebase？

- **merge**：保留完整历史，有合并节点，适合团队协作（安全）
- **rebase**：历史线性干净，但会改写提交，**只在个人分支上用**

```bash
# 合并（默认）
git merge feat/xxx

# 个人分支同步主干（推荐）
git checkout feat/xxx
git rebase main
```

团队项目不要对**共享分支**用 `git push --force` 做 rebase，会害队友。

## 解决冲突

合并时冲突是常态，不要慌：

```bash
# 冲突文件会有标记
<<<<<<< HEAD
// 当前分支的内容
=======
// 要合并进来的内容
>>>>>>> feat/xxx

# 手动改成最终版本，然后：
git add 冲突文件
git commit -m "fix: 解决合并冲突"
```

**预防冲突**：小步提交、频繁同步主干、两个人尽量别同时改同一个文件。

## 常用急救命令

```bash
git log --oneline --graph    # 图形化看历史
git stash                    # 暂存未提交的修改
git stash pop                # 恢复暂存
git cherry-pick 提交ID        # 挑一个提交过来
git reset --soft HEAD~1      # 撤销最近一次提交（保留改动）
git revert 提交ID             # 反做某个提交（安全，会留记录）
git diff --stat              # 看改了哪些文件
```

`revert` 用于已推送的提交（不改写历史），`reset` 用于本地未推送的提交。

## 发布流程建议

1. 功能分支合并到 `main` 后，`main` 自动触发 CI（构建 + 测试）
2. 通过后自动部署到测试环境
3. 需要发版时打 tag：

```bash
git tag -a v1.0.0 -m "v1.0.0 发布"
git push origin v1.0.0
```

配合 GitHub Actions，推到 `main` 自动部署（就像本站博客一样），发布基本全自动。

## 小结

- 主干永远可用，功能在分支上开发
- 提交信息写清楚，PR 必评审
- 共享分支用 merge，个人分支可 rebase
- 冲突别怕，改完 add + commit 就好

好的 Git 工作流不是限制人，而是让每个人都能放心提交、快速交付。
