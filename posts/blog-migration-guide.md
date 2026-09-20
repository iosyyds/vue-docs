---
title: 我的博客迁移实录：从 Hugo 到 VitePress + Curve 主题
date: '2026-09-15'
categories:
  - 博客搭建
tags:
  - VitePress
  - Hugo
  - 博客
  - GitHub Pages
articleGPT: "这篇文章记录博主把个人博客从 Hugo + Solitude 主题迁移到 VitePress + vitepress-theme-curve 主题的全过程：为什么换、主题怎么选、目录结构怎么搭、文章 frontmatter 怎么写，以及如何用 GitHub Actions 自动部署到 GitHub Pages 并绑定自定义域名。"
---

# 我的博客迁移实录：从 Hugo 到 VitePress + Curve 主题

折腾了半个月，终于把博客从 Hugo 整个搬到了 VitePress。这篇记录迁移过程和踩过的坑，给想换博客框架的朋友一个参考。

## 为什么换

原来的博客是 **Hugo + Solitude 主题**，本身没问题，但我想要的是：

- 更接近现代前端生态（Vue 组件化、主题可深度定制）
- 更漂亮的默认主题，不用自己改一堆样式
- 文章用 Markdown 写作、版本管理（放 GitHub 仓库，永不失联）

**VitePress** 正好满足：官方维护、Vue 3 驱动、构建快、默认就是一套完整文档站。再配上一个好看的博客主题，体验直接拉满。

## 主题选择：vitepress-theme-curve

选主题时对比了几个：

| 主题 | 特点 | 结论 |
| --- | --- | --- |
| VitePress 默认 | 文档站风格，没博客味 | 放弃 |
| vitepress-blog 等 | 功能少，更新慢 | 放弃 |
| **vitepress-theme-curve** | 界面精美、自带评论/搜索/友链/导航/音乐，功能全 | **选用** |

Curve 主题开箱即用：首页文章流、分类标签、归档、关于页、友链页、全局搜索（Algolia）、评论系统（Twikoo/giscus/artalk/valine 都支持）、音乐播放器，基本不用自己造轮子。

## 迁移步骤

### 1. 拿到主题代码

Curve 主题仓库本身就是完整的博客站点，直接 clone 下来改：

```bash
git clone https://github.com/imsyy/vitepress-theme-curve.git
cd vitepress-theme-curve
npm install
```

### 2. 改站点配置

核心配置文件在 `.vitepress/theme/assets/themeConfig.mjs`：

```js
// 站点信息
siteMeta: {
  title: "我的博客",
  description: "分享技术与折腾记录",
  logo: "/logo.svg",
  site: "https://xkbk.cn",
  author: {
    name: "小坤哥哥",
    email: "admin@xkbk.cn",
  },
},
// 导航菜单
nav: [
  { text: "文库", items: [...] },
  { text: "我的", items: [...] },
],
```

所有站点标题、导航、页脚、评论区配置都在这一个文件里，改完即可。

### 3. 写文章

文章放在根目录 `posts/` 下，每个 `.md` 文件一篇，frontmatter 控制分类和标签：

```md
---
title: 文章标题
date: '2026-09-15'
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
---

# 文章标题

正文内容……
```

### 4. 本地预览与构建

```bash
npm run dev    # 本地实时预览，http://localhost:5173
npm run build  # 构建出静态文件到 .vitepress/dist
```

### 5. 自动部署到 GitHub Pages

仓库里配好 `.github/workflows/deploy.yml`，每次 `git push` 自动构建部署：

```yaml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .vitepress/dist
```

### 6. 绑定自定义域名

GitHub Pages 设置里填自定义域名（如 `xkbk.cn`），再到域名商加一条 CNAME 解析指向 `你的用户名.github.io`，等生效即可。

## 踩坑记录

- **旧主题文件要删干净**：换主题时把旧 Hugo 的主题目录、配置文件全部清掉，避免新旧混在一起出奇怪问题
- **封面图路径**：文章里引用 `/images/covers/xxx.jpg`，图片放在 `public/images/covers/` 下
- **RSS 生成**：Curve 主题自带 RSS 生成脚本（`.vitepress/theme/utils/generateRSS.mjs`），自动把最近 10 篇文章输出成 `rss.xml`

## 迁移后的效果

- 访问速度：纯静态 + CDN，比原来快
- 写作体验：本地 `npm run dev` 边写边看，push 即上线
- 功能齐全：搜索、评论、分类、归档、RSS 全都有

迁移完成的那一刻，感觉折腾得值。接下来还会继续折腾评论系统、搜索优化，后面文章慢慢写。
