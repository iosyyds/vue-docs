---
title: 甜甜导航
aside: false
card: true
---

<div class="nav-page">

# 🐰 甜甜导航

> 我的个人网站集合，点击新窗口打开。

## 🏠 个人门户

<div class="link-grid">
  <a href="https://iosdh.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
    </span>
    <span class="link-body">
      <span class="link-name">甜甜导航</span>
      <span class="link-desc">个人常用网址导航聚合页</span>
    </span>
  </a>
  <a href="https://puaaa.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    </span>
    <span class="link-body">
      <span class="link-name">网事集</span>
      <span class="link-desc">个人博客生活记录与分享</span>
    </span>
  </a>
</div>

## 🛠️ 实用工具

<div class="link-grid">
  <a href="https://pan.puaaa.cn" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
    </span>
    <span class="link-body">
      <span class="link-name">甜甜网盘</span>
      <span class="link-desc">在线网盘存储与文件分享</span>
    </span>
  </a>
  <a href="https://qqqi.top" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
    </span>
    <span class="link-body">
      <span class="link-name">甜甜发卡</span>
      <span class="link-desc">自动发卡平台卡密便捷售卖</span>
    </span>
  </a>
  <a href="https://yao.hugv.me" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M12 8v8M8 12h8"/></svg>
    </span>
    <span class="link-body">
      <span class="link-name">我的药盒</span>
      <span class="link-desc">用药提醒健康管理小工具</span>
    </span>
  </a>
</div>

## 🎮 休闲娱乐

<div class="link-grid">
  <a href="https://love.ttla.top" target="_blank" rel="noopener" class="link-card">
    <span class="link-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>
    </span>
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
  padding: 40px 24px 40px;
}
.nav-page h1 {
  text-align: center;
  margin-bottom: 8px;
}
.nav-page > p {
  text-align: center;
  color: var(--main-font-second-color);
  margin-bottom: 32px;
}
.nav-page h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--main-color-bg);
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
  background: var(--main-card-second-background);
  border: 1px solid var(--main-card-border);
  text-decoration: none;
  transition: all 0.25s ease;
}
.link-card:hover {
  transform: translateY(-3px);
  border-color: var(--main-color);
  box-shadow: 0 8px 24px var(--main-border-shadow);
}
.link-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--main-color-bg);
  border-radius: 12px;
  color: var(--main-color);
}
.link-icon svg {
  width: 22px;
  height: 22px;
}
.link-body {
  display: flex;
  flex-direction: column;
}
.link-name {
  font-weight: 600;
  color: var(--main-font-color);
  font-size: 15px;
}
.link-desc {
  font-size: 13px;
  color: var(--main-font-second-color);
  margin-top: 2px;
}

/* ========== 移动端适配 ========== */
@media (max-width: 768px) {
  .nav-page {
    padding: 24px 8px 32px;
  }
  .nav-page h1 {
    font-size: 28px;
  }
  .nav-page > p {
    margin-bottom: 24px;
    font-size: 14px;
  }
  .nav-page h2 {
    font-size: 17px;
    margin: 24px 0 12px;
  }
  .link-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .link-card {
    padding: 14px 16px;
    gap: 12px;
  }
  .link-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
  .link-icon svg {
    width: 20px;
    height: 20px;
  }
  .link-name {
    font-size: 14px;
  }
  .link-desc {
    font-size: 12px;
  }
}
</style>
