---
title: 家庭影音库搭建：Jellyfin + 硬件转码实战
date: '2026-11-11'
categories:
  - 生活折腾
tags:
  - NAS
  - Jellyfin
  - 家庭影音
cover: /images/covers/cover_jellyfin.jpg
articleGPT: "把收藏的电影整理成 Netflix 式的海报墙，手机、电视、平板都能看，这是 Jellyfin 的强项。本文讲 Docker 部署、目录命名规范、硬件转码开启和字幕自动下载。"
---

# 家庭影音库搭建：Jellyfin + 硬件转码实战

硬盘里的电影按文件夹堆着，文件名是 `电影天堂-4K-终极剪辑版.mkv` 这种，想看的时候用播放器一个个找。一旦有了几十部，找片比看片还累。

Jellyfin 能把这些文件整理成带海报、简介、演员表的媒体库，浏览器、电视、手机都能访问，完全免费开源。

![Jellyfin 的整体架构](/images/tutorial/jellyfin-1.svg)

## 一、Docker 部署

```bash
docker run -d \
  --name jellyfin \
  --restart unless-stopped \
  -p 8096:8096 \
  -v /www/docker/jellyfin/config:/config \
  -v /www/docker/jellyfin/cache:/cache \
  -v /mnt/media:/media \
  --device /dev/dri:/dev/dri \
  jellyfin/jellyfin:latest
```

关键参数说明：

- `--device /dev/dri`：把核显直通给容器，用于**硬件转码**
- `/mnt/media:/media`：媒体目录挂载，保持只读也可以（加 `:ro`）
- 数据目录一定要挂出来，重建容器不丢媒体库元数据和播放记录

启动后访问 `http://服务器IP:8096`，按向导设置语言、创建管理员账号。

## 二、媒体目录命名规范

Jellyfin 靠文件名和目录结构匹配元数据。推荐结构：

```
media/
├── movies/
│   └── 星际穿越 (2014)/
│       └── Interstellar.2014.1080p.BluRay.mkv
├── tv/
│   └── 黑镜 (2011)/
│       ├── Season 01/
│       │   ├── Black.Mirror.S01E01.mkv
│       │   └── Black.Mirror.S01E02.mkv
│       └── Season 02/
└── anime/
    └── 进击的巨人 (2013)/
        └── Season 01/
```

三个要点：

- 电影：`标题 (年份)/`，文件名含标题和年份
- 剧集：`剧名 (年份)/Season XX/剧名.SXXEXX.mkv`
- 不要用中文和特殊符号做文件名前缀，刮削器匹配率会下降

## 三、开启硬件转码

转码是把 4K HDR 转成手机能播的 1080p SDR，CPU 软转会吃满所有核心，核显硬转占用不到 10%。

Jellyfin 控制台 → **播放 → 转码**：

- 硬件加速：选 **VAAPI**（Intel/AMD）或 **QSV**（Intel）
- 勾选 **启用硬件解码**：H.264、HEVC、AV1
- 勾选 **启用硬件编码**
- 开启 **低电压解码**（如果有）

验证是否真的在用硬解：

```bash
# 播放一个 4K 视频时执行
docker exec jellyfin vainfo
# 宿主机上看 GPU 占用
intel_gpu_top
```

如果 GPU 占用明显上升、CPU 占用很低，说明硬转生效了。

![硬件转码与软件转码的资源占用对比](/images/tutorial/jellyfin-2.svg)

## 四、自动下载字幕

Jellyfin 内置字幕插件：

控制台 → **插件 → 目录** → 安装 **Open Subtitles** 插件 → 重启 Jellyfin → 在媒体库设置里开启「自动下载字幕」。

字幕语言优先级建议：

```
中文（简体） > 中文（繁体） > 英文
```

下载的字幕默认存在视频同目录，命名规则 `视频名.zh.srt`，Jellyfin 会自动识别。

## 五、远程访问

不建议直接把 8096 端口暴露公网。推荐两种方式：

- **Cloudflare Tunnel**：在 Tunnel 里加一个 `jellyfin.example.com` 的 Public Hostname，指向 `http://内网IP:8096`
- **WireGuard / Tailscale**：只让自己设备组成的虚拟局域网访问

如果要用 Cloudflare Tunnel 看视频，注意大流量可能触发审查，日常看剧用内网直连，出门在外偶尔用 Tunnel。

## 六、客户端推荐

| 平台 | 推荐客户端 |
|---|---|
| Android TV / 电视盒子 | Jellyfin for Android TV |
| iOS / iPadOS | Swiftfin |
| Android 手机 | Jellyfin Mobile |
| Windows / macOS | Jellyfin Media Player |
| 浏览器 | 自带 Web 端 |

电视端建议用 **Infuse** 或 **Swiftfin**，对 HDR、杜比、字幕的支持更好。

## 七、常见问题

**刮削不到海报**。检查文件名是否符合规范，或手动在「识别」里填 TMDB ID（如 `tt0816692`）。

**播放卡顿但 CPU 不满**。多半是网络带宽问题，4K 原盘码率动辄 80 Mbps，千兆内网也要看路由器和网线是否达标。

**字幕乱码**。字幕编码问题，用 `ffmpeg` 转成 UTF-8：

```bash
ffmpeg -i in.ass -c:s webvtt -f webvtt out.vtt
```

**封面墙加载慢**。元数据缓存在 `/config/metadata`，首次刮削会持续一段时间，属正常现象。

把影音库搭好之后，最直接的变化是：找片从「翻文件夹」变成「在电视上选海报」。这件事对家庭娱乐体验的提升，比换一台更大的电视还明显。
