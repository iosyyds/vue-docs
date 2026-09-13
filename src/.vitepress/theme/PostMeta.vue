<template>
  <div class="post-meta">
    <span class="meta-item">
      <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      {{ author }}
    </span>
    <span class="meta-item">
      <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      {{ dateText }}
    </span>
    <span class="meta-item">
      <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      {{ readingTime }}
    </span>
    <span v-if="category" class="meta-tag">
      <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      {{ category }}
    </span>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'

const { frontmatter } = useData()

const author = computed(() => frontmatter.value.author || 'XKGG')

const dateText = computed(() => {
  const d = frontmatter.value.date
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return ''
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const category = computed(() => frontmatter.value.category || '')

const minutes = ref(1)
onMounted(() => {
  const text = document.querySelector('.vp-doc')?.innerText || ''
  minutes.value = Math.max(1, Math.round(text.length / 400))
})
const readingTime = computed(() => minutes.value <= 1 ? '小于1分钟' : `约 ${minutes.value} 分钟`)
</script>

<style scoped>
.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin: 6px 0 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.meta-icon {
  width: 14px;
  height: 14px;
  opacity: .65;
}
.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 12px;
  border-radius: 999px;
  background: #fce7f3;
  color: #db2777;
  font-size: 12px;
  font-weight: 500;
}
.dark .meta-tag {
  background: rgba(236, 72, 153, .15);
  color: #ec4899;
}
</style>
