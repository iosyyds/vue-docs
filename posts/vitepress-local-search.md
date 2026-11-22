---
title: VitePress 本地搜索：不花钱也能秒搜全站
date: '2026-11-09'
categories:
  - 博客搭建
tags:
  - VitePress
  - 搜索
  - 前端
cover: /images/covers/cover_local-search.jpg
articleGPT: "Algolia 好用在免费额度内，但文章多了要花钱，还依赖第三方。VitePress 内置的本地搜索基于 MiniSearch，构建时生成索引，支持中文分词，完全离线。本文给出开启方法、中文优化和索引体积控制。"
---

# VitePress 本地搜索：不花钱也能秒搜全站

博客刚上线时用了 Algolia，前 30 篇文章体验很好：结果秒出、高亮准确、支持中文。但文章到 200 篇以后开始盯免费额度，而且每次发文都要额外跑一次索引推送，链路多一个环节就多一个故障点。

VitePress 自带本地搜索，构建时把全站内容打成一个索引文件，浏览器直接检索，零成本、零依赖。

![本地搜索与云端搜索的差异](/images/tutorial/local-search-1.svg)

## 一、开启本地搜索

在 `.vitepress/config.mjs` 里配置：

```js
export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
        translations: {
          buttonText: '搜索文章',
          buttonAriaLabel: '搜索文章',
          noResultsText: '没有找到相关内容',
          resetButtonTitle: '清除查询',
        },
      },
    },
  },
})
```

`fuzzy: 0.2` 允许轻微拼写误差，`prefix: true` 支持前缀匹配（输入「Ngin」也能命中「Nginx」）。

## 二、中文搜索的关键：分词

MiniSearch 默认按空格分词，中文会被当成一整串，导致「反向代理」搜不出来。有两种解法：

**方法一：开启 VitePress 内置的中文优化**

VitePress 的本地搜索默认已经处理了 CJK 字符，会做二元切分。确认版本在 1.0 以上即可，通常不用额外配置。

**方法二：自定义分词函数**

如果效果不理想，可以在配置里传入自定义 `tokenize`：

```js
search: {
  provider: 'local',
  options: {
    miniSearch: {
      options: {
        tokenize: (text) => {
          const tokens = []
          // 英文按空格
          text.split(/\s+/).forEach((word) => {
            if (!word) return
            // 中文按二元组切分
            if (/[\u4e00-\u9fa5]/.test(word)) {
              for (let i = 0; i < word.length - 1; i++) {
                tokens.push(word.slice(i, i + 2))
              }
            } else {
              tokens.push(word.toLowerCase())
            }
          })
          return tokens
        },
      },
    },
  },
}
```

二元切分的好处是「反向代理」会变成「反向」「向代」「代理」，搜「代理」也能命中。

## 三、控制索引体积

本地搜索的索引会随文章量线性增长。200 篇长文可能生成 1~2 MB 的 JSON，首次加载会拖慢搜索框。

三个控制手段：

- **只索引正文和标题**：默认就会索引标题和各级标题，正文抽取前 N 字
- **排除草稿**：`posts/` 里不要放 `draft` 文件
- **拆分成按需加载**：文章超过 300 篇时，考虑改回 Algolia 或自建搜索服务

检查索引大小：

```bash
ls -lh .vitepress/dist/assets/chunks/@localSearchIndex*.js
```

超过 2 MB 就该考虑方案调整了。

## 四、和 Algolia 怎么选

| 维度 | 本地搜索 | Algolia |
|---|---|---|
| 成本 | 免费 | 免费额度有限，超出收费 |
| 部署依赖 | 无，随构建生成 | 需推送索引 |
| 首次搜索速度 | 需下载索引，稍慢 | 极快 |
| 结果质量 | 够用 | 更好（拼写纠错、同义词） |
| 中文支持 | 二元切分，可用 | 需配置中文分词 |
| 离线可用 | 是 | 否 |

判断标准很简单：**文章少于 150 篇、更新频率不高 → 本地搜索；追求搜索质量和规模 → Algolia**。

![两种搜索方案的选型决策](/images/tutorial/local-search-2.svg)

## 五、常见问题

**搜索框点不开**。检查 `theme/index.mjs` 里有没有注册搜索相关插件。本地搜索不需要额外插件，但如果你之前装过 `vue-instantsearch`，要确认没有冲突。

**搜不到新文章**。本地索引是构建时生成的，开发模式（`npm run dev`）下索引可能滞后，重启 dev server 或直接看构建产物。

**结果里出现整段正文**。在 `search.options` 里调整 `detailedView: false`，只显示标题和摘要。

**多语言站点**。VitePress 本地搜索按 locale 分别生成索引，配置 `locales` 后会自动处理。

## 小结

本地搜索不是「低配版 Algolia」，而是一个更符合个人博客的默认选项：没有账号、没有密钥、没有额度，构建完就能用。等到内容规模真的顶到上限，再换方案也不迟。
