<template>
  <div class="home">
    <section class="hero">
      <div class="hero-blob"></div>
      <div class="hero-avatar"><img src="/logo.svg" alt="头像" /></div>
      <h1 class="hero-title">小坤哥哥博客</h1>
      <p class="hero-sub">记录技术分享与日常折腾</p>
      <div class="hero-stats">
        <div class="stat"><span class="stat-num">{{ posts.length }}</span><span class="stat-label">篇文章</span></div>
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">最新文章</h2>
      <div class="post-list">
        <a v-for="(p, i) in posts" :key="p.url" :href="p.url"
           class="post-card" :style="{ animationDelay: i * 0.06 + 's' }">
          <div class="card-glow"></div>
          <div class="card-body">
            <div class="card-meta">
              <span v-if="p.pinned" class="badge-pin">置顶</span>
              <span class="meta-date">{{ p.date }}</span>
            </div>
            <h3 class="card-title">{{ p.title }}</h3>
            <p v-if="p.excerpt" class="card-excerpt">{{ p.excerpt }}</p>
            <div v-if="p.tags.length" class="card-tags">
              <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
        </a>
      </div>
      <p v-if="!posts.length" class="empty">暂无文章</p>
    </section>
  </div>
</template>
<script setup>
import { data as posts } from '../../posts.data.mts'
</script>
