---
title: 网络安全基础：从 HTTPS 原理到常见攻击防范
date: '2026-09-15'
categories:
  - 安全
tags:
  - 安全
  - HTTPS
  - 网络
cover: /images/covers/cover_security.jpg
articleGPT: "这篇文章讲网站安全的基础知识：HTTPS 加密通信的原理、XSS 和 SQL 注入的攻击方式与防御、CORS 与 CSRF 的区别，以及个人站长必备的安全检查清单。"
---

# 网络安全基础：从 HTTPS 原理到常见攻击防范

![封面](/images/covers/cover_security.jpg)

自己做网站，安全是最容易被忽略、出事最麻烦的一环。这篇文章不讲深奥理论，只讲每个站长、开发者都该知道的安全底线。

## HTTPS：让数据在传输中加密

HTTP 是明文传输，你的账号密码在链路上可以被抓包看到。HTTPS = HTTP + TLS 加密。

**工作原理一句话版**：

1. 客户端请求服务器，服务器返回**证书**（含公钥）
2. 客户端验证证书可信（CA 签名），生成对称密钥并用公钥加密发给服务器
3. 之后双方用对称密钥加密通信

**证书怎么来**：用 Let's Encrypt 免费申请，90 天自动续期（参考本站的 SSL 文章）。不要买几千块的证书，免费的完全够用。

![HTTPS 加密通信流程](/images/tutorial/security.svg)

## XSS：往你的页面里注入脚本

**攻击方式**：用户提交的内容里带 `<script>`，你原样渲染到页面，别人的脚本就在你网站上跑（偷 Cookie、弹窗钓鱼）。

**防御**：

1. **输出转义**（最重要）：框架默认转义（Vue/React 模板输出默认转义 `<` 为 `&lt;`），**不要用 `v-html` / `dangerouslySetInnerHTML` 渲染用户输入**
2. **输入校验**：富文本用白名单过滤（只允许安全标签）
3. **HttpOnly Cookie**：JS 读不到，XSS 偷不了登录态

```js
// 错误：直接拼 HTML
document.getElementById("box").innerHTML = userInput;

// 正确：用 textContent
document.getElementById("box").textContent = userInput;
```

## SQL 注入：把 SQL 拼进你的查询

**攻击方式**：输入 `' OR 1=1 --` 拼进 SQL，可能绕过登录、拖库删库。

**防御**：**永远用参数化查询**，不要拼字符串。

```js
// 错误：字符串拼接（危险！）
const sql = `SELECT * FROM users WHERE name = '${input}'`;

// 正确：参数化（安全）
const sql = "SELECT * FROM users WHERE name = ?";
db.query(sql, [input]);
```

只要坚持参数化，SQL 注入基本就堵死了。ORM 框架（Sequelize、TypeORM、Prisma）默认参数化，用它们也能规避。

## CSRF：借你的登录态干坏事

**攻击方式**：你在 A 站登录着，访问了恶意页面，它偷偷向 A 站发请求（带着你的 Cookie），A 站以为是你在操作（改密码、转账）。

**防御**：

1. **CSRF Token**：表单带一个一次性 token，服务端校验
2. **SameSite Cookie**：`Set-Cookie: ...; SameSite=Lax`，跨站请求不带 Cookie
3. **校验 Origin/Referer**：请求来源不是自己站点就拒绝

```text
Set-Cookie: session=xxx; HttpOnly; Secure; SameSite=Lax
```

这一行 Cookie 属性同时防了 XSS 偷取（HttpOnly）和大部分 CSRF（SameSite）。

## CORS 与 CSRF 别搞混

- **CORS**：浏览器限制"跨域读取"响应，是浏览器的安全机制
- **CSRF**：利用登录态发起请求，是"用户被利用"

CORS 配置原则：**只开需要的域名，别用 `*`**：

```text
Access-Control-Allow-Origin: https://trusted.example.com
Access-Control-Allow-Credentials: true
```

## 个人站长安全清单

1. ✅ **全站 HTTPS**：HTTP 强制跳转
2. ✅ **密码安全**：bcrypt/argon2 加密存储，别存明文
3. ✅ **登录防护**：验证码 + 失败次数限制（防暴力破解）
4. ✅ **服务器加固**：改默认 SSH 端口、禁用 root 密码登录、开防火墙
5. ✅ **权限最小化**：数据库账号不给 root，只授权需要的库
6. ✅ **备份**：数据库 + 文件定期备份，异地一份
7. ✅ **依赖更新**：`npm audit` / `pip-audit` 定期扫漏洞
8. ✅ **隐藏敏感信息**：`.env` 不进 Git、日志不打密码

## 小结

安全的本质是**默认不信外部输入**：用户输入要转义、数据库操作要参数化、Cookie 要加 HttpOnly + SameSite、跨域要白名单。把这四条底线守住，网站的安全性就已经超过大多数个人站点。
