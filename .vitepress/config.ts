import { defineConfig } from 'vitepress'
export default defineConfig({
  lang: 'zh-CN',
  title: '小坤哥哥博客',
  description: '小坤哥哥的个人博客',
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,
  head: [
    ['script', { async: true, src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7156604582462189', crossorigin: 'anonymous' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/archives' },
      { text: '分类', link: '/category' },
      { text: '标签', link: '/tags' },
      { text: '友链', link: '/friends' },
      { text: '甜甜发卡', link: 'https://qqqi.top/', target: '_blank' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/iosyyds/vue-docs' }],
    footer: { copyright: 'Copyright © 2026 小坤哥哥' },
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '切换深浅模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            resetButtonTitle: '清除',
            backButtonTitle: '关闭',
            noResultsText: '未找到结果',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    }
  },
  markdown: { lineNumbers: true }
})
