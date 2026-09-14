<template>
  <div class="page">
    <h1 class="page-title">文章标签</h1>
    <div class="cloud">
      <span v-for="t in tags" :key="t.name" class="cloud-tag"
            :style="{ fontSize: Math.min(.9 + t.count*.1, 1.5) + 'em' }">
        {{ t.name }}<em>{{ t.count }}</em>
      </span>
    </div>
    <p v-if="!tags.length" class="empty">暂无标签</p>
  </div>
</template>
<script setup>
import { data as posts } from '../../../posts.data.mts'
const tags = (() => {
  const m = {}
  posts.forEach(p => (p.tags||[]).forEach(t => { m[t] = (m[t]||0) + 1 }))
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})()
</script>
