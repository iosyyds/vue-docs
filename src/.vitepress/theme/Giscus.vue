<template>
  <div class="giscus-container"></div>
</template>

<script setup>
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let container = null

function loadGiscus() {
  if (typeof window === 'undefined') return
  container = document.querySelector('.giscus-container')
  if (!container) return
  container.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'iosyyds/vue-docs')
  script.setAttribute('data-repo-id', 'R_kgDOJ9jLrQ')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOL9jLrc4CcyBs')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  container.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

watch(() => route.path, () => {
  nextTick(() => loadGiscus())
})
</script>

<style scoped>
.giscus-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 24px 40px;
}
</style>
