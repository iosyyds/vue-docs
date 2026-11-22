---
title: Cloudflare Tunnel 内网穿透：不开放端口访问家里 NAS
date: '2026-11-10'
categories:
  - 技术教程
tags:
  - Cloudflare
  - 内网穿透
  - NAS
cover: /images/covers/cover_cf-tunnel.jpg
articleGPT: "家里 NAS 想在外面访问，传统做法是端口映射，安全风险大。Cloudflare Tunnel 从内网主动建立出站连接，不开放任何入站端口，还能套上 Cloudflare 的 HTTPS 和访问策略。本文给出零信任配置全流程。"
---

# Cloudflare Tunnel 内网穿透：不开放端口访问家里 NAS

想把家里的 NAS、群晖、Home Assistant 在外面访问，最直接的办法是在路由器上做端口映射。但这意味着把内网服务暴露在公网，被爆破、被扫描、被利用漏洞都是迟早的事。

Cloudflare Tunnel 的思路相反：由内网设备主动向 Cloudflare 建立一条出站隧道，公网只访问 Cloudflare 的边缘节点，家里的路由器一个端口都不用开。

![端口映射与 Tunnel 的流量路径对比](/images/tutorial/cf-tunnel-1.svg)

## 一、准备工作

- 一个 Cloudflare 账号（免费）
- 一个托管在 Cloudflare 的域名（DNS 在 Cloudflare）
- 一台常开的设备：NAS、软路由、树莓派或旧笔记本

## 二、在 NAS 上安装 cloudflared

以群晖 / Linux 为例，官方脚本：

```bash
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 \
  -o /usr/local/bin/cloudflared
chmod +x /usr/local/bin/cloudflared
cloudflared --version
```

如果是 Docker 环境，用官方镜像：

```bash
docker run -d --name cloudflared --restart unless-stopped \
  --network host \
  cloudflare/cloudflared:latest tunnel --no-autoupdate run --token <TOKEN>
```

## 三、在 Cloudflare 后台创建 Tunnel

Zero Trust 控制台 → **Networks → Tunnels → Create a tunnel**：

1. 选择 **Cloudflared** 连接器
2. 给隧道起名（如 `home-nas`）
3. 复制页面给出的 **Token**（只显示一次）
4. 添加 Public Hostname：
   - 域名：`nas.example.com`
   - 服务：`http://192.168.1.10:5000`（NAS 的内网地址）

保存后，Cloudflare 会自动为这个域名创建 CNAME 记录。

## 四、用 Token 启动服务

```bash
cloudflared tunnel run --token <TOKEN>
```

做成系统服务，开机自启：

```bash
cloudflared service install <TOKEN>
systemctl enable --now cloudflared
systemctl status cloudflared
```

看到 `Registered tunnel connection` 就表示隧道建立成功。此时 `https://nas.example.com` 已经能访问家里 NAS。

## 五、加上访问控制（关键一步）

Tunnel 只解决了「不开放端口」，没有解决「谁能访问」。默认公网任何人都能打开你的 NAS 登录页。用 Cloudflare Access 加一层身份验证：

Zero Trust → **Access → Applications → Add application**：

- Application domain：`nas.example.com`
- Policy：`Allow`，条件设为 **Emails = 你的邮箱**
- 登录方式：One-time PIN（邮箱验证码，免费）

配置完成后，访问域名会先跳到 Cloudflare 登录页，只有你的邮箱收到验证码才能进入。

![Cloudflare Access 的验证流程](/images/tutorial/cf-tunnel-2.svg)

## 六、常见服务端口参考

| 服务 | 内网地址 |
|---|---|
| 群晖 DSM | `http://192.168.1.10:5000` |
| Jellyfin | `http://192.168.1.10:8096` |
| Home Assistant | `http://192.168.1.10:8123` |
| qBittorrent | `http://192.168.1.10:8080` |
| 宝塔面板 | `https://192.168.1.10:8888`（建议加 Access 策略） |

## 七、几个注意事项

**不要让 Tunnel 成为唯一访问方式**。Cloudflare 故障时家里服务也会失联，建议保留局域网直连和一条备用通道。

**注意带宽和条款**。免费版 Tunnel 没有硬性流量限制，但视频流媒体长期大流量使用可能触发审查，个人备份和小流量访问没问题。

**Token 泄露风险**。Token 等于隧道控制权，不要提交到 Git 仓库，不要贴在公开论坛。泄露后到控制台删除隧道重新创建。

**HTTPS 由 Cloudflare 终结**。内网服务可以是 HTTP，浏览器看到的是 Cloudflare 的 HTTPS，证书不用自己配。

## 小结

Cloudflare Tunnel + Access 的组合，本质上是把「内网服务」变成「需要身份验证的私有应用」，而不是「暴露在公网的端口」。对家庭 NAS 来说，这比端口映射安全一个数量级，配置成本也就半小时。
