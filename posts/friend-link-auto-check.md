---
title: 友链互相添加自动检测：GitHub Actions 构建时抓回链，好友待回一目了然
date: '2026-09-18'
categories:
  - 博客搭建
tags:
  - GitHub Actions
  - 友链
  - 自动化
  - Node.js
articleGPT: "友链互换后怎么知道对方有没有真的把我的链接加上？手动一个个去翻太累。这篇记录我用 GitHub Actions + Node.js 脚本实现友链自动检测的全过程：构建时抓取对方首页和友链页、只认原生 a 标签回链、过滤留言板和 rel=ugc 链接，输出状态 JSON，前端显示博主/好友/待回/未知角标，好友自动进推荐分组、待回置灰不可点击。"
---

# 友链互相添加自动检测：构建时抓回链，好友待回一目了然

博客开放友链申请后，加了十几个朋友。问题来了：**怎么知道对方到底有没有把我的链接加上？** 手动一个个去翻对方的友链页太累，而且有些人只在留言板里发了个链接，根本不算是正式友链。

于是做了个自动化方案：**每次构建部署时，用 GitHub Actions 自动抓取所有友链站点的首页和友链页，验证有没有指向我的真实回链**，把结果输出成 JSON，前端显示状态角标。

## 一、检测规则：什么样的回链才算数

关键是不能误判。定了几条硬规则：

1. **只认原生 `<a href>` 标签**指向我的域名，纯文本出现域名不算；
2. 过滤掉 **留言板/评论区** 容器内的链接（class 含 `comment`、`reply`、`guestbook`、`message`、`feedback` 的节点）；
3. 过滤 `rel="ugc"` 的链接（UGC 是用户生成内容，不是站长写的）；
4. `javascript:` 伪链接、iframe 中转、JS 动态跳转的**全部无效**；
5. 在留言区发现我的链接时，不算回链，但**记录备注**，方便人工确认。

## 二、实现：Node 脚本 + GitHub Actions

核心脚本在构建时运行，抓取逻辑：

```js
// 伪代码：抓页面 → 解析 DOM → 过滤 → 判定
for (const site of links) {
  for (const page of [site, site + '/friends', site + '/links', site + '/link']) {
    const html = await fetchHtml(page);
    const $ = loadHtml(html);
    // 过滤留言/评论容器
    $('[class*="comment"], [class*="reply"], [class*="guestbook"], [class*="message"], [class*="feedback"]').remove();
    // 只找原生 <a href="https://我的域名/">
    const hit = $('a[href]').filter((_, el) =>
      $(el).attr('href')?.includes('https://xkbk.cn')
    ).length > 0;
    if (hit) { status = 'friend'; break; }
  }
}
```

输出 `links-status.json`：

```json
{
  "map": {
    "https://blog.example.com": "friend",
    "https://other.example.net": "pending"
  }
}
```

状态含义：
- `friend`：对方已添加我的链接（真好友）
- `pending`：对方还没回加（待回）
- `unknown`：抓取失败/无法判定

手动覆盖：个别站点检测不稳定（比如对方站挂了 CDN 或反爬），加一个 `links-override.json` 手动指定状态，脚本合并时以手动为准。

## 三、前端展示：角标 + 分组

友链页前端读取状态 JSON，每张卡片右上角显示角标：

- **博主（本站）**：紫色角标，始终可点
- **好友**：绿色角标，可点击跳转
- **待回/未知**：橙色/灰色角标，**置灰不可点击**（`pointer-events: none`）

分组逻辑也自动了：

- 「推荐」分组 = 本站 + 所有检测为好友的站点（好友自动归入推荐，和本站并列展示）
- 「小伙伴们」分组 = 剩下的待回/未知站点
- 状态图例只显示在推荐分组下方，手机端自动换行

```js
// 分组整理：好友归入推荐
const grouped = listData.map((type) => {
  if (type.type === "rec") {
    return { ...type, typeList: [...type.typeList, ...friends] };
  }
  return { ...type, typeList: type.typeList.filter((l) => statusMap[l.url] !== "friend") };
});
```

## 四、遇到的坑

1. **留言板误判**：早期版本把留言板里的链接也算回链，把根本没加友链的站点标成了好友。加容器过滤后解决；
2. **构建时网络不稳**：GitHub Actions 访问国内站点偶尔超时，超时的站点标 `unknown` 而不是 `pending`，避免误导；
3. **构建时间变长**：抓取 20+ 个站点要 1-2 分钟，只对友链数据变化时触发（或直接在部署 job 里跑，可接受）。

## 小结

这套方案的核心价值：**友链状态自动更新，不用手动维护**。加新友链 → push 代码 → Actions 自动检测 → 前端自动归类展示。配合手动覆盖兜底，准确率和体验都不错。代码量不大（一个 Node 脚本 + 一个组件），强烈推荐有友链页的博主搞一套。
