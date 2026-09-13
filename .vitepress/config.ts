import { defineConfig } from 'vitepress';
import { usePosts } from '../src/composables/usePosts.ts';
import { hashPassword } from '../src/utils/hashPassword.ts';
import type { ThemeConfig } from '../src/types.ts';

const { posts, hiddenPosts, excludePosts, descriptionMap, rewrites } = await usePosts({
  pageSize: 6,
  homepage: false,
  srcDir: 'posts',
  excerpt: 150
});

export default defineConfig<ThemeConfig>({
  title: 'XKgg Docs',
  titleTemplate: 'XKgg Docs',
  description: 'XKgg Docs',
  rewrites,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  base: '/',
  sitemap: {
    hostname: 'https://eqkk.top',
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
    outline: { level: 2 },
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/page-1' },
      { text: '分类', link: '/category/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives' },
      { text: '网址导航', link: '/nav' }
    ],
    sidebar: {},
    socialLinks: [{ icon: 'github', link: 'https://github.com/iosyyds/vue-docs' }],
    footer: {
      copyright: 'Copyright © 2026 XKGG'
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
