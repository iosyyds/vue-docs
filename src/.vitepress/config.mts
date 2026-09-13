import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'XKgg Docs',
  description: '基于 VitePress 搭建的技术文档',
  lang: 'zh-CN',
  base: '/vue-docs/',
  themeConfig: {
    author: 'XKGG',
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/what-is-vue' },
      { text: '网址导航', link: '/nav' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          collapsed: false,
          items: [
            { text: '什么是 Vue', link: '/guide/what-is-vue' },
            { text: '快速上手', link: '/guide/getting-started' },
            { text: '模板语法', link: '/guide/template-syntax' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/iosyyds/vue-docs' }
    ],
    footer: {
      copyright: 'Copyright © 2026 XKGG'
    },
    search: {
      provider: 'local'
    },
    comment: {
      provider: 'Giscus',
      repo: 'iosyyds/vue-docs',
      repoId: 'R_kgDOJ9jLrQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOL9jLrc4CcyBs'
    }
  }
})
