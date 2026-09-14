<template>
  <div class="blog-page">
    <h1 class="page-title">文章归档</h1>
    <div class="post-list">
      <div v-for="post in posts" :key="post.url" class="post-card">
        <a :href="post.url" class="post-card-link">
          <h2 class="post-card-title">{{ post.title }}</h2>
          <div class="post-card-meta">
            <span class="meta-date">{{ post.date }}</span>
            <span v-if="post.category" class="meta-cat">{{ post.category }}</span>
          </div>
        </a>
      </div>
    </div>
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
      date: (fm.datetime || fm.date || '').slice(0, 10),
      category: fm.category || ''
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
})()
</script>
