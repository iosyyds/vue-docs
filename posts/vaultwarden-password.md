---
title: 自建 Vaultwarden：密码不再交给第三方
date: '2026-11-15'
categories:
  - 技术教程
tags:
  - 密码管理
  - Vaultwarden
  - 自建服务
cover: /images/covers/cover_vaultwarden.jpg
articleGPT: "用同一个密码注册所有网站，等于把全部账号交给一次泄露。Vaultwarden 是 Bitwarden 的轻量自托管版，Docker 一条命令跑起来，浏览器和手机都能自动填充，数据存在自己服务器。"
---

# 自建 Vaultwarden：密码不再交给第三方

密码管理的现实是：几十个网站，如果每个都用不同的强密码，靠脑子记不住；如果都用同一个，任何一个网站泄露，全部账号沦陷。密码管理器是唯一靠谱的中间方案。

Vaultwarden 是 Bitwarden 的服务端轻量实现，内存占用不到 100 MB，树莓派都能跑，客户端可以直接用 Bitwarden 官方 App。

![Vaultwarden 的同步架构](/images/tutorial/vaultwarden-1.svg)

## 一、Docker 部署

```bash
docker run -d \
  --name vaultwarden \
  --restart unless-stopped \
  -p 127.0.0.1:8080:80 \
  -v /www/docker/vaultwarden:/data \
  -e SIGNUPS_ALLOWED=false \
  -e ADMIN_TOKEN=$(openssl rand -base64 48) \
  -e DOMAIN=https://pass.example.com \
  vaultwarden/server:latest
```

参数说明：

- `SIGNUPS_ALLOWED=false`：部署完成后关闭注册，只允许已有账号
- `ADMIN_TOKEN`：后台管理令牌，先用随机值，记下来
- `DOMAIN`：公网地址，邮件邀请和客户端配置会用到
- 只监听 `127.0.0.1`，外面用 Nginx 反向代理

启动后先用 `SIGNUPS_ALLOWED=true` 注册自己的账号，注册完再改回 `false` 并重启容器。

## 二、Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    server_name pass.example.com;
    ssl_certificate     /www/ssl/pass.pem;
    ssl_certificate_key /www/ssl/pass.key;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**必须走 HTTPS**。密码管理器在 HTTP 下无法正常工作，浏览器也会拒绝自动填充。

## 三、客户端接入

- 浏览器扩展：Bitwarden（Chrome/Edge/Firefox）
- 手机：Bitwarden App（iOS/Android）
- 桌面：Bitwarden Desktop

登录时点「设置服务器地址」，填 `https://pass.example.com`，然后用注册的账号登录。

登录后把所有旧密码导入：Bitwarden 支持从 1Password、LastPass、Chrome、CSV 导入。**导入完成后逐条改成随机强密码**，这是整个流程里最费时但最关键的一步。

![客户端与自建服务端的连接方式](/images/tutorial/vaultwarden-2.svg)

## 四、开启两步验证

Vaultwarden 支持 TOTP。登录后在「设置 → 安全 → 两步验证」里开启，用 Google Authenticator 或 1Password 扫码绑定。

**注意**：开启 2FA 后一定要保存恢复码，手机丢了又没有恢复码会被锁在外面。

## 五、备份（密码库丢了比泄露更麻烦）

数据都在 `/www/docker/vaultwarden`，核心是 `db.sqlite3`：

```bash
# 每天备份
tar czf /backup/vaultwarden-$(date +%F).tar.gz -C /www/docker vaultwarden
```

备份文件也要加密存放，因为里面是所有密码的密文库（虽然主密码保护，但多一层没坏处）。

建议再导出一份**应急清单**：把最重要的 10 个账号（邮箱、银行、域名、服务器）的密码打印出来锁在抽屉里，防止自己忘记主密码。

## 六、安全加固

- 关闭注册（`SIGNUPS_ALLOWED=false`）
- 开启登录失败限流（`LOGIN_RATELIMIT_MAX_BURST=10`）
- 绑定域名只走 HTTPS，禁用 HTTP
- 定期 `docker pull vaultwarden/server:latest && docker restart vaultwarden` 更新
- 不要用弱主密码，主密码是唯一入口

## 七、和云密码管理器怎么选

| 维度 | Vaultwarden 自建 | 商业密码管理器 |
|---|---|---|
| 数据归属 | 完全自己掌控 | 服务商持有 |
| 成本 | 服务器 + 维护 | 订阅费 |
| 可用性 | 自己保证（服务器挂了就打不开） | 厂商 SLA |
| 上手难度 | 需要部署和备份 | 注册即用 |

自建的代价是「服务器挂了密码就取不出来」，所以**备份和应急清单必须做**。如果做不到定期备份，用商业服务反而更稳妥。

## 小结

密码管理器的价值不在于「记住密码」，而在于让每个网站都有独立强密码。自建 Vaultwarden 适合愿意维护服务器的人；不想折腾的话，Bitwarden 官方免费版同样够用——关键是**今天就开始用**，而不是继续用生日加手机号当密码。
