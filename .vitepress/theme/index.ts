import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogHome from './components/BlogHome.vue'
import Archives from './components/Archives.vue'
import Categories from './components/Categories.vue'
import Tags from './components/Tags.vue'
import Friends from './components/Friends.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
    app.component('Archives', Archives)
    app.component('Categories', Categories)
    app.component('Tags', Tags)
    app.component('Friends', Friends)
  },
  setup() {
    if (typeof window !== 'undefined') {
      // 阅读进度条
      const bar = document.createElement('div')
      bar.className = 'vp-progress'
      document.body.appendChild(bar)
      // 回到顶部
      const btn = document.createElement('button')
      btn.className = 'vp-totop'
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
      btn.title = '回到顶部'
      btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
      document.body.appendChild(btn)
      const onScroll = () => {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0
        bar.style.width = pct + '%'
        btn.classList.toggle('show', h.scrollTop > 400)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      // 动画开关
      const toggle = document.createElement('button')
      toggle.className = 'vp-anim-toggle'
      toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
      toggle.title = '动画开关'
      toggle.onclick = () => {
        document.body.classList.toggle('anim-off')
        try { localStorage.setItem('animOff', document.body.classList.contains('anim-off')) } catch(e) {}
      }
      try { if (localStorage.getItem('animOff') === 'true') document.body.classList.add('anim-off') } catch(e) {}
      document.body.appendChild(toggle)
    }
  }
} satisfies Theme
