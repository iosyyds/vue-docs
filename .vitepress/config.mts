import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue Docs',
  description: '基于 VitePress 搭建的 Vue 技术文档',
  lang: 'zh-CN',
  base: '/vue-docs/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/what-is-vue' }
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
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 iosyyds'
    },
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/iosyyds/vue-docs/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },
    lastUpdated: {
      text: '最后更新'
    }
  }
})
