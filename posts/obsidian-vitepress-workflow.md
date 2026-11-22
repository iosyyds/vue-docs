---
title: Obsidian 写作流：笔记一键变成博客文章
date: '2026-11-02'
categories:
  - 效率工具
tags:
  - Obsidian
  - 写作
  - VitePress
cover: /images/covers/cover_obsidian-workflow.jpg
articleGPT: "用 Obsidian 作为统一写作入口，配合模板、双链和自动脚本，把博客发布流程压缩成三步：写完、导出、推送。文章给出完整的目录结构、frontmatter 模板和同步脚本。"
---

# Obsidian 写作流：笔记一键变成博客文章

以前的写作流程是割裂的：灵感记在手机备忘录，草稿写在 Obsidian，发布还要打开编辑器手动复制到 `posts/` 目录，改 frontmatter、压缩图片、跑构建。一篇两千字的文章，真正写作可能一小时，收尾要折腾二十分钟。

这篇讲怎么把 Obsidian 变成博客的写作前端，让「写完」和「发布」只隔一条命令。

![Obsidian 到博客的发布流程](/images/tutorial/obsidian-workflow-1.svg)

## 一、为什么用 Obsidian 而不是直接写 Markdown

直接用 VS Code 写 `posts/xxx.md` 也能发布，但 Obsidian 有几个明显的优势：

- **双链和标签**：写草稿时能引用旧笔记，素材之间有关联
- **移动端同步**：手机上的灵感可以直接续写
- **插件生态**：模板、日历、看板、图表都能装
- **本地纯文本**：所有笔记都是 Markdown，永远不被平台锁定

关键是 Obsidian 的 vault 就是一个普通文件夹，和 Git 仓库天然兼容。

## 二、目录结构：写作区与发布区分离

推荐两个目录：

```
~/notes/                    # Obsidian vault（写作区）
├── 00-inbox/               # 灵感、碎片
├── 10-drafts/              # 正在写的长文
├── 20-published/           # 已发布归档
└── templates/
    └── blog-post.md        # 发布模板

~/blog/vue-docs/posts/      # 发布区（Git 仓库）
```

写作区和发布区分离的好处：草稿可以随便改，不会出现半成品被构建上线；发布时只挑 `10-drafts` 里定稿的文件。

## 三、在 Obsidian 里配置文章模板

在 Obsidian 设置里开启「模板」核心插件，把模板目录指向 `templates`，新建文章时插入：

```yaml
---
title: {{title}}
date: '{{date:YYYY-MM-DD}}'
categories:
  - 技术教程
tags:
  - 
cover: /images/covers/cover_{{title}}.jpg
articleGPT: ""
---
```

然后用「模板」或 Templater 插件一键套用。文件名就是文章的 slug，建议统一用英文小写 + 连字符，比如 `obsidian-vitepress-workflow`，避免中文路径在 URL 里转义。

## 四、三条命令完成发布

在博客仓库里放一个发布脚本 `scripts/publish.sh`：

```bash
#!/bin/bash
# 用法: ./scripts/publish.sh obsidian-vitepress-workflow
set -e
SLUG=$1
VAULT=~/notes

# 1. 从 vault 复制定稿文章
cp "$VAULT/10-drafts/$SLUG.md" "posts/$SLUG.md"

# 2. 检查 frontmatter 必填项
grep -q "^title:" "posts/$SLUG.md" || (echo "缺少 title" && exit 1)
grep -q "^date:" "posts/$SLUG.md" || (echo "缺少 date" && exit 1)

# 3. 构建、提交、推送
npm run build
git add "posts/$SLUG.md"
git commit -m "post: $SLUG"
git push origin main

# 4. 归档
mv "$VAULT/10-drafts/$SLUG.md" "$VAULT/20-published/$SLUG.md"
```

之后发布就是：

```bash
./scripts/publish.sh obsidian-vitepress-workflow
```

推送后 GitHub Actions 自动构建上线，两分钟左右前台就能看到。

![发布脚本的四步执行顺序](/images/tutorial/obsidian-workflow-2.svg)

## 五、几个容易踩的坑

**图片路径**。Obsidian 默认把图片存到 vault 内部，直接用 `![[图片.png]]` 语法博客不认。要么在 Obsidian 设置里把附件目录改成相对路径，要么发布脚本里做一次替换：

```bash
sed -i 's|!\[\[(.*)\]\]|![图](/images/inline/\1)|g' "posts/$SLUG.md"
```

**frontmatter 顺序**。VitePress 对 frontmatter 的 YAML 语法比较严格，日期必须加引号，否则 `2026-11-02` 会被当成字符串解析出错。

**别在发布目录里直接写**。`posts/` 里的文件会被构建，写到一半触发自动部署，前台就会出现半篇文章。写作永远在 vault 里完成。

## 小结

Obsidian 负责「写」，Git 负责「存」，Actions 负责「发」，三者各司其职。把发布收尾压成一条命令之后，写作这件事才真正只剩下写作本身。
