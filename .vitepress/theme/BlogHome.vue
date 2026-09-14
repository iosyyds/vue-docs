<template>
  <div class="blog-home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-blob"></div>
      <div class="hero-avatar">
        <img src="/logo.svg" alt="avatar" />
      </div>
      <h1 class="hero-title">小坤哥哥博客</h1>
      <p class="hero-sub">记录技术分享与日常折腾</p>
      <div class="hero-stats">
        <span>{{ posts.length }} 篇文章</span>
        <span class="dot">·</span>
        <span>{{ tagCount }} 个标签</span>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="section">
      <h2 class="section-title">最新文章</h2>
      <div class="post-list">
        <a v-for="(post, i) in posts" :key="post.url" :href="post.url" class="post-card" :style="{ animationDelay: i * 0.06 + 's' }">
          <div class="post-card-body">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="meta-date">{{ post.date }}</span>
              <span v-if="post.category" class="meta-cat">{{ post.category }}</span>
              <span v-if="post.tags.length" class="meta-tags">
                <span v-for="t in post.tags" :key="t" class="meta-tag">{{ t }}</span>
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
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
      category: fm.category || '',
      tags: fm.tags || [],
      excerpt: (mod.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 120)
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
})()
const tagCount = new Set(posts.flatMap(p => p.tags)).size
</script>
