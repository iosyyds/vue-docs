<template>
  <div id="waline-container" class="waline-wrapper"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();

const WALINE_SERVER = 'https://waline.liua.eu.org';

const initWaline = () => {
  const container = document.getElementById('waline-container');
  if (!container || typeof (window as any).Waline === 'undefined') return;
  container.innerHTML = '';
  (window as any).Waline.init({
    el: '#waline-container',
    serverURL: WALINE_SERVER,
    dark: 'html.dark',
    pageSize: 10,
    emoji: [
      'https://unpkg.com/@waline/emojis@1.2.0/qq',
      'https://unpkg.com/@waline/emojis@1.2.0/tieba'
    ],
    requiredMeta: ['nick'],
    login: 'enable',
    locale: {
      nick: '昵称',
      mail: '邮箱',
      link: '网址',
      admin: '博主',
      placeholder: '欢迎评论~ 填写邮箱可收到回复通知',
      sofa: '快来发表第一条评论吧！'
    }
  });
};

onMounted(() => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/@waline/client@v2/dist/waline.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@waline/client@v2/dist/waline.js';
  script.defer = true;
  script.onload = initWaline;
  document.head.appendChild(script);
});

watch(() => route.path, () => setTimeout(initWaline, 300));
</script>

<style scoped>
.waline-wrapper {
  margin-top: 2rem;
}
</style>
