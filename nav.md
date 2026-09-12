---
layout: page
title: 网址导航
---

# 🐰 我的网址导航

> 常用网站一键直达，持续更新中。

## 🔍 搜索

<div class="link-grid">
  <a href="https://www.google.com" target="_blank" class="link-card">
    <span class="link-icon">🔍</span>
    <span class="link-name">Google</span>
    <span class="link-desc">全球搜索引擎</span>
  </a>
  <a href="https://www.baidu.com" target="_blank" class="link-card">
    <span class="link-icon">🐾</span>
    <span class="link-name">百度</span>
    <span class="link-desc">中文搜索引擎</span>
  </a>
  <a href="https://www.bing.com" target="_blank" class="link-card">
    <span class="link-icon">🅱️</span>
    <span class="link-name">Bing</span>
    <span class="link-desc">微软搜索引擎</span>
  </a>
</div>

## 💻 开发

<div class="link-grid">
  <a href="https://github.com" target="_blank" class="link-card">
    <span class="link-icon">🐙</span>
    <span class="link-name">GitHub</span>
    <span class="link-desc">代码托管平台</span>
  </a>
  <a href="https://developer.mozilla.org" target="_blank" class="link-card">
    <span class="link-icon">📖</span>
    <span class="link-name">MDN</span>
    <span class="link-desc">Web 开发文档</span>
  </a>
  <a href="https://vuejs.org" target="_blank" class="link-card">
    <span class="link-icon">💚</span>
    <span class="link-name">Vue.js</span>
    <span class="link-desc">渐进式 JavaScript 框架</span>
  </a>
  <a href="https://cn.vuejs.org" target="_blank" class="link-card">
    <span class="link-icon">🇨🇳</span>
    <span class="link-name">Vue 中文文档</span>
    <span class="link-desc">Vue.js 中文官方文档</span>
  </a>
</div>

## 🤖 AI 工具

<div class="link-grid">
  <a href="https://chat.openai.com" target="_blank" class="link-card">
    <span class="link-icon">💬</span>
    <span class="link-name">ChatGPT</span>
    <span class="link-desc">OpenAI 对话助手</span>
  </a>
  <a href="https://claude.ai" target="_blank" class="link-card">
    <span class="link-icon">🧠</span>
    <span class="link-name">Claude</span>
    <span class="link-desc">Anthropic AI 助手</span>
  </a>
  <a href="https://www.cursor.com" target="_blank" class="link-card">
    <span class="link-icon">✨</span>
    <span class="link-name">Cursor</span>
    <span class="link-desc">AI 代码编辑器</span>
  </a>
</div>

## 🌐 社区

<div class="link-grid">
  <a href="https://juejin.cn" target="_blank" class="link-card">
    <span class="link-icon">💎</span>
    <span class="link-name">掘金</span>
    <span class="link-desc">开发者技术社区</span>
  </a>
  <a href="https://www.zhihu.com" target="_blank" class="link-card">
    <span class="link-icon">💡</span>
    <span class="link-name">知乎</span>
    <span class="link-desc">问答社区</span>
  </a>
  <a href="https://stackoverflow.com" target="_blank" class="link-card">
    <span class="link-icon">📚</span>
    <span class="link-name">Stack Overflow</span>
    <span class="link-desc">编程问答社区</span>
  </a>
</div>

<style scoped>
.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
  font-size: 28px;
  margin-bottom: 10px;
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
