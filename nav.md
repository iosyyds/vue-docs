---
layout: page
title: 甜甜导航
---

# 🐰 甜甜导航

> 我的个人网站集合，新窗口打开。

<div class="link-grid">
  <a href="https://iosdh.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">🧭</span>
    <span class="link-name">甜甜导航</span>
    <span class="link-desc">个人常用网址导航聚合页</span>
  </a>
  <a href="https://pan.puaaa.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">☁️</span>
    <span class="link-name">甜甜网盘</span>
    <span class="link-desc">在线网盘存储与文件分享</span>
  </a>
  <a href="https://qqqi.top" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">💳</span>
    <span class="link-name">甜甜发卡</span>
    <span class="link-desc">自动发卡平台卡密便捷售卖</span>
  </a>
  <a href="https://love.ttla.top" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">🎮</span>
    <span class="link-name">甜甜游戏</span>
    <span class="link-desc">在线小游戏聚合娱乐平台</span>
  </a>
  <a href="https://puaaa.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">📝</span>
    <span class="link-name">网事集</span>
    <span class="link-desc">个人博客生活记录与分享</span>
  </a>
  <a href="https://yao.hugv.me" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">💊</span>
    <span class="link-name">我的药盒</span>
    <span class="link-desc">用药提醒健康管理小工具</span>
  </a>
</div>

<style scoped>
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin: 24px 0 48px;
}
.link-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
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
  font-size: 32px;
  margin-bottom: 12px;
  display: inline-block;
}
.link-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 16px;
}
.link-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}
</style>
