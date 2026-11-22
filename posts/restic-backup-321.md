---
title: 个人数据备份 3-2-1：Restic + 对象存储实战
date: '2026-11-14'
categories:
  - 技术教程
tags:
  - 备份
  - Restic
  - 对象存储
cover: /images/covers/cover_restic-321.jpg
articleGPT: "照片、文档、代码一旦丢了就找不回来。3-2-1 原则要求三份副本、两种介质、一份异地。本文用 Restic 做加密增量备份，推到对象存储和另一台服务器，含定时任务与恢复演练。"
---

# 个人数据备份 3-2-1：Restic + 对象存储实战

「备份」这件事最容易犯的错是：以为同步等于备份。网盘同步会把你误删的文件一起同步掉，硬盘 RAID 会把误删同时复制到两块盘。真正的备份要有**独立副本**和**历史版本**。

3-2-1 原则很朴素：**至少 3 份数据、2 种不同介质、1 份异地存放**。

![3-2-1 备份原则的结构](/images/tutorial/restic-1.svg)

## 一、为什么选 Restic

- **加密**：备份文件在云端也是密文，服务商看不到内容
- **增量 + 去重**：第二次备份只传变化的部分，几十 G 的照片库也能每天跑
- **快照式版本**：每次备份是一个快照，可以恢复到任意时间点
- **多后端**：本地磁盘、SFTP、S3、Backblaze B2、阿里云 OSS 都支持

## 二、安装与初始化仓库

```bash
# Ubuntu / Debian
apt install -y restic

# 初始化一个加密仓库（指向对象存储）
export AWS_ACCESS_KEY_ID="你的key"
export AWS_SECRET_ACCESS_KEY="你的secret"
export RESTIC_REPOSITORY="s3:https://s3.example.com/backup-repo"
export RESTIC_PASSWORD="一个强密码"

restic init
```

**密码一定要单独保存**（密码管理器里存一份）。Restic 没有密码无法恢复，丢了等于备份全废。

## 三、备份哪些目录

写一个备份清单，避免漏掉关键数据：

```bash
# 备份脚本 backup.sh
#!/bin/bash
set -e
export RESTIC_REPOSITORY="s3:https://s3.example.com/backup-repo"
export RESTIC_PASSWORD_FILE="/root/.restic-pass"

restic backup \
  /home/user/documents \
  /home/user/photos \
  /www/wwwroot \
  --exclude "*.tmp" \
  --exclude "*/cache/*" \
  --exclude "*/node_modules/*" \
  --tag daily
```

排除规则很重要：缓存、`node_modules`、日志这些天天变又没价值的内容会让备份体积暴涨。

## 四、每天自动执行

crontab：

```bash
crontab -e
```

```cron
# 每天凌晨 3 点增量备份
0 3 * * * /root/backup.sh >> /var/log/restic.log 2>&1

# 每周日清理旧快照（保留 7 天日备、4 周周备、6 个月月备）
30 3 * * 0 restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune >> /var/log/restic.log 2>&1
```

`forget` 只删除快照记录，`prune` 才真正回收空间，两个要连着用。

![每日备份与保留策略的时间轴](/images/tutorial/restic-2.svg)

## 五、多加一份异地副本

3-2-1 里的「2 种介质」可以用「对象存储 + 另一台服务器」实现。Restic 支持一次备份推到多个仓库：

```bash
# 主仓库（对象存储）
restic -r s3:https://s3.example.com/backup-repo backup /home/user/photos

# 副本（另一台服务器的 SFTP）
restic -r sftp:backup@192.168.1.20:/data/restic backup /home/user/photos
```

或者用 `copy` 命令把主仓库的快照复制到副本仓库，只传增量数据：

```bash
restic -r s3:https://s3.example.com/backup-repo copy --to sftp:backup@192.168.1.20:/data/restic
```

## 六、恢复演练（最重要的一步）

没恢复过的备份等于没有备份。每季度做一次：

```bash
# 1. 列出快照
restic snapshots

# 2. 恢复某个快照到临时目录
restic restore latest --target /tmp/restore-test

# 3. 抽查文件完整性
ls -la /tmp/restore-test/home/user/photos | head
md5sum 抽查几个文件和原文件对比
```

恢复时注意 `--target` 会保留原始目录结构，恢复到 `/tmp` 下不会覆盖现有数据。

## 七、常见坑

**备份跑一半失败**。看日志里具体是哪个文件，多半是权限或文件被占用，加 `--ignore-permission-errors` 或先停服务。

**仓库体积没下降**。`forget` 之后没执行 `prune`，或者 prune 被中断。重新执行 `restic prune`。

**忘记密码**。没有后门，密码丢了数据就是随机字节。密码文件至少存三个地方（密码管理器、打印件、可信的家人）。

**备份到同一块硬盘**。这是最常见的伪备份：硬盘一坏，原件和备份一起没。至少一份要在另一台设备或云端。

## 八、成本估算

- 照片文档 50 GB，对象存储约每月 5~10 元（视厂商和存储类型）
- 增量备份每天实际上传几百 MB，流量成本可忽略
- 另一台服务器副本用闲置设备，零额外成本

一个月十块钱以内，换回的是「文件丢了还能找回来」的确定性。这笔账怎么算都值。
