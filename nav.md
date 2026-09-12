---
layout: page
title: 甜甜导航
---

<div class="nav-page">

# 🐰 甜甜导航

> 我的个人网站集合，点击新窗口打开。

## 🏠 个人门户

<div class="link-grid">
  <a href="https://iosdh.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">🧭</span>
    <span class="link-body">
      <span class="link-name">甜甜导航</span>
      <span class="link-desc">个人常用网址导航聚合页</span>
    </span>
  </a>
  <a href="https://puaaa.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">📝</span>
    <span class="link-body">
      <span class="link-name">网事集</span>
      <span class="link-desc">个人博客生活记录与分享</span>
    </span>
  </a>
</div>

## 🛠️ 实用工具

<div class="link-grid">
  <a href="https://pan.puaaa.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">☁️</span>
    <span class="link-body">
      <span class="link-name">甜甜网盘</span>
      <span class="link-desc">在线网盘存储与文件分享</span>
    </span>
  </a>
  <a href="https://qqqi.top" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">💳</span>
    <span class="link-body">
      <span class="link-name">甜甜发卡</span>
      <span class="link-desc">自动发卡平台卡密便捷售卖</span>
    </span>
  </a>
  <a href="https://yao.hugv.me" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">💊</span>
    <span class="link-body">
      <span class="link-name">我的药盒</span>
      <span class="link-desc">用药提醒健康管理小工具</span>
    </span>
  </a>
</div>

## 🎮 休闲娱乐

<div class="link-grid">
  <a href="https://love.ttla.top" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">🎮</span>
    <span class="link-body">
      <span class="link-name">甜甜游戏</span>
      <span class="link-desc">在线小游戏聚合娱乐平台</span>
    </span>
  </a>
</div>

</div>

<style scoped>
.nav-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}
.nav-page h1 {
  text-align: center;
  margin-bottom: 8px;
}
.nav-page > p {
  text-align: center;
  color: var(--vp-c-text-2);
  margin-bottom: 48px;
}
.nav-page h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  margin: 40px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-brand-soft);
}
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.link-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: all 0.25s ease;
}
.link-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.15);
}
.link-icon {
  font-size: 24px;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
}
.link-body {
  display: flex;
  flex-direction: column;
}
.link-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 15px;
}
.link-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}
</style>
