<template>
  <div class="blog-home">
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-avatar">
        <img src="/logo.svg" alt="头像" />
      </div>
      <h1 class="hero-title" :data-text="title">{{ title }}</h1>
      <p class="hero-sub">记录技术分享与日常折腾</p>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-num">{{ postCount }}</span>
          <span class="stat-label">篇文章</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ tagCount }}</span>
          <span class="stat-label">个标签</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2 class="section-title">最新文章</h2>
      </div>
      <div class="post-list">
        <a v-for="(post, i) in posts" :key="post.url" :href="post.url"
           class="post-card" :style="{ animationDelay: i * 0.06 + 's' }">
          <div class="post-card-glow"></div>
          <div class="post-card-body">
            <div class="post-meta-top">
              <span v-if="post.pinned" class="post-pinned">置顶</span>
              <span class="post-date">{{ post.date }}</span>
              <span class="post-reading">约{{ post.readingTime }}分钟</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-tags">
              <span v-for="t in post.tags" :key="t" class="post-tag">{{ t }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
<script setup>
const title = '小坤哥哥博客'
const all = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  return Object.entries(keys).map(([path, mod]) => {
    const fm = mod.frontmatter || {}
    const content = (mod.default?.render?.()?.html || '').replace(/<[^>]+>/g, '')
    return {
      url: path.replace('/posts/', '/posts/').replace('.md', '.html'),
      title: fm.title || '',
      date: (fm.datetime || fm.date || '').slice(0, 10),
      category: fm.category || '',
      tags: fm.tags || [],
      pinned: !!fm.pinned,
      readingTime: Math.max(1, Math.round(content.length / 400)),
      excerpt: (mod.excerpt || content).replace(/<[^>]+>/g, '').slice(0, 120)
    }
  }).sort((a, b) => (b.pinned - a.pinned) || b.date.localeCompare(a.date))
})()
const posts = all
const postCount = all.length
const tagCount = new Set(all.flatMap(p => p.tags)).size
</script>
