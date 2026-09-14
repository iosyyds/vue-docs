---
title: 网站性能优化实战：从图片到代码的全面提速
date: '2026-09-15'
categories:
  - 性能优化
tags:
  - 性能
  - 优化
  - 前端
cover: /images/covers/cover_performance.jpg
articleGPT: "这篇文章整理网站性能优化的完整清单：图片压缩与格式选择、静态资源缓存、代码体积控制、首屏优化手段，以及用 Lighthouse 定位瓶颈的方法，按优先级从易到难排列，照着做就能见效。"
---

# 网站性能优化实战

![封面](/images/covers/cover_performance.jpg)

用户等 3 秒没打开就走了。性能优化不是炫技，是实打实影响留存的事。这篇文章按"投入产出比"从高到低，给你一份能直接执行的优化清单。

## 先定位瓶颈：Lighthouse

```bash
# Chrome 开发者工具 → Lighthouse → 生成报告
# 或命令行：
npx lighthouse https://xkbk.cn --only-categories=performance --view
```

报告会给出分数和具体建议（FCP、LCP、CLS 等核心指标）。**先测再改**，别凭感觉优化。

## 第一优先级：图片（最常见瓶颈）

页面 60% 以上的体积常常来自图片：

1. **格式选对**：照片用 WebP/AVIF，图标用 SVG，截图用 WebP
2. **压缩**：质量 75-82 肉眼几乎无差，体积能减 60-80%
3. **响应式**：`srcset` 按设备宽度给不同尺寸

```html
<img
  src="photo-800.webp"
  srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, 800px"
  width="800" height="450"
  loading="lazy"
  alt="文章封面"
/>
```

`width/height` 固定尺寸可以**避免布局抖动**（CLS），`loading="lazy"` 让首屏外的图片延迟加载。

## 第二优先级：缓存

静态资源加长缓存，访问过的用户秒开：

```nginx
# Nginx 配置
location ~* \.(js|css|png|jpg|svg|webp|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

配合文件名带 hash（`app.a1b2c3.js`），内容变了 hash 变、自动拉新，没变就永久缓存。

## 第三优先级：代码体积

```bash
# 查看打包体积
npm run build && npx vite-bundle-visualizer

# 按需加载：路由级懒加载
const Blog = () => import("./views/Blog.vue");
```

要点：
- 路由懒加载，首屏只加载需要的代码
- 大依赖（图表库、日期库）按需引入或用 CDN
- 删除无用代码：Tree-shaking 依赖正确的 ESM 写法
- 用 `webpack-bundle-analyzer` / `vite-bundle-visualizer` 找出"体积刺客"

## 第四优先级：首屏渲染

1. **关键 CSS 内联**：首屏样式直接写进 HTML，避免阻塞
2. **字体优化**：`font-display: swap` + 只加载用到的字形（子集化）

```css
@font-face {
  font-family: "Site Title";
  font-display: swap; /* 字体加载期间先用系统字体渲染 */
  src: url("/fonts/title.woff2") format("woff2");
}
```

3. **预连接第三方域**：

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## 第五优先级：运行时

- **减少重排重绘**：避免频繁读写 DOM 布局属性，用 `requestAnimationFrame` 合并动画
- **事件防抖**：搜索框、resize 加防抖/节流

```js
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

## 优化清单速查

| 项目 | 手法 | 收益 |
| --- | --- | --- |
| 图片 | WebP + 压缩 + srcset + lazy | 极大 |
| 缓存 | 长缓存 + hash 文件名 | 大 |
| 代码 | 路由懒加载 + 按需引入 | 大 |
| 字体 | swap + 子集化 | 中 |
| CDN | 静态资源走 CDN | 中 |
| 首屏 | 关键 CSS 内联 | 中 |

## 小结

优化的顺序很重要：**先图片、再缓存、后代码、最后微调**。每一步改动后都用 Lighthouse 重新测一遍，看数字说话。别一上来就搞 SSR、微前端那种大工程——大多数站点把前四步做完，性能分就能从 40 提到 90+。
