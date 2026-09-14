---
title: CSS 布局完全指南：Flexbox 与 Grid 一次讲透
date: '2026-09-15'
categories:
  - 前端开发
tags:
  - CSS
  - 布局
  - 前端
cover: /images/covers/cover_css-layout.jpg
articleGPT: "这篇文章系统对比 CSS 两大布局方案 Flexbox 与 Grid：什么时候用 flex 什么时候用 grid，主轴交叉轴怎么记，常用属性速查，以及圣杯布局、九宫格等实战案例，看完可以直接照着写。"
---

# CSS 布局完全指南：Flexbox 与 Grid 一次讲透

![封面](/images/covers/cover_css-layout.jpg)

做前端绕不开布局。Flexbox 管"一维排列"，Grid 管"二维网格"，两者配合基本能覆盖所有常见布局需求。这篇文章把常用知识点一次讲清楚。

## 先记住结论

- **一维布局**（一行或一列，如导航栏、按钮组）→ Flexbox
- **二维布局**（行列都有，如卡片墙、仪表盘）→ Grid
- 两者可以嵌套：外层 Grid 切分区域，区域内 Flex 排内容

![Flexbox 与 Grid 选择](/images/tutorial/css.svg)

## Flexbox 核心

父容器设置 `display: flex` 后，主轴默认水平（`flex-direction: row`）。

```css
.container {
  display: flex;
  justify-content: center; /* 主轴对齐：flex-start / center / space-between / space-around */
  align-items: center;     /* 交叉轴对齐：flex-start / center / stretch */
  flex-wrap: wrap;         /* 允许换行 */
  gap: 16px;               /* 子元素间距，比 margin 好用 */
}

.item {
  flex: 1;                 /* 等分剩余空间 */
  min-width: 0;            /* 防止内容撑爆 */
}
```

`flex` 是三个属性的简写：`flex-grow flex-shrink flex-basis`。`flex: 1` = `flex: 1 1 0%`，最常用。

**垂直居中**（老问题一句话解决）：

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Grid 核心

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 三列等宽 */
  grid-template-rows: auto 1fr auto;      /* 头 / 内容 / 尾 */
  gap: 16px;
}
```

常用单位：
- `1fr`：剩余空间的一份
- `repeat(auto-fill, minmax(220px, 1fr))`：自适应列数（卡片墙神器）
- `auto`：按内容大小

**区域命名**（做整体页面骨架）：

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
```

## 实战：圣杯布局

```css
.layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 60px 1fr 60px;
  grid-template-areas:
    "header header header"
    "left main right"
    "footer footer footer";
}
```

两行代码就搞定了以前用 float + margin 负值折腾半天的布局。

## 实战：自适应卡片墙

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
```

容器够宽就多放几列，不够就自动换行，不需要任何媒体查询。

## 常见坑

1. **Grid 子项默认 stretch**：想按内容高度排，加 `align-items: start`
2. **flex 子项被压缩**：加 `flex-shrink: 0` 或 `min-width: 0`
3. **gap 浏览器兼容**：现代浏览器都支持，放心用
4. **子项超出溢出**：`min-width: 0` / `overflow: hidden` 配合

## 小结

- Flex 管一维、Grid 管二维，先想清楚再选
- `gap` 统一间距，少用 margin
- 卡片墙用 `repeat(auto-fill, minmax())` 最省事
- 页面骨架优先 Grid + `grid-template-areas`，可读性极佳

布局没有银弹，但掌握这两个工具后，90% 的页面都不需要再翻文档了。
