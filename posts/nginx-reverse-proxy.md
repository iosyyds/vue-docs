---
title: Nginx 反向代理配置实战：从入门到 HTTPS
date: '2026-09-15'
categories:
  - 服务器
tags:
  - Nginx
  - 服务器
  - 反向代理
cover: /images/covers/cover_nginx.jpg
articleGPT: "这篇文章讲 Nginx 反向代理的核心用法：正向代理与反向代理的区别、server 和 location 的匹配规则、常用配置模板（静态站点、Node 服务代理、负载均衡），以及配置 HTTPS 证书的完整步骤。"
---

# Nginx 反向代理配置实战：从入门到 HTTPS

![封面](/images/covers/cover_nginx.jpg)

Nginx 是现在最流行的 Web 服务器之一，以高性能、低资源占用著称。很多小项目（Node、Java、静态站）都会用 Nginx 统一对外提供服务。这篇文章从零带你把 Nginx 配明白。

## 反向代理是什么

- **正向代理**：帮客户端访问外部资源（如 VPN、代理上网）
- **反向代理**：帮服务器接收请求并转发给内部服务（客户端感知不到内部结构）

Nginx 做反向代理时，你访问 `https://xkbk.cn`，Nginx 收到请求后转发给本机的 Node 服务（如 `localhost:3000`），用户只看到域名，不暴露真实端口。

![Nginx 反向代理架构](/images/tutorial/nginx.svg)

## 安装与基本命令

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install nginx -y

# 常用命令
sudo systemctl start nginx    # 启动
sudo systemctl enable nginx   # 开机自启
sudo nginx -t                 # 检查配置语法
sudo systemctl reload nginx   # 重载配置（不中断服务）
```

配置文件在 `/etc/nginx/sites-available/`，启用通过软链到 `sites-enabled/`。

## 场景一：托管静态站点

```nginx
server {
    listen 80;
    server_name xkbk.cn www.xkbk.cn;

    root /var/www/xkbk;         # 站点目录
    index index.html;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

## 场景二：代理到 Node 服务

```nginx
server {
    listen 80;
    server_name api.xkbk.cn;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 10s;
        proxy_read_timeout 60s;
    }

    # WebSocket 支持（如聊天、实时推送）
    location /ws {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## 场景三：负载均衡

```nginx
upstream backend {
    server 127.0.0.1:3001 weight=3;
    server 127.0.0.1:3002 weight=1;
    server 127.0.0.1:3003 backup;   # 备用节点
    keepalive 32;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

`weight` 控制流量比例，`backup` 节点只在主节点全部挂掉时启用。

## 配置 HTTPS（Let's Encrypt 免费证书）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx -y

# 自动申请并配置（Nginx 插件会自动改配置）
sudo certbot --nginx -d xkbk.cn -d www.xkbk.cn

# 自动续期（cron 已默认配置，测试一下）
sudo certbot renew --dry-run
```

certbot 会自动完成证书申请、配置 `ssl_certificate`、HTTP 跳转 HTTPS，之后访问网站就是绿色小锁了。配置完记得：

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 常见问题

- **502 Bad Gateway**：后端服务没启动或端口不对，检查 `proxy_pass` 地址
- **404 Not Found**：`root` 路径不对，或 `server_name` 没匹配上
- **403 Forbidden**：目录权限不足，`sudo chown -R www-data:www-data /var/www/xkbk`
- **配置不生效**：改完必须 `systemctl reload` 或 `nginx -s reload`

## 小结

Nginx 配置的核心就是：**server 定域名、location 定路径、proxy_pass 定后端**。掌握这三个概念，再配合 HTTPS，一个生产级站点就能稳定跑起来了。
