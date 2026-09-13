---
id: free-api-list
title: 免费公共API接口推荐：做项目直接用
datetime: '2026-09-14 10:00:00'
category: 资源推荐
tags:
  - API
  - 开发
---

# 免费公共API接口推荐

![封面](/images/covers/cover_free-api.jpg)

## 前言

做项目经常需要一些公开数据接口，天气、新闻、图片、诗词之类的。整理几个免费好用的。

## 推荐列表

### 1. 天气API

- **OpenWeatherMap**：免费版每天1000次请求
- **和风天气**：国内服务，免费版每天1000次

### 2. 随机图片API

```
https://picsum.photos/800/600    # 随机图片
https://dog.ceo/api/breeds/image/random  # 随机狗图
https://api.vvhan.com/api/randimg  # 随机二次元
```

### 3. 今日热榜

- **DailyHotApi**：开源项目，聚合知乎、微博、B站热榜
- 可以自己部署，也能用公共实例

### 4. IP查询

```
https://ipapi.co/json/    # IP信息
https://api.ip.sb/geoip   # IP归属地
```

### 5. 时间日期

- **World Time API**：全球时间
- **NTP Pool**：时间同步

### 6. 翻译

- **MyMemory API**：免费翻译，每天5000字
- **DeepL**：免费版有限额

## 注意事项

::: warning 注意
- 免费API都有频率限制，不要滥用
- 重要生产环境不要依赖免费API
- 部分API可能随时下线
:::

## 总结

做demo和学习项目完全够用，生产环境还是建议付费稳定的API。
