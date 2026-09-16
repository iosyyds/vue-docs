---
title: 博客上线后必做的三个优化：RSS 排版、51la 统计、畅所欲言留言板
date: '2026-09-15'
categories:
  - 技术教程
tags:
  - RSS
  - 51la
  - 留言板
  - 博客优化
articleGPT: "这篇文章分享博客上线后的三个实用优化：给 rss.xml 加 XSL 样式表让手机打开也有排版、接入 51la 免费流量统计并在关于页展示数据、新增'畅所欲言'留言板页面复用 Twikoo 评论。每一步都有代码和配置说明。"
---

# 博客上线后必做的三个优化：RSS 排版、51la 统计、畅所欲言留言板

博客主体上线后，还有几个影响体验的细节值得折腾：RSS 订阅页排版、访问统计、留言板。这篇把三个优化一次讲清楚。

## 一、给 rss.xml 加排版：XSL 样式表

### 问题

RSS 文件本质是 XML，浏览器直接打开就是一坨代码，**手机上看更乱**。

### 解决：XSL 样式表

给 RSS 配一个 XSL 样式表，浏览器打开 rss.xml 时会自动按样式渲染成美观的文章列表。

**1. 创建 `public/rss.xsl`**（核心结构）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title><xsl:value-of select="rss/channel/title" /></title>
        <!-- 内联 CSS：卡片式列表 + 响应式布局 -->
      </head>
      <body>
        <h1><xsl:value-of select="rss/channel/title" /></h1>
        <ul>
          <xsl:for-each select="rss/channel/item">
            <li>
              <a href="{link}"><xsl:value-of select="title" /></a>
              <p><xsl:value-of select="pubDate" /></p>
              <p><xsl:value-of select="description" /></p>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
```

**2. 让 rss.xml 声明样式表**

RSS 由主题脚本生成（`.vitepress/theme/utils/generateRSS.mjs`），在写入时给头部加一行处理指令：

```js
const rss = feed.rss2().replace(
  '<?xml version="1.0" encoding="utf-8"?>',
  '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>'
);
writeFileSync(path.join(config.outDir, "rss.xml"), rss, "utf-8");
```

**3. 效果**

- 电脑/手机浏览器打开 `/rss.xml`：紫色标题栏 + 文章卡片列表，美观可读
- RSS 阅读器订阅：完全不受影响（阅读器解析的是 XML 本身）

> 顺带提醒：如果电脑上打开 rss.xml 底部出现一段 CSS 乱码，多半是浏览器翻译扩展（如 Google Translate）注入的样式，关掉扩展的翻译功能即可，服务器文件本身是干净的。

## 二、接入 51la 免费流量统计

博客没有统计等于盲人摸象，用免费的 51la 统计（[51.la](https://51.la)）。

### 1. 注册拿统计代码

注册后在后台拿到一段初始化代码：

```html
<script charset="UTF-8" id="LA_COLLECT" src="https://sdk.51.la/js-sdk-pro.min.js"></script>
<script>LA.init({id:"你的统计ID",ck:"你的统计ID"})</script>
```

### 2. 注入到全站 head

Curve 主题在 `themeConfig.mjs` 的 `head` 数组里加：

```js
head: [
  // 51la 统计
  ["script", { charset: "UTF-8", id: "LA_COLLECT", src: "https://sdk.51.la/js-sdk-pro.min.js" }],
  ["script", { children: 'LA.init({id:"你的统计ID",ck:"你的统计ID"})' }],
],
```

### 3. 关于页展示统计数据

主题的"关于本站"页有访问统计卡片，配置里填上统计 ID：

```js
tongji: {
  "51la": "你的统计ID",
},
```

页面会自动调用 `v6-widget.51.la` 的接口展示实时访问数据。

## 三、新增"畅所欲言"留言板

很多博客都有"留言板"页面，让访客留下脚印。Curve 主题实现超简单——**复用评论组件**。

### 1. 创建页面 `pages/message.md`

```md
---
title: 畅所欲言
aside: false
comment: true
---

# 留言板

您可以在此**畅所欲言**，当然，请遵守互联网相关的法律法规。

如果有什么想说的、想问的或者捉住了本站的**虫子🐛**，都欢迎留言告知。

需要添加友链可前往[友情链接](/pages/link)。
```

关键就是 **`comment: true`**——主题的页面模板（`Page.vue`）检测到这个字段就会渲染评论组件：

```vue
<Content :class="..."/>
<Comments v-if="frontmatter.comment" />
```

### 2. 导航加入口

`themeConfig.mjs` 的导航菜单加一项：

```js
{ text: "畅所欲言", link: "/pages/message", icon: "chat" },
```

### 3. 效果

留言板和文章评论**共用同一个 Twikoo 数据库**，访客填昵称+邮箱就能留言，管理面板统一管理。和官方主题站的效果一模一样。

## 总结

三个优化都不难，但带来的体验提升很明显：

| 优化 | 解决的问题 | 成本 |
| --- | --- | --- |
| RSS + XSL | 手机/电脑打开订阅页是一堆代码 | 一个 xsl 文件 |
| 51la 统计 | 不知道有多少人访问 | 免费注册 |
| 畅所欲言 | 访客没有交流入口 | 一个 md 页面 |

折腾完这些，博客才算真正"能打"。后面继续分享更多折腾记录。
