import { defineConfig } from 'vitepress';
import { usePosts } from '../src/composables/usePosts.ts';
import { hashPassword } from '../src/utils/hashPassword.ts';
import type { ThemeConfig } from '../src/types.ts';

const { posts, hiddenPosts, excludePosts, descriptionMap, rewrites } = await usePosts({
  pageSize: 6,
  homepage: true,
  srcDir: 'posts',
  excerpt: 150
});

export default defineConfig<ThemeConfig>({
  lang: 'zh-CN',
  title: '小坤哥哥博客',
  titleTemplate: '小坤哥哥博客',
  description: '小坤哥哥的个人博客，记录技术分享、生活点滴和日常折腾。',
  rewrites,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  base: '/',
  head: [
    ['script', { async: true, src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7156604582462189', crossorigin: 'anonymous' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  sitemap: {
    hostname: 'https://xkbk.cn',
    transformItems: (items) => {
      return items.filter((item) => !hiddenPosts.has(item.url.replace(/\.html$/, '')));
    }
  },
  transformPageData(pageData) {
    const { frontmatter, description } = pageData;
    const { id, password } = frontmatter;

    if (password) {
      frontmatter.password = hashPassword(String(password));
    }
    if (!description) {
      pageData.description = descriptionMap.get(id) as string;
    }
  },
  themeConfig: {
    posts,
    page: {
      max: 5
    },
    classicCategory: false,
    transition: true,
    logo: '/logo.svg',
    outline: { level: 2, label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    outlineTitle: '本页目录',
    editLink: {
      pattern: 'https://github.com/iosyyds/vue-docs/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/category/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives' },
      { text: '网址导航', link: '/nav' },
      { text: '甜甜发卡', link: 'https://qqqi.top/', target: '_blank', rel: 'noopener' }
    ],
    sidebar: {},
    socialLinks: [{ icon: 'github', link: 'https://github.com/iosyyds/vue-docs' }],
    footer: {
      copyright: 'Copyright © 2026 小坤哥哥'
    },
    search: { provider: 'local' }
  },
  markdown: {
    lineNumbers: true,
    config: (md) => {
      md.use((md) => {
        md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
          let htmlResult = slf.renderToken(tokens, idx, options);
          if (tokens[idx].tag === 'h1') htmlResult += `<PostMeta />`;
          return htmlResult;
        };
      });
    }
  },
  srcExclude: [...excludePosts, 'README.md']
});
