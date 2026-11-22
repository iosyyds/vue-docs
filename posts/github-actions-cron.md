---
title: GitHub Actions 定时任务：免费跑备份和监控
date: '2026-11-20'
categories:
  - 技术教程
tags:
  - GitHub Actions
  - 自动化
  - 定时任务
cover: /images/covers/cover_actions-cron.jpg
articleGPT: "GitHub Actions 不只是部署工具，还能当免费定时任务跑：每天备份数据库、定时抓取数据、检查证书过期。本文给出 cron 语法、时区处理、密钥管理和失败通知的完整模板。"
---

# GitHub Actions 定时任务：免费跑备份和监控

GitHub Actions 对公开仓库免费，私有仓库每月也有 2000 分钟额度。跑定时任务通常几秒到几分钟，一个月用不了多少额度，相当于一个免费的任务调度器。

适合放进来的任务：定时备份、抓取数据、检查证书、生成报表、清理过期文件。

![Actions 定时任务的运行流程](/images/tutorial/actions-cron-1.svg)

## 一、最基本的 cron 工作流

`.github/workflows/daily.yml`：

```yaml
name: Daily Backup

on:
  schedule:
    # 每天 UTC 19:00（北京时间 03:00）
    - cron: '0 19 * * *'
  workflow_dispatch:   # 支持手动触发

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run backup script
        run: |
          echo "开始备份：$(date)"
          bash scripts/backup.sh

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: backup-${{ github.run_number }}
          path: backup/
          retention-days: 7
```

**cron 是 UTC 时间**，北京时间减 8 小时。`0 19 * * *` 对应北京时间凌晨 3 点。

## 二、常用 cron 表达式

| 表达式 | 含义（UTC） | 北京时间 |
|---|---|---|
| `0 19 * * *` | 每天 19:00 | 每天 03:00 |
| `0 */6 * * *` | 每 6 小时 | 每 6 小时 |
| `0 1 * * 1` | 每周一 01:00 | 每周一 09:00 |
| `0 0 1 * *` | 每月 1 日 00:00 | 每月 1 日 08:00 |
| `*/10 * * * *` | 每 10 分钟 | 每 10 分钟 |

**注意**：GitHub 的定时任务在高峰期可能延迟，官方说法是「可能延迟数分钟到十几分钟」。对时间精度要求高的任务（比如整点抢购）不适合放这里。

## 三、在任务里使用密钥

不要把密码写进仓库。用仓库的 **Settings → Secrets and variables → Actions**：

```yaml
steps:
  - name: Use secret
    env:
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: ./scripts/backup.sh
```

或者用 Variables（非敏感配置）：

```yaml
env:
  SITE_URL: ${{ vars.SITE_URL }}
```

脚本里通过环境变量读取，不落盘、不打印。日志里出现密钥要立刻删除工作流重跑。

## 四、把备份推到对象存储

```yaml
- name: Configure AWS
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ap-east-1

- name: Upload to S3
  run: |
    aws s3 cp backup.tar.gz s3://your-bucket/backup/$(date +%F).tar.gz
```

## 五、失败时发通知

```yaml
- name: Notify on failure
  if: failure()
  run: |
    curl -X POST "${{ secrets.WEBHOOK_URL }}" \
      -H 'Content-Type: application/json' \
      -d '{"msgtype":"text","text":{"content":"备份任务失败：${{ github.run_id }}"}}'
```

`if: failure()` 只在前面步骤失败时执行，配合企业微信/Telegram/Discord 的 Webhook 都行。

## 六、几个适合放进来的任务

**证书过期检查**：

```yaml
- name: Check SSL expiry
  run: |
    days=$(echo | openssl s_client -servername xkbk.cn -connect xkbk.cn:443 2>/dev/null \
      | openssl x509 -noout -enddate | cut -d= -f2 | xargs -I{} date -d {} +%s)
    left=$(( (days - $(date +%s)) / 86400 ))
    echo "剩余 $left 天"
    [ $left -lt 14 ] && exit 1
```

**定时抓取数据生成 Markdown**：把抓取结果提交回仓库，博客自动更新。注意要配置 `GITHUB_TOKEN` 并有写权限：

```yaml
permissions:
  contents: write

- name: Commit changes
  run: |
    git config user.name "bot"
    git config user.email "bot@users.noreply.github.com"
    git add data/
    git commit -m "chore: update data" || exit 0
    git push
```

**清理旧 artifacts**：用 `actions/delete-package-versions` 或定期手动清理，避免额度被占满。

![适合 Actions 的定时任务类型](/images/tutorial/actions-cron-2.svg)

## 七、限制与注意事项

- **60 天无活动会暂停定时任务**：仓库长期不提交，schedule 会失效，需要定期提交或手动触发
- **单任务最长 6 小时**：超时被杀
- **私有仓库计费**：Linux 每分钟按 1 倍计，Windows/macOS 更贵
- **不要在 Action 里跑重负载**：视频转码、大数据处理不适合，会烧额度
- **时区**：所有 cron 都是 UTC，换算清楚再写

GitHub Actions 的定时能力很适合「轻量、低频、失败可容忍」的任务。真正重要的生产备份，还是建议有独立服务器上的 cron 兜底，不要把所有自动化都押在一个平台上。
