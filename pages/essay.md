---
title: 即刻短文
aside: false
card: false
comment: false
---

<EssayList />

<!-- 隐藏的 Twikoo 评论区：仅用于存储"短文"（短文即评论）。渲染到屏幕外（而非 display:none），保证 Twikoo 正常初始化且用户不可见 -->
<div style="position: fixed; left: -9999px; top: 0; width: 760px; height: 600px; overflow: auto; z-index: -1" aria-hidden="true">
  <Comments />
</div>
