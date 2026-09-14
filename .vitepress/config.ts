import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '小坤哥哥博客',
  description: '小坤哥哥的个人博客，记录技术分享、生活点滴和日常折腾。',
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  base: '/',
  head: [
    ['script', { async: true, src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7156604582462189', crossorigin: 'anonymous' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '分类', link: '/category/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives' },
      { text: '网址导航', link: '/nav' },
      { text: '甜甜发卡', link: 'https://qqqi.top/', target: '_blank' }
    ],
    sidebar: {},
    socialLinks: [{ icon: 'github', link: 'https://github.com/iosyyds/vue-docs' }],
    footer: {
      copyright: 'Copyright © 2026 小坤哥哥'
    },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '切换深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到结果',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    }
  },
  markdown: {
    lineNumbers: true
  }
})
