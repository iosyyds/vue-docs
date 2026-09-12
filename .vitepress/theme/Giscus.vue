<template>
  <div class="giscus-container" ref="container"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const container = ref(null)

function loadGiscus() {
  if (typeof window === 'undefined' || !container.value) return

  container.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-repo', 'iosyyds/vue-docs')
  script.setAttribute('data-repo-id', 'R_kgDOUYGXcA')
  script.setAttribute('data-category', 'Announcements')
  script.setAttribute('data-category-id', 'DIC_kwDOUYGXcM4DFdMd')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'bottom')
  script.setAttribute('data-theme', 'preferred_color_scheme')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('loading', 'lazy')
  container.value.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

watch(
  () => route.path,
  () => {
    setTimeout(loadGiscus, 300)
  }
)
</script>

<style scoped>
.giscus-container {
  max-width: 720px;
  margin: 40px auto 0;
  padding: 0 24px;
}
</style>
