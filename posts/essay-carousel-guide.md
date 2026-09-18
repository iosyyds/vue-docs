---
title: 即刻短文功能实战：首页轮播 + 列表页单行展示 + 点击直达详情
date: '2026-09-18'
categories:
  - 前端
tags:
  - Vue
  - 轮播
  - 即刻短文
  - 组件开发
articleGPT: "像微博一样发短文、在首页顶部轮播展示，是很多博客想要的小功能。这篇记录即刻短文组件的完整实现：JSON 数据源怎么组织、首页轮播组件怎么写、列表页为什么不能换行、点击短文如何跳转到对应文章，以及移动端适配的细节。"
---

# 即刻短文功能实战：首页轮播 + 列表页单行展示 + 点击直达详情

逛博客时看到别人首页顶部有个「即刻短文」轮播：一条条短句循环滚动，点进去能看到全部短文，像迷你微博。给博客也搞了一个，这篇记录完整实现。

## 一、数据源：一个 JSON 搞定

短文不需要数据库，一个静态 JSON 就够了（文章都是 Markdown 静态生成的，短文同理）：

```json
[
  { "date": "2026-09-18", "content": "评论区对齐参考站完成，0/10000 字数统计上线！" },
  { "date": "2026-09-18", "content": "Bilibili 表情包本地化，不再依赖外部 CDN。" }
]
```

放在 `theme/data/essays.json`，页面组件直接 import。加短文 = 编辑 JSON + 推送部署，最简单直接。

## 二、首页轮播组件

顶部轮播的核心是一个自动播放 + 淡入淡出的容器：

```vue
<div class="essay-carousel">
  <Transition name="fade" mode="out-in">
    <div :key="current" class="essay-item" @click="goEssay">
      <span class="tip">即刻短文</span>
      <span class="text">{{ essays[current].content }}</span>
    </div>
  </Transition>
</div>
```

自动轮播用定时器：

```js
let timer = setInterval(() => {
  current.value = (current.value + 1) % essays.length;
}, 5000);
// 鼠标悬停暂停、离开恢复
```

三条细节：
1. **`Transition` 的 `mode="out-in"`**：先出后进，避免文字重叠跳动；
2. **`key` 绑当前索引**：Vue 才能正确触发过渡动画；
3. **悬停暂停**：用户想看某条时别被轮播切走。

## 三、列表页：单行展示，不换行

短文列表页有个坑：内容长了会自动换行，和参考站的单行滚动效果不一致。强制单行：

```scss
.essay-item {
  white-space: nowrap;      // 不换行
  overflow: hidden;
  text-overflow: ellipsis;  // 超出省略号
  display: block;
}
```

手机端同理，宽度自适应，多余文字省略号收尾。

## 四、点击直达详情

需求是「点击短文跳转到对应文章」。因为短文 JSON 里只有日期和内容，跳转逻辑用**全文检索**实现：点击后搜索站内所有文章，找到包含这段短文内容的文章跳过去；找不到就跳到短文列表页。

```js
const goEssay = async () => {
  const text = essays[current].content;
  // 站内搜索 API：用短文里的关键词找对应文章
  const hit = await searchByText(text);
  router.push(hit ? `/posts/${hit.path}` : "/pages/essay");
};
```

更稳的做法是给每条短文 JSON 加一个 `link` 字段（文章路径或外部链接），点击直接跳，不依赖搜索——数据上多一个字段，逻辑更可靠。我最后改成了**优先读 `link` 字段，没有才走搜索兜底**。

## 五、移动端适配

- 轮播文字 `text-overflow: ellipsis` 单行收尾，不撑破卡片；
- 点击区域整条可点（移动端不需要 hover 态，直接 tap）；
- 列表页卡片间距在窄屏自动收窄（`clamp()` 或媒体查询都行）。

## 小结

即刻短文本质是「轻量内容 + 轮播容器 + 跳转逻辑」，半小时就能跑通。数据用 JSON、组件用 Vue Transition，加短文就是改 JSON——零成本维护，适合喜欢随手记录的博主。
