<template>
  <div class="blog-page">
    <h1 class="page-title">文章标签</h1>
    <div class="tag-cloud">
      <span v-for="tag in tags" :key="tag.name" class="tag-pill"
            :style="{ fontSize: Math.min(0.9 + tag.count * 0.1, 1.5) + 'em' }">
        {{ tag.name }}<em>{{ tag.count }}</em>
      </span>
    </div>
    <p v-if="!tags.length" class="empty">暂无标签</p>
  </div>
</template>
<script setup>
const tags = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  const m = {}
  Object.values(keys).forEach(mod => {
    ;(mod.frontmatter?.tags || []).forEach(t => { m[t] = (m[t]||0) + 1 })
  })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})()
</script>
