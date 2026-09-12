import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Giscus from './Giscus.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Giscus)
    })
  },
  enhanceApp() {}
}
