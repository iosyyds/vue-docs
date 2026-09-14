<template>
  <div class="blog-page">
    <!-- Banner -->
    <section class="banner">
      <div class="banner-bg"></div>
      <h1 class="banner-title">你好，欢迎来到小坤哥哥博客</h1>
      <p class="banner-sub">记录技术分享与日常折腾</p>
    </section>

    <!-- 文章列表 -->
    <section class="post-section">
      <div class="post-lists">
        <a v-for="(p,i) in posts" :key="p.url" :href="p.url" class="post-card"
           :style="{ animationDelay: 0.3 + i*0.08 + 's' }">
          <div class="post-meta-top">
            <span v-if="p.category" class="post-cat">📁 {{ p.category }}</span>
            <span v-if="p.pinned" class="post-top">📌 置顶</span>
          </div>
          <h3 class="post-title">{{ p.title }}</h3>
          <p v-if="p.excerpt" class="post-desc">{{ p.excerpt }}</p>
          <div class="post-bottom">
            <div v-if="p.tags.length" class="post-tags">
              <span v-for="t in p.tags" :key="t" class="post-tag">#{{ t }}</span>
            </div>
            <span class="post-date">{{ p.date }}</span>
          </div>
        </a>
      </div>
      <p v-if="!posts.length" class="empty">暂无文章</p>
    </section>
  </div>
</template>
<script setup>
import { data as posts } from '../../../posts.data.mts'
</script>
