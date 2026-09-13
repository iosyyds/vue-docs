import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Giscus from './Giscus.vue'
import PostMeta from './PostMeta.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostMeta),
      'doc-after': () => h(Giscus)
    })
  },
  enhanceApp() {}
}
