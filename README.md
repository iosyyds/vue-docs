# 小坤哥哥博客

基于 [VitePress](https://vitepress.dev/) 与 [vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve) 主题搭建的个人博客，记录技术分享、生活点滴和日常折腾。

> 主题参考：https://github.com/lrsm21427/Personal-Blog

## 快速开始

环境要求：Node.js `>=20`、npm `>=10`。

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 本地预览构建产物
npm run preview
```

## 目录结构

```text
.
├── .vitepress/          # VitePress 配置与主题
│   ├── config.mjs       # 站点配置（构建、PWA、RSS、外链中转等）
│   ├── init.mjs         # 主题配置加载
│   └── theme/           # vitepress-theme-curve 主题源码
│       └── assets/
│           ├── themeConfig.mjs   # 站点信息、导航、评论、搜索等配置
│           └── linkData.mjs      # 友链数据
├── posts/               # 博客文章（Markdown + Frontmatter）
├── pages/               # 独立页面（关于、归档、分类、标签、友链等）
├── public/              # 静态资源（图片、字体、favicon 等）
└── scripts/
    └── push-algolia.mjs # Algolia 搜索索引推送脚本
```

## 常用配置

- 站点信息 / 导航 / 页脚 / 评论 / 搜索：编辑 `.vitepress/theme/assets/themeConfig.mjs`
- 友链：编辑 `.vitepress/theme/assets/linkData.mjs`
- 评论系统：giscus（基于 GitHub Discussions，仓库已开启 Discussions）
- 搜索：Algolia（索引 `xkbk`）。新增文章后如需更新搜索索引，在本机执行：

```bash
ALGOLIA_APP_ID=0NOSBY3UK7 ALGOLIA_ADMIN_KEY=你的AdminKey ALGOLIA_INDEX=xkbk node scripts/push-algolia.mjs
```

或在仓库 Settings → Secrets 中配置 `ALGOLIA_ADMIN_KEY`，部署时自动推送索引。

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages（https://xkbk.cn）。
