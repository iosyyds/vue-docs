---
title: 博客配图工作流：截图到上线 30 秒搞定
date: '2026-11-19'
categories:
  - 博客搭建
tags:
  - 图片
  - 工作流
  - Markdown
cover: /images/covers/cover_image-workflow.jpg
articleGPT: "写教程最费时间的不是文字，是配图：截图、裁剪、压缩、上传、复制链接。本文用统一命名规范、自动压缩脚本和固定目录结构，把配图流程压缩到截图后 30 秒完成。"
---

# 博客配图工作流：截图到上线 30 秒搞定

写一篇教程，正文一小时，配图两小时。流程通常是：截图 → 打开修图软件裁剪 → 另存为 → 打开压缩工具 → 上传图床 → 复制链接 → 粘到 Markdown。每张图七八个步骤，十张图就是一小时。

真正拖慢写作的是切换成本。这篇给一套从截图到引用的最短路径，目标是把每张图的处理时间压到 30 秒内。

![配图从截图到上线的完整链路](/images/tutorial/image-workflow-1.svg)

## 一、目录规范：按文章归档

```
public/images/
├── covers/          # 首页封面
├── inline/          # 正文配图（按文章 slug 分目录）
│   ├── nginx-reverse-proxy/
│   │   ├── step-1.webp
│   │   └── step-2.webp
│   └── vitepress-local-search/
└── tutorial/        # 流程图与 SVG
```

规则：

- 每篇文章一个子目录，名字就是 slug
- 文件名用 `step-1`、`step-2` 或语义化英文，不要用 `截图2026-11-19下午3.42.18.png`
- 统一小写，避免服务器大小写敏感导致 404

## 二、截图工具：别用系统截图

推荐 **Snipaste**（Windows/macOS）或 **Flameshot**（Linux）：

- 框选后按 `F3` 直接贴到桌面，方便对照
- 支持标注箭头、马赛克、文字
- 保存路径可预设成 `public/images/inline/<slug>/`
- 保存后自动复制文件路径

配合命名规则：截图时把文件名直接改成 `step-1.png`，省掉后续重命名。

## 三、自动压缩：保存即优化

用文件监听工具（如 `chokidar-cli`）监听目录，新图保存后自动转 WebP：

```bash
npm i -D chokidar-cli
```

`package.json` 加脚本：

```json
{
  "scripts": {
    "watch:img": "chokidar 'public/images/inline/**/*.{png,jpg,jpeg}' -c 'cwebp -q 82 -resize 1200 0 {path} -o {path}.webp && rm {path}'"
  }
}
```

之后开一个终端跑 `npm run watch:img`，截图保存后自动变成 webp，原图删除，目录里只剩最终文件。

## 四、Markdown 引用模板

在编辑器里设置一个代码片段，输入 `img` 自动补全：

```markdown
![步骤说明](/images/inline/{{slug}}/step-N.webp)
```

要点：

- **alt 文字必须写**：SEO 和图片加载失败时都有用
- 路径用绝对路径 `/images/...`，不要用 `../` 相对路径
- 图片后空一行，避免和正文粘连

## 五、封面单独处理

首页卡片封面和正文配图要求不同：

- 尺寸统一 **1200 × 600**（2:1）
- 有明确主题色，避免纯截图
- 文件放 `public/images/covers/cover_<slug>.jpg`
- 压缩质量 85 足够，封面不参与正文阅读

生成封面可以用 Canva、Figma 模板，或者直接用文章配图裁剪后加标题。批量场景用脚本：

```bash
# 把任意图裁成 1200x600 并压缩
convert input.jpg -resize 1200x600^ -gravity center -extent 1200x600 \
  -quality 85 "public/images/covers/cover_${slug}.jpg"
```

## 六、检查清单

发布前过一遍：

- [ ] 所有图片路径存在（构建时 404 会直接暴露）
- [ ] 单图体积小于 150 KB
- [ ] 封面尺寸 1200×600
- [ ] alt 文字不为空
- [ ] 图片没有包含隐私信息（聊天记录、邮箱、内网 IP）
- [ ] 截图里的密钥已打码

最后一条特别重要：教程截图里经常带 Token、密码、服务器 IP，发布前一定要检查。

![配图发布前的六项检查](/images/tutorial/image-workflow-2.svg)

## 七、更进一步：一键发布

把截图保存目录直接指向 `public/images/inline/<slug>/`，写完文章执行：

```bash
./scripts/publish.sh <slug>
```

脚本自动压缩、构建、提交、推送。整个流程里你只需要做两件事：截图、写文字。其余交给脚本。

配图不该是写作的负担，它应该是写作的延伸。工具链顺了之后，你会更愿意在文章里多放几张步骤图——而步骤图恰恰是教程类内容最值钱的部分。
