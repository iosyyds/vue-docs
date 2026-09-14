<template>
  <div class="blog-home">
    <div class="blog-hero">
      <h1>小坤哥哥博客</h1>
      <p>记录技术分享与日常折腾</p>
    </div>
    <div class="post-list">
      <div v-for="post in posts" :key="post.url" class="post-card">
        <a :href="post.url" class="post-card-link">
          <h2 class="post-card-title">{{ post.title }}</h2>
          <p class="post-card-excerpt">{{ post.excerpt }}</p>
          <div class="post-card-meta">
            <span>{{ post.date }}</span>
            <span v-if="post.category" class="post-card-cat">{{ post.category }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { site } = useData()

const posts = (() => {
  const keys = import.meta.glob('/posts/*.md', { eager: true })
  return Object.entries(keys).map(([path, mod]) => {
    const fm = mod.frontmatter || {}
    return {
      url: path.replace('/posts/', '/posts/').replace('.md', '.html'),
      title: fm.title || path.split('/').pop()?.replace('.md',''),
      date: fm.datetime || fm.date || '',
      category: fm.category || '',
      excerpt: (mod.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 120)
    }
  }).sort((a, b) => b.date.localeCompare(a.date))
})()
</script>
