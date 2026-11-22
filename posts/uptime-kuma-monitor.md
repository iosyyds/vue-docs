---
title: 自建 Uptime Kuma：网站挂了 10 秒内收到通知
date: '2026-11-06'
categories:
  - 技术教程
tags:
  - 监控
  - Docker
  - 自建服务
cover: /images/covers/cover_uptime-kuma.jpg
articleGPT: "网站是否在线，不能靠自己偶尔想起来才打开看看。Uptime Kuma 能监控 HTTP、TCP、Ping、证书过期，异常时通过邮件、Telegram、企业微信推送。本文用 Docker 部署并配置完整的告警链路。"
---

# 自建 Uptime Kuma：网站挂了 10 秒内收到通知

博客被 DDoS、服务器欠费关机、证书到期、数据库挂掉——这些故障如果靠「自己想起来打开网站看看」，平均发现时间可能是一天。

Uptime Kuma 是一个开源的监控面板，界面类似 UptimeRobot，但数据完全在自己手里，支持 20 多种告警渠道。

![Uptime Kuma 监控与告警链路](/images/tutorial/uptime-kuma-1.svg)

## 一、Docker 部署

```bash
docker run -d \
  --name uptime-kuma \
  --restart unless-stopped \
  -p 127.0.0.1:3001:3001 \
  -v /www/docker/uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

- 只监听本机，后面用 Nginx 反代并加 SSL
- 数据目录挂载出来，容器重建不丢监控配置
- 镜像锁定 `:1` 主版本，避免自动升级到不兼容版本

启动后访问 `http://127.0.0.1:3001`，第一次进入设置管理员账号。

## 二、Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    server_name status.example.com;
    ssl_certificate     /www/ssl/status.pem;
    ssl_certificate_key /www/ssl/status.key;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

必须带 `Upgrade` 头，否则面板的实时状态推送会失效，页面一直转圈。

## 三、新建监控项

点「添加监控」，常用类型：

| 类型 | 用途 | 建议间隔 |
|---|---|---|
| HTTP(s) | 检查页面状态码和响应内容 | 60 秒 |
| TCP | 检查端口是否开放（MySQL、Redis） | 60 秒 |
| Ping | 检查服务器网络可达 | 60 秒 |
| 证书过期 | 提前 14 天提醒 | 每天 |
| Docker 容器 | 检查容器运行状态 | 60 秒 |

**HTTP 监控建议**：URL 填完整地址，勾选「预期状态码 200」，再加一条「响应内容包含关键词」（比如页面标题），这样能发现「返回 200 但内容是错误页」的情况。

## 四、配置告警通知

Uptime Kuma 的告警渠道在「设置 → 通知」里添加。推荐优先级：

1. **Telegram Bot**：免费、即时、稳定，国内需要代理
2. **企业微信机器人**：国内直连，群机器人 Webhook 一分钟搞定
3. **邮件 SMTP**：作为兜底，QQ 邮箱/163 都支持
4. **ServerChan / PushPlus**：国内推送，配置简单

企业微信机器人配置示例：

```
Webhook: https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxx
```

在通知设置里粘贴 Webhook 地址即可。建议**至少配两个渠道**，避免单一渠道失效导致漏报。

![推荐的双渠道告警结构](/images/tutorial/uptime-kuma-2.svg)

## 五、告警策略别配太激进

常见错误：间隔 10 秒、失败 1 次就告警，结果网络抖动一晚上推了 200 条通知，最后直接把通知关了。

推荐的组合：

- **检查间隔 60 秒**
- **重试次数 3 次**（连续失败 3 次才告警）
- **重试间隔 30 秒**
- **恢复通知开启**（知道什么时候恢复同样重要）

这样一次真实故障的通知延迟最多 2 分钟，但误报几乎为零。

## 六、状态页公开

Uptime Kuma 支持创建公开状态页，把博客、API、评论服务的实时状态展示给访客：

状态页 → 新建 → 选择要展示的监控项 → 复制链接（如 `https://status.example.com/status/blog`）。

可以嵌入博客页脚，故障时读者能自己看到状态，不用一封封邮件问「网站怎么打不开了」。

## 七、备份监控配置

数据都在 `/www/docker/uptime-kuma`，直接打包备份：

```bash
tar czf /backup/uptime-kuma-$(date +%F).tar.gz -C /www/docker uptime-kuma
```

监控系统本身挂了就失去了意义，所以它最好放在**和被监控站点不同的服务器**上。条件有限时至少配一个外部告警渠道（如企业微信），避免服务器整机故障时没人知道。
