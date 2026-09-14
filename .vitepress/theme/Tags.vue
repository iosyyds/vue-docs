<template>
  <div class="blog-page">
    <h1 class="page-title">文章标签</h1>
    <div class="tag-cloud">
      <span v-for="tag in tags" :key="tag.name" class="tag-pill">{{ tag.name }} <em>{{ tag.count }}</em></span>
    </div>
  </div>
</template>
<script setup>
const tags = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  const m = {}
  Object.values(keys).forEach(mod => {
    const fm = mod.frontmatter || {}
    ;(fm.tags || []).forEach(t => { m[t] = (m[t]||0) + 1 })
  })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})()
</script>
