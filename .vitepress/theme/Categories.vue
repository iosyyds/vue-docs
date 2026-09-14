<template>
  <div class="blog-page">
    <h1 class="page-title">文章分类</h1>
    <div class="tag-grid">
      <div v-for="cat in categories" :key="cat.name" class="tag-card">
        <span class="tag-name">{{ cat.name }}</span>
        <span class="tag-count">{{ cat.count }} 篇</span>
      </div>
    </div>
    <div class="post-list" style="margin-top:30px">
      <div v-for="post in posts" :key="post.url" class="post-card">
        <a :href="post.url" class="post-card-link">
          <h2 class="post-card-title">{{ post.title }}</h2>
          <div class="post-card-meta">
            <span class="meta-date">{{ post.date }}</span>
            <span class="meta-cat">{{ post.category }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup>
const all = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  return Object.entries(keys).map(([path, mod]) => {
    const fm = mod.frontmatter || {}
    return {
      url: path.replace('/posts/', '/posts/').replace('.md', '.html'),
      title: fm.title || '',
      date: (fm.datetime || fm.date || '').slice(0, 10),
      category: fm.category || '未分类'
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
})()
const categories = (() => {
  const m = {}
  all.forEach(p => { m[p.category] = (m[p.category]||0) + 1 })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
})()
const posts = all
</script>
