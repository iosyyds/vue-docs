import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BlogHome from './BlogHome.vue'
import Archives from './Archives.vue'
import Categories from './Categories.vue'
import Tags from './Tags.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
    app.component('Archives', Archives)
    app.component('Categories', Categories)
    app.component('Tags', Tags)
  },
  setup() {
    if (typeof window !== 'undefined') {
      const bar = document.createElement('div')
      bar.className = 'reading-progress'
      document.body.appendChild(bar)
      const btn = document.createElement('button')
      btn.className = 'back-top'
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
      btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
      document.body.appendChild(btn)
      const onScroll = () => {
        const h = document.documentElement
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
        bar.style.width = pct + '%'
        btn.classList.toggle('show', h.scrollTop > 400)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
    }
  }
} satisfies Theme
