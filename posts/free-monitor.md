---
id: free-monitor
title: 免费网站监控服务推荐：宕了立刻通知你
datetime: '2026-09-14 09:40:00'
category: 工具推荐
tags:
  - 监控
  - 运维
---

# 免费网站监控服务推荐

![封面](/images/covers/cover_free-monitor.jpg)

## 为什么需要网站监控？

你的网站挂了你可能不知道，用户访问的时候才发现已经挂了半天了。一个监控服务能在网站出问题时立刻发通知。

## 推荐列表

### 1. UptimeRobot

- **费用**：免费50个监控
- **间隔**：5分钟检查一次
- **通知**：邮件、Telegram、Webhook
- **优势**：最稳定，老牌服务
- **缺点**：免费版不支持短信

### 2. HetrixTools

- **费用**：免费15个监控
- **优势**：还能监控端口、SSL证书到期、域名到期
- **通知**：邮件

### 3. Uptime Kuma（自建）

- **费用**：完全免费开源
- **部署**：Docker一键部署
- **优势**：数据自己掌控，支持多种通知方式
- **适合**：有自己服务器的用户

```bash
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

### 4. Better Stack

- **费用**：免费10个监控
- **优势**：界面漂亮，状态页好看
- **通知**：邮件、Slack

## 选择建议

| 场景 | 推荐 |
|------|------|
| 不想折腾 | UptimeRobot |
| 想自己掌控 | Uptime Kuma |
| 需要状态页 | Better Stack |

## 总结

免费的监控服务足够个人网站用了，推荐 UptimeRobot 起步。
