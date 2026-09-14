import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogHome from './BlogHome.vue'
import './blog.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
  },
  setup() {
    if (typeof window !== 'undefined') {
      // 阅读进度条
      const bar = document.createElement('div')
      bar.className = 'reading-bar'
      document.body.appendChild(bar)
      // 回到顶部
      const btn = document.createElement('button')
      btn.className = 'back-top'
      btn.textContent = '↑'
      btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
      document.body.appendChild(btn)
      window.addEventListener('scroll', () => {
        const h = document.documentElement
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
        bar.style.width = pct + '%'
        btn.classList.toggle('show', h.scrollTop > 300)
      })
    }
  }
} satisfies Theme
