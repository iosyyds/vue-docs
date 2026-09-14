<template>
  <div class="blog-home">
    <div class="blog-hero">
      <div class="hero-avatar">
        <img src="/logo.svg" alt="avatar" />
      </div>
      <h1>小坤哥哥博客</h1>
      <p class="hero-desc">热爱生活，热爱分享</p>
      <div class="hero-stats">
        <span>{{ posts.length }} 篇文章</span>
      </div>
    </div>
    <div class="post-list">
      <div v-for="post in posts" :key="post.url" class="post-card">
        <a :href="post.url" class="post-card-link">
          <h2 class="post-card-title">{{ post.title }}</h2>
          <p class="post-card-excerpt">{{ post.excerpt }}</p>
          <div class="post-card-meta">
            <span class="meta-date">{{ post.date }}</span>
            <span v-if="post.category" class="meta-cat">{{ post.category }}</span>
            <span v-if="post.tags && post.tags.length" class="meta-tags">
              <span v-for="t in post.tags" :key="t" class="meta-tag">{{ t }}</span>
            </span>
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
      title: fm.title || path.split('/').pop()?.replace('.md',''),
      date: (fm.datetime || fm.date || '').slice(0, 10),
      category: fm.category || '',
      tags: fm.tags || [],
      excerpt: (mod.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 150)
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
})()
</script>
