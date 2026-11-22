---
title: 自建 RSSHub：把全网信息装进 RSS 阅读器
date: '2026-11-04'
categories:
  - 技术教程
tags:
  - RSS
  - 自建服务
  - Docker
cover: /images/covers/cover_rsshub.jpg
articleGPT: "很多网站不提供 RSS，RSSHub 可以把它们变成订阅源。本文用 Docker 在服务器上自建 RSSHub，配置缓存和代理，再把公众号、B站、知乎等源接进阅读器。"
---

# 自建 RSSHub：把全网信息装进 RSS 阅读器

RSS 的好处不用多说：没有算法推荐、没有开屏广告、只看自己订阅的内容。但现实是有不少站点根本不提供 RSS，尤其是国内平台。RSSHub 就是解决这个问题的：它把几百个网站的内容转换成标准 RSS 输出。

公共实例经常限流、路由失效，最稳的办法是自己部署一个。

![RSSHub 的工作方式](/images/tutorial/rsshub-1.svg)

## 一、Docker 一条命令启动

服务器上先确认装了 Docker，然后：

```bash
docker run -d \
  --name rsshub \
  --restart unless-stopped \
  -p 127.0.0.1:1200:1200 \
  -e CACHE_TYPE=redis \
  -e CACHE_EXPIRE=3600 \
  -e NODE_ENV=production \
  diygod/rsshub
```

关键点：

- `-p 127.0.0.1:1200:1200` 只监听本机，避免暴露到公网
- `CACHE_TYPE=redis` 需要另外起一个 Redis，没有的话先用内存缓存（去掉这两个环境变量）
- `CACHE_EXPIRE=3600` 缓存一小时，减少目标站压力，也避免被风控

启动后本机访问 `http://127.0.0.1:1200`，能看到 RSSHub 的首页就成功了。

## 二、配 Redis 缓存（推荐）

```bash
docker run -d --name rsshub-redis --restart unless-stopped \
  -v /www/docker/rsshub/redis:/data \
  redis:7-alpine redis-server --save 60 1
```

然后把上面启动命令里的 `CACHE_TYPE` 保留，Redis 地址通过环境变量指定：

```bash
-e REDIS_URL=redis://rsshub-redis:6379
```

两个容器要在同一个 Docker 网络里，或者直接用宿主机 IP `redis://172.17.0.1:6379`。

## 三、用 Nginx 反向代理并加访问控制

RSSHub 默认没有鉴权，直接暴露公网会被扫到滥用。用 Nginx 加一层 Basic Auth：

```nginx
server {
    listen 443 ssl;
    server_name rss.example.com;

    ssl_certificate     /www/ssl/rss.pem;
    ssl_certificate_key /www/ssl/rss.key;

    location / {
        auth_basic "RSSHub";
        auth_basic_user_file /www/wwwroot/rss.pass;
        proxy_pass http://127.0.0.1:1200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

生成密码文件：

```bash
printf "reader:%s\n" "$(openssl passwd -apr1 '你的密码')" > /www/wwwroot/rss.pass
```

之后订阅地址统一写成 `https://reader:密码@rss.example.com/路由`，大多数阅读器支持在 URL 里带账号密码。

![RSSHub 部署三层结构](/images/tutorial/rsshub-2.svg)

## 四、常用路由示例

RSSHub 的路由格式是 `/<平台>/<参数>`，几个常用的：

```
/bilibili/user/video/123456        # B站 UP 主视频
/zhihu/people/activities/xxx       # 知乎用户动态
/weibo/user/1234567890             # 微博用户
/github/issue/owner/repo           # GitHub Issue
/sspai/matrix                      # 少数派 Matrix
```

公众号没有官方路由，社区有基于搜狗或第三方接口的方案，稳定性一般，建议优先订阅有官方 RSS 的源。

## 五、在阅读器里订阅

把路由拼到自己的域名后面，例如：

```
https://reader:密码@rss.example.com/bilibili/user/video/123456
```

在 Follow、NetNewsWire、Feedly、Inoreader 里添加即可。建议给每个源打上分组标签（技术、资讯、生活），阅读器里按组浏览，避免信息过载。

## 六、维护建议

- **每周看一次日志**：`docker logs --tail 100 rsshub`，路由报错大多是被目标站改了结构
- **缓存别设太短**：低于 15 分钟容易触发目标站风控
- **及时升级镜像**：`docker pull diygod/rsshub && docker restart rsshub`
- **限流保护**：Nginx 层加 `limit_req`，防止单个 IP 把实例打满

自建 RSSHub 的成本就是一台小服务器和每月几块钱流量，换来的是完全可控的信息入口。对讨厌推荐算法的人来说，这笔投入很值。
