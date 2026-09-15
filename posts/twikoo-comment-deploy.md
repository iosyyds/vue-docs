---
title: Twikoo 评论系统免费部署全流程：Vercel + MongoDB Atlas 实战踩坑记
date: '2026-09-15'
categories:
  - 运维部署
tags:
  - Twikoo
  - 评论系统
  - Vercel
  - MongoDB
  - 免费
cover: /images/covers/cover_free-database.jpg
articleGPT: "这篇文章完整记录 Twikoo 评论系统的免费部署方案：为什么放弃宝塔 Docker 改走 Vercel + MongoDB Atlas，每一步怎么操作，以及遇到的两个大坑（bad auth 认证失败、连接串 host 字母与数字混淆）如何排查修复，最后绑定自定义域名让国内访问更快。"
---

# Twikoo 评论系统免费部署全流程：Vercel + MongoDB Atlas 实战踩坑记

![封面](/images/covers/cover_free-database.jpg)

博客迁移到 VitePress 后，评论区用了 Twikoo——免费、开源、数据自己掌握、界面简洁，跟 Curve 主题无缝集成。部署过程踩了不少坑，这篇把完整流程和坑位都写出来。

## 为什么选 Twikoo

| 对比项 | Twikoo | giscus | Valine |
| --- | --- | --- | --- |
| 依赖 | 自建后端，数据自持 | 依赖 GitHub Discussions | 依赖 LeanCloud |
| 国内访问 | 可控（可绑定域名） | 一般 | 一般 |
| 功能 | 评论/回复/管理/防刷 | 基础 | 基础 |
| 免费额度 | Vercel 免费 | 免费 | 免费 |

Twikoo 最大的优势：**数据存在自己的 MongoDB 里**，不依赖第三方平台（GitHub/LeanCloud），随时能导出。

## 方案选择：宝塔 Docker 还是 Vercel？

一开始想在宝塔服务器上用 Docker 部署 Twikoo：

```bash
docker pull imaegoo/twikoo
```

结果**卡死了**——国内服务器拉 Docker Hub 镜像，试了官方源、各种加速源（1ms.run、daocloud 等）都拉不动，折腾几轮放弃。

果断换方案：**Vercel + MongoDB Atlas**，全免费、国内可访问、不用自己维护服务器。

## 第一步：部署 Twikoo 后端到 Vercel

### 1. Fork Twikoo 后端仓库

到 GitHub 找到 `twikoojs/twikoo` 仓库，Fork 到自己账号下。

### 2. Vercel 导入项目

- 打开 [vercel.com](https://vercel.com)，New Project
- 选择刚 Fork 的 twikoo 仓库，Import
- Framework 选 **Other**

### 3. 准备 MongoDB Atlas

Twikoo 需要 MongoDB 存储评论数据，用免费的 Atlas M0 集群：

- 注册 [mongodb.com](https://www.mongodb.com/)，创建 **M0 免费集群**（512MB 存储，够用）
- 左侧 **SECURITY → Database Access**，创建数据库用户（记下用户名和密码）
- 拿到连接串，格式如下：

```
mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

### 4. 配置环境变量

回到 Vercel 项目，**Settings → Environment Variables** 添加：

| Key | Value |
| --- | --- |
| `MONGODB_URI` | `mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/?appName=Cluster0` |

然后 **Deployments → Redeploy** 重新部署。

### 5. 验证部署

部署完成后打开 `https://你的项目.vercel.app/`，看到这个 JSON 就成功了：

```json
{"code":100,"message":"Twikoo 云函数运行正常","version":"1.7.24"}
```

## 踩坑一：bad auth 认证失败

部署后访问报 `{"code":1000,"message":"bad auth : authentication failed"}`，排查过程：

1. **Vercel 里密码没改对**：环境变量里填的还是旧密码，重新去 Atlas 的 Database Access 里把密码改成新值（点 Edit → Edit Password → 输入两遍 → Confirm），再更新 Vercel 环境变量
2. **确认密码真的改了**：直接在本地用 MongoDB 官方驱动测试连接，能连上说明配置对，连不上说明 Atlas 里密码还没改对

```js
// 用 Node 测试 MongoDB 连接
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/?appName=test");
client.connect()
  .then(() => console.log("连接成功"))
  .catch(e => console.log("连接失败:", e.message));
```

## 踩坑二：连接串 host 写错，字母和数字分不清

连接串里 `cluster0.xxxxx.mongodb.net` 这一段是从 Atlas 复制的，**注意里面是字母 `i` 还是数字 `1`**——两个长得几乎一样！

- `cluster0.i5bygun.mongodb.net`（字母 i）✓ 正确
- `cluster0.15bygun.mongodb.net`（数字 1）✗ 会报 DNS 不存在

排查方法：直接拼 URL 访问或本地测试连接，报 `DNS lookup` 类错误基本就是 host 写错了。

## 第三步：绑定自定义域名（国内访问更快）

`*.vercel.app` 域名国内访问偶尔慢，绑自己的域名（如 `bk.puaaa.cn`）：

1. **Vercel → 项目 → Settings → Domains**，输入 `bk.puaaa.cn` → Add
2. 到域名商 DNS 管理加一条解析：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| CNAME | bk | cname.vercel-dns.com |

3. 等几分钟，Vercel 自动签发 SSL，`https://bk.puaaa.cn` 能打开就生效

## 第四步：前端接入

博客主题里把评论区切到 Twikoo（Curve 主题在 `themeConfig.mjs`）：

```js
comment: {
  enable: true,
  type: "twikoo",
  twikoo: {
    envId: "https://bk.puaaa.cn/",  // 你的 Twikoo 后端地址
    region: "",                     // Vercel 环境不填
    lang: "zh-CN",
  },
},
```

重新构建部署，文章页评论区就变成 Twikoo 了。

## 管理评论

Twikoo 自带管理面板：点击评论区"小齿轮"图标，首次设置管理员密码，之后就能在网页上删除评论、查看访客信息（地域、系统、浏览器），非常方便。

## 总结

整套方案下来 **0 成本**：

| 组件 | 用途 | 费用 |
| --- | --- | --- |
| Vercel | Twikoo 云函数 | 免费 |
| MongoDB Atlas | 评论数据存储 | 免费（M0） |
| 域名 | 评论服务入口 | 已有域名子域名 |

宝塔 Docker 方案在国内拉镜像是个坎，Vercel 方案反而更省心。数据在自己手里，随时能迁移，这就是我选它的原因。
