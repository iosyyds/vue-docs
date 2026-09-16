---
title: 给 RSS 订阅加上排版：手机打开 rss.xml 不再是乱码
date: '2026-09-16'
categories:
  - 博客
tags:
  - RSS
  - XSL
  - 排版
  - 订阅
  - 前端
articleGPT: "RSS 订阅文件本质是 XML，电脑浏览器打开还能看个大概，手机上打开就是一大坨乱码源码。这篇文章介绍如何用 XSL（XML 样式表）给 rss.xml 加排版：写一个 rss.xsl 把订阅源渲染成漂亮的响应式页面，再在 rss.xml 里加一行 xml-stylesheet 处理指令，手机电脑打开都清爽。附完整 XSL 关键代码。"
---

# 给 RSS 订阅加上排版：手机打开 rss.xml 不再是乱码

博客的 RSS 订阅地址 `https://xkbk.cn/rss.xml` 一直存在两个问题：电脑上打开底部有乱码，手机上打开就是一整屏的 XML 源码，完全没法看。订阅者要是不懂技术，看到这堆代码直接劝退。

## 为什么是乱的

RSS 是 XML 格式，浏览器默认只做语法高亮，不做排版。手机浏览器窄屏下更是灾难——所有标签、属性、正文全挤在一起。

解决办法：**给 RSS 加一个 XSL 样式表**（XML 版的 CSS），让浏览器把订阅源渲染成漂亮的 HTML 页面。

## 第一步：写 rss.xsl

在博客 `public/` 目录下新建 `rss.xsl`，核心逻辑：把 `<rss><channel>` 里的文章列表 `item` 转成卡片式 HTML。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="rss/channel/title"/> - 订阅</title>
        <style>
          body { font-family: -apple-system, "PingFang SC", sans-serif;
                 background: #f5f7fb; padding: 16px; color: #333; }
          .header { background: linear-gradient(135deg, #425aef, #6b7dff);
                    border-radius: 16px; padding: 24px; color: #fff; }
          .post { background: #fff; border-radius: 14px;
                  padding: 18px 16px; margin-top: 12px; }
          .post h2 { font-size: 17px; }
          .post .time { font-size: 12px; color: #999; }
          .post .desc { font-size: 14px; color: #555; }
        </style>
      </head>
      <body>
        <xsl:apply-templates select="rss/channel"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="rss/channel">
    <div class="header">
      <h1><xsl:value-of select="title"/></h1>
      <div><xsl:value-of select="description"/></div>
    </div>
    <xsl:for-each select="item">
      <div class="post">
        <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
        <div class="time"><xsl:value-of select="pubDate"/></div>
        <div class="desc"><xsl:value-of select="description"/></div>
      </div>
    </xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
```

要点：
- `xsl:for-each` 遍历所有文章，`value-of` 取值，`{link}` 生成可点击链接
- 内联 CSS 做响应式：手机窄屏自动适配，卡片式排列
- 隐藏正文里的图片、摘要用三行省略号，保持页面清爽

## 第二步：在 rss.xml 里挂上样式表

RSS 是构建时生成的（`generateRSS.mjs`），在输出后插入一行处理指令：

```js
rss = rss.replace(
  '<?xml version="1.0" encoding="utf-8"?>',
  '<?xml version="1.0" encoding="utf-8"?>\n' +
  '<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>'
);
```

这行的意思是：**浏览器打开这个 XML 时，用 `/rss.xsl` 来渲染它**。

## 效果

改完重新构建部署：

- **手机**打开 `https://xkbk.cn/rss.xml`：渐变头图 + 卡片式文章列表，标题可点击，摘要清晰，完全正常排版
- **电脑**打开：同样排版，不再有底部乱码
- **RSS 阅读器**（如 Feedly、Inoreader）：不受影响——它们只解析 XML 数据，忽略样式指令

## 踩坑总结

1. `xml-stylesheet` 处理指令必须放在 XML 声明**之后、根元素之前**，位置错了不生效
2. XSL 里用 `value-of` 输出内容会自动转义，天然防注入，别用 `disable-output-escaping` 处理不受信任的内容
3. 移动端别忘记 `<meta name="viewport">`，否则手机上会按桌面宽度渲染

现在订阅地址终于能直接甩给朋友看了，不解释也看得懂。
