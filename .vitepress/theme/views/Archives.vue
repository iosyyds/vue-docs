<template>
  <div class="page">
    <h1 class="page-title">文章归档</h1>
    <p class="page-desc">共 {{ posts.length }} 篇文章</p>
    <div v-for="g in groups" :key="g.year" class="year-block">
      <h2 class="year">{{ g.year }}</h2>
      <div class="tl">
        <a v-for="p in g.posts" :key="p.url" :href="p.url" class="tl-item">
          <span class="tl-dot"></span>
          <span class="tl-date">{{ p.date.slice(5) }}</span>
          <span class="tl-text">{{ p.title }}</span>
        </a>
      </div>
    </div>
    <p v-if="!posts.length" class="empty">暂无文章</p>
  </div>
</template>
<script setup>
import { data as posts } from '../../../posts.data.mts'
const groups = (() => {
  const m = {}
  posts.forEach(p => { const y = p.date.slice(0,4); (m[y]=m[y]||[]).push(p) })
  return Object.entries(m).map(([year, ps]) => ({ year, posts: ps })).reverse()
})()
</script>
