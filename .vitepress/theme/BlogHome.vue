<template>
  <div class="blog-home">
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-avatar">
        <img src="/logo.svg" alt="头像" />
      </div>
      <h1 class="hero-title">小坤哥哥博客</h1>
      <p class="hero-sub">记录技术分享与日常折腾</p>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-num">{{ posts.length }}</span>
          <span class="stat-label">篇文章</span>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2 class="section-title">最新文章</h2></div>
      <div class="post-list">
        <a v-for="(post, i) in posts" :key="post.url" :href="post.url"
           class="post-card" :style="{ animationDelay: i * 0.06 + 's' }">
          <div class="post-card-glow"></div>
          <div class="post-card-body">
            <div class="post-meta-top">
              <span v-if="post.pinned" class="post-pinned">置顶</span>
              <span class="post-date">{{ post.date }}</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
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
import { data as posts } from '../../posts.data.mts'
</script>
