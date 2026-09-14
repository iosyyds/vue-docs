<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
        <div class="blob b3"></div>
        <div class="blob b4"></div>
      </div>
      <div class="hero-inner">
        <div class="avatar-wrap">
          <div class="avatar-ring"></div>
          <img class="avatar" src="/logo.svg" alt="头像" />
        </div>
        <h1 class="hero-title">
          <span v-for="(ch,i) in titleChars" :key="i" class="char" :style="{ animationDelay: i*0.06+'s' }">{{ ch }}</span>
        </h1>
        <p class="hero-sub">记录技术分享与日常折腾</p>
        <div class="stats">
          <div class="stat"><b>{{ posts.length }}</b><span>文章</span></div>
          <div class="stat-div"></div>
          <div class="stat"><b>{{ tagCount }}</b><span>标签</span></div>
          <div class="stat-div"></div>
          <div class="stat"><b>{{ catCount }}</b><span>分类</span></div>
        </div>
      </div>
    </section>

    <!-- 置顶文章 -->
    <section v-if="pinned.length" class="sec">
      <h2 class="sec-title"><span class="sec-dot"></span>置顶文章</h2>
      <div class="cards">
        <a v-for="(p,i) in pinned" :key="p.url" :href="p.url" class="card pin-card" :style="{ '--d':i*0.1+'s' }">
          <div class="card-shine"></div>
          <div class="card-body">
            <div class="card-badges">
              <span class="badge pin">★ 置顶</span>
              <span class="badge date">{{ p.date }}</span>
            </div>
            <h3 class="card-title">{{ p.title }}</h3>
            <p v-if="p.excerpt" class="card-excerpt">{{ p.excerpt }}</p>
            <div class="card-tags">
              <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="sec">
      <h2 class="sec-title"><span class="sec-dot"></span>最新文章</h2>
      <div class="cards">
        <a v-for="(p,i) in normal" :key="p.url" :href="p.url" class="card" :style="{ '--d':i*0.06+'s' }">
          <div class="card-shine"></div>
          <div class="card-body">
            <div class="card-badges">
              <span class="badge date">{{ p.date }}</span>
              <span class="badge read">📖 约{{ p.readingTime }}分钟</span>
            </div>
            <h3 class="card-title">{{ p.title }}</h3>
            <p v-if="p.excerpt" class="card-excerpt">{{ p.excerpt }}</p>
            <div class="card-tags">
              <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
        </a>
      </div>
      <p v-if="!posts.length" class="empty">暂无文章，快去写第一篇吧</p>
    </section>
  </div>
</template>
<script setup>
import { data as posts } from '../../../posts.data.mts'
const titleChars = '小坤哥哥博客'.split('')
const pinned = posts.filter(p => p.pinned)
const normal = posts.filter(p => !p.pinned)
const tagCount = new Set(posts.flatMap(p => p.tags)).size
const catCount = new Set(posts.map(p => p.category)).size
</script>
