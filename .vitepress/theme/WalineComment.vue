<template>
  <div class="waline-container">
    <p class="waline-loading">评论区加载中...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
onMounted(async () => {
  const { default: Waline } = await import('@waline/client')
  const el = document.querySelector('.waline-container')
  if (el) {
    el.innerHTML = ''
    Waline({
      el,
      server: '',
      path: location.pathname,
      locale: {
        nick: '昵称', mail: '邮箱', link: '网址',
        placeholder: '请写下你的评论...',
        submit: '提交评论',
        like: '赞',
        reactions: ['表情一', '表情二', '表情三']
      }
    })
  }
})
</script>
