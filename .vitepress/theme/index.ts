import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Home from './views/Home.vue'
import Archives from './views/Archives.vue'
import Categories from './views/Categories.vue'
import Tags from './views/Tags.vue'
import Friends from './views/Friends.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('MyHome', Home)
    app.component('MyArchives', Archives)
    app.component('MyCategories', Categories)
    app.component('MyTags', Tags)
    app.component('MyFriends', Friends)
  },
  setup() {
    if (typeof window !== 'undefined') {
      const bar = document.createElement('div')
      bar.className = 'pk-progress'
      document.body.appendChild(bar)
      const top = document.createElement('button')
      top.className = 'pk-totop'
      top.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
      top.title = '回到顶部'
      top.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
      document.body.appendChild(top)
      const onScroll = () => {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%'
        top.classList.toggle('show', h.scrollTop > 400)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      const at = document.createElement('button')
      at.className = 'pk-anim'
      at.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
      at.title = '动画开关'
      at.onclick = () => {
        document.body.classList.toggle('anim-off')
        try { localStorage.setItem('animOff', document.body.classList.contains('anim-off')) } catch(e) {}
      }
      try { if (localStorage.getItem('animOff') === 'true') document.body.classList.add('anim-off') } catch(e) {}
      document.body.appendChild(at)
    }
  }
} satisfies Theme
