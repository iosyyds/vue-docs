<template>
  <div class="page">
    <h1 class="page-title">文章分类</h1>
    <div class="cat-grid">
      <div v-for="c in cats" :key="c.name" class="cat-card">
        <div class="cat-ico">{{ c.name[0] }}</div>
        <div><b class="cat-name">{{ c.name }}</b><span class="cat-num">{{ c.count }} 篇</span></div>
      </div>
    </div>
    <p v-if="!cats.length" class="empty">暂无分类</p>
  </div>
</template>
<script setup>
import { data as posts } from '../../../posts.data.mts'
const cats = (() => {
  const m = {}
  posts.forEach(p => { const c = p.category || '未分类'; m[c] = (m[c]||0) + 1 })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})()
</script>
