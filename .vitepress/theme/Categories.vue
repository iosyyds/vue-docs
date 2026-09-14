<template>
  <div class="blog-page">
    <h1 class="page-title">文章分类</h1>
    <div class="cat-grid">
      <div v-for="cat in cats" :key="cat.name" class="cat-card">
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-count">{{ cat.count }} 篇</span>
      </div>
    </div>
    <p v-if="!cats.length" class="empty">暂无分类</p>
  </div>
</template>
<script setup>
const cats = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  const m = {}
  Object.values(keys).forEach(mod => {
    const c = mod.frontmatter?.category || '未分类'
    m[c] = (m[c]||0) + 1
  })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})()
</script>
