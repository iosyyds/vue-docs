---
title: 博客全局搜索接入 Algolia：从配置到首次打开卡顿修复
date: '2026-09-15'
categories:
  - 前端开发
tags:
  - Algolia
  - 搜索
  - 性能优化
  - Vue
cover: /images/covers/cover_performance.jpg
articleGPT: "这篇文章讲 VitePress 博客接入 Algolia 全局搜索的完整过程：注册应用拿到 App ID 和 API Key、配置索引名、脚本推送文章数据，以及解决'首次点搜索卡顿'的三个关键优化——修正 preconnect 域名、页面加载预热连接、搜索弹窗常驻渲染。"
---

# 博客全局搜索接入 Algolia：从配置到首次打开卡顿修复

![封面](/images/covers/cover_performance.jpg)

Curve 主题自带全局搜索（Algolia InstantSearch），配置好之后站内搜索又快又准。但上线后遇到一个烦人的问题：**每次进站第一次点搜索会卡一下，弹窗只有标题、输入框半天才出来**。这篇把接入过程和排查修复全记录下来。

## 一、Algolia 基础配置

### 1. 注册应用

到 [algolia.com](https://www.algolia.com/) 注册，创建 Application，拿到三个关键信息：

| 配置项 | 说明 | 示例 |
| --- | --- | --- |
| App ID | 应用唯一标识 | `0NOSBY3UK7` |
| Search-Only API Key | 前端用的只读密钥 | `aedc18...` |
| Index Name | 索引名 | `xkbk` |

### 2. 主题里配置

Curve 主题在 `themeConfig.mjs` 里配置：

```js
search: {
  appId: "0NOSBY3UK7",
  apiKey: "aedc18a22fc6eaff146308bbfc164895",  // 只读 Key
  indexName: "xkbk",
},
```

搜索弹窗组件 `Search.vue` 用 `algoliasearch/lite` 的 `liteClient` 创建客户端，模板里是标准的 InstantSearch 结构：

```vue
<ais-instant-search :search-client="searchClient" :index-name="indexName">
  <ais-search-box placeholder="想要搜点什么" autofocus />
  <ais-hits>
    <!-- 搜索结果列表 -->
  </ais-hits>
  <ais-pagination />
  <ais-stats />
</ais-instant-search>
```

### 3. 推送索引数据

文章数据不会自动进 Algolia，需要脚本推送。主题通常带 `scripts/push-algolia.mjs`：

```bash
ALGOLIA_APP_ID=0NOSBY3UK7 \
ALGOLIA_ADMIN_KEY=你的管理员Key \
ALGOLIA_INDEX=xkbk \
node scripts/push-algolia.mjs
```

也可以配 GitHub Actions，每次推文章自动更新索引：

```yaml
- name: Push to Algolia
  env:
    ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
    ALGOLIA_ADMIN_KEY: ${{ secrets.ALGOLIA_ADMIN_KEY }}
    ALGOLIA_INDEX: xkbk
  run: node scripts/push-algolia.mjs
```

> 注意：GitHub Actions 的 `if:` 条件里不能用 `secrets.*`（会导致整个 workflow 解析失败），要用的话把判断逻辑放进脚本里。

## 二、问题：首次点搜索卡顿

上线后用户反馈：**每次进站第一次点搜索，弹窗只出现"全局搜索"标题，输入框和结果区不渲染，要缓一会才正常；第二次点就秒开**。

这种"第一次卡、之后正常"的规律，基本就是**首次网络连接慢 + 组件首次初始化**的组合问题。

## 三、排查与修复（三个关键点）

### 修复 1：preconnect 域名写错了

页面 `<head>` 里有一个预连接标签，本意是提前和 Algolia 服务器建立连接：

```html
<link rel="preconnect" href="https://XXX-dsn.algolia.net" crossorigin>
```

但排查发现：**preconnect 写的是旧账号的域名 `X5EBEZB53I-dsn.algolia.net`，而实际搜索用的是新账号 `0NOSBY3UK7`**。等于预连接连了个寂寞，首次点搜索时浏览器要现场和 Algolia 做 TLS 握手（国内网络下要好几秒）。

修正为实际应用的域名：

```html
<link rel="preconnect" href="https://0NOSBY3UK7-dsn.algolia.net" crossorigin>
```

> Algolia 的查询域名规则：`https://{AppID}-dsn.algolia.net`，别写错 AppID。

### 修复 2：页面加载后后台预热连接

即使 preconnect 修好了，首次点击时 InstantSearch 初始化 + 查询仍然要走一次完整请求。在主题入口 `theme/index.mjs` 里加一个预热逻辑：页面加载完成后，后台先发一次空查询，把连接建立好：

```js
window.addEventListener("load", () => {
  const { appId, apiKey, indexName } = siteData.themeConfig.search;
  fetch(`https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Algolia-Application-Id": appId,
      "X-Algolia-API-Key": apiKey,
    },
    body: JSON.stringify({ query: "", hitsPerPage: 1 }),
  }).catch(() => {});
});
```

这样用户点搜索时连接已经是热的，查询秒回。

### 修复 3：搜索弹窗常驻渲染

最关键的根因：搜索弹窗用的 Modal 组件是 `v-if` 控制显隐——**第一次点搜索时才创建搜索组件**，InstantSearch 要现场初始化、发请求，期间界面只有标题。

改成 `v-show`（常驻渲染、仅控制显隐）：

```vue
<!-- Modal.vue：v-if 改 v-show -->
<div v-show="show" class="modal">
```

这样搜索组件**在页面加载时就初始化完成**，打开弹窗瞬间就是完整界面。同时给 `Search.vue` 补一个打开时自动聚焦输入框的逻辑（v-show 常驻后原 `autofocus` 不再触发）：

```js
watch(() => store.searchShow, (val) => {
  if (val) {
    nextTick(() => document.querySelector(".ais-SearchBox-input")?.focus());
  }
});
```

## 四、效果

三处修复上线后，首次点搜索：

- 修复前：弹窗只有标题，等 2-5 秒才出输入框
- 修复后：点击瞬间输入框、结果区全部就位，直接开搜

**总结排查思路**：遇到"第一次慢、第二次快"，优先查①预连接/预热是否真的连对目标；②组件是否首次打开才初始化（v-if vs v-show）；③是否有外部请求阻塞 UI 渲染。
