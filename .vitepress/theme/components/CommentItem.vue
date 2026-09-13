<template>
  <div id="giscus-container" class="giscus"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

const getGiscusTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

const loadGiscus = () => {
  const container = document.getElementById('giscus-container');
  if (!container) return;
  container.innerHTML = '';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'iosyyds/vue-docs');
  script.setAttribute('data-repo-id', 'R_kgDOJ9jLrQ');
  script.setAttribute('data-category', 'Announcements');
  script.setAttribute('data-category-id', 'DIC_kwDOL9jLrc4CcyBs');
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'bottom');
  script.setAttribute('data-theme', getGiscusTheme());
  script.setAttribute('data-lang', 'zh-CN');
  script.crossOrigin = 'anonymous';
  script.async = true;
  container.appendChild(script);
};

const observer = new MutationObserver(() => {
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
  if (!iframe) return;
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: getGiscusTheme() } } },
    'https://giscus.app'
  );
});

onMounted(() => {
  loadGiscus();
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

watch(() => route.path, () => setTimeout(loadGiscus, 300));
</script>

<style scoped>
.giscus {
  margin-top: 2rem;
}
</style>
