<template>
  <div class="blog-page">
    <h1 class="page-title">文章归档</h1>
    <div v-for="group in groups" :key="group.year" class="year-group">
      <h2 class="year-title">{{ group.year }}</h2>
      <div class="timeline">
        <a v-for="post in group.posts" :key="post.url" :href="post.url" class="timeline-item">
          <span class="timeline-dot"></span>
          <span class="timeline-date">{{ post.date.slice(5) }}</span>
          <span class="timeline-title">{{ post.title }}</span>
        </a>
      </div>
    </div>
    <p v-if="!posts.length" class="empty">暂无文章</p>
  </div>
</template>
<script setup>
const posts = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  return Object.entries(keys).map(([path, mod]) => {
    const fm = mod.frontmatter || {}
    return {
      url: path.replace('/posts/', '/posts/').replace('.md', '.html'),
      title: fm.title || '',
      date: (fm.datetime || fm.date || '').slice(0, 10)
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
})()
const groups = (() => {
  const m = {}
  posts.forEach(p => { const y = p.date.slice(0,4); (m[y]=m[y]||[]).push(p) })
  return Object.entries(m).map(([year, ps]) => ({ year, posts: ps })).reverse()
})()
</script>
