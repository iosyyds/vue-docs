<template>
  <div class="blog-page">
    <h1 class="page-title">友情链接</h1>
    <div class="friends-grid">
      <a v-for="f in friends" :key="f.url" :href="f.url" target="_blank" class="friend-card">
        <div class="friend-avatar">
          <img :src="f.avatar" :alt="f.name" loading="lazy" />
        </div>
        <div class="friend-info">
          <span class="friend-name">{{ f.name }}</span>
          <span class="friend-desc">{{ f.desc }}</span>
        </div>
      </a>
    </div>
  </div>
</template>
<script setup>
const friends = [
  { name: '甜甜导航', url: 'https://iosdh.cn', avatar: 'https://iosdh.cn/favicon.ico', desc: '好用的网址导航' },
  { name: '甜甜网盘', url: 'https://pan.puaaa.cn', avatar: 'https://pan.puaaa.cn/favicon.ico', desc: '免费网盘服务' },
  { name: '甜甜发卡', url: 'https://qqqi.top', avatar: 'https://qqqi.top/favicon.ico', desc: '发卡网平台' },
  { name: '甜甜游戏', url: 'https://love.ttla.top', avatar: 'https://love.ttla.top/favicon.ico', desc: '游戏分享' },
  { name: '网事集', url: 'https://puaaa.cn', avatar: 'https://puaaa.cn/favicon.ico', desc: '网络日志' },
  { name: '我的药盒', url: 'https://yao.hugv.me', avatar: 'https://yao.hugv.me/favicon.ico', desc: '用药记录' }
]
</script>
