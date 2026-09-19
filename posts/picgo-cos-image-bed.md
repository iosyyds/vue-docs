---
title: PicGo + 腾讯云 COS 搭图床：Mac/Windows 一键粘贴上传
date: '2026-09-19'
categories:
  - 运维部署
tags:
  - 图床
  - PicGo
  - 腾讯云COS
  - 写作工具
articleGPT: "博客配图不用愁。这篇讲怎么用 PicGo 配腾讯云 COS，写完文章截图粘贴自动上传、自动插入 Markdown 链接，新用户免费 50GB 存储 180 天。"
---

# PicGo + 腾讯云 COS 搭图床：Mac/Windows 一键粘贴上传

写博客配图最烦的不是写文章，是**图片放哪**。GitHub 仓库塞一堆图会变大，第三方免费图床今天开明天关。自己搭一个稳定图床，PicGo + 腾讯云 COS 是最省心的组合。

## 为什么选这套

- **腾讯云 COS**：新用户 50GB 存储免费 180 天，之后 0.1 元/GB/月，个人博客够用
- **PicGo**：开源客户端，Mac/Windows 都有，截图后 Cmd/Ctrl+V 自动上传、自动复制 Markdown 链接
- **配合 Obsidian/Typora**：PicGo 装好后，Obsidian 插件直接调 PicGo，多平台写作用同一套图床

## 第一步：腾讯云建存储桶

1. 登录腾讯云控制台 → 对象存储 → 创建存储桶
2. 名称随便起（如 `blog-img`），地域选**广州/上海/北京**（就近原则）
3. **访问权限**选公有读私有写（博客图片需要公开访问）
4. 其他默认，创建

## 第二步：拿 API 密钥

1. 控制台右上角 → 访问管理（CAM）→ 新建 API 密钥
2. 保存 SecretId 和 SecretKey（只显示一次）

## 第三步：装 PicGo + COS 插件

1. 下载 PicGo：https://github.com/Molunerfinn/PicGo/releases
2. 打开 PicGo → 插件设置 → 搜索 `cos` → 安装 `pg-node-plugin-tc-cos`
3. 插件配置填：
   - SecretId / SecretKey：刚才的 API 密钥
   - Bucket：`blog-img-1234567890`（存储桶名称加 appid，在 COS 概览页复制）
   - Region：`ap-guangzhou`（你选的地域）
   - 自定义域名：以后绑 CDN 域名时填，现在留空

## 第四步：绑定自定义域名（可选但推荐）

默认域名 `cos.ap-guangzhou.myqcloud.com` 也能访问，但：
- 国内访问稳定但有腾讯云路径
- 绑自己的域名（如 `img.你的域名.com`）更专业
- COS 控制台 → 域名与传输管理 → 自定义源站域名 → 加 CNAME 记录到 COS 提供的域名

## 日常使用

1. 截图（Mac 用 Cmd+Shift+4，Windows 用 Win+Shift+S）
2. 打开 PicGo 主界面 → 剪贴板上传（或装 PicGo 托盘插件自动监听剪贴板）
3. 上传完自动复制 `![图片](https://img.你的域名.com/xxx.png)`，直接粘贴到 Markdown

## 注意

- **别把 SecretKey 提交到公开仓库**，PicGo 配置在本地
- 存储桶设个生命周期：30 天前的临时图自动转低频存储，省钱
- 免费额度用完后，小流量博客一个月也就几块钱

## 小结

PicGo + COS 就是"截图即上传"，写作体验从"找图床→上传→复制链接→粘贴"变成"截图→粘贴"。个人博客配图完全够。
