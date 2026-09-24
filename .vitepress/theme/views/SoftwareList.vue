<!-- 常用软件 -->
<template>
  <div class="software">
    <!-- 标题 -->
    <div class="soft-title">
      <h1 class="title-name">常用软件</h1>
      <span class="title-desc">分享我在电脑与手机上常用的软件</span>
    </div>
    <!-- Tab 切换 -->
    <div class="soft-tabs">
      <button
        :class="['tab', { active: activeTab === 'pc' }]"
        @click="activeTab = 'pc'"
      >
        <i class="iconfont icon-window" />
        电脑软件
      </button>
      <button
        :class="['tab', { active: activeTab === 'mobile' }]"
        @click="activeTab = 'mobile'"
      >
        <i class="iconfont icon-accessible" />
        手机软件
      </button>
    </div>
    <!-- 软件网格 -->
    <Transition name="soft-fade" mode="out-in">
      <div :key="activeTab" class="soft-grid">
        <a
          v-for="(item, index) in currentList"
          :key="item.name"
          class="soft-card s-card"
          :href="item.link || undefined"
          :target="item.link ? '_blank' : undefined"
          :style="{ '--soft-color': item.color, '--i': index }"
        >
          <div class="soft-icon">
            <img v-if="item.icon" :src="item.icon" :alt="item.name" />
            <template v-else>{{ item.initial }}</template>
          </div>
          <div class="soft-info">
            <span class="soft-name">{{ item.name }}</span>
            <span class="soft-desc">{{ item.desc }}</span>
          </div>
          <span class="soft-tag">{{ item.tag }}</span>
        </a>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const activeTab = ref("pc");

// 软件数据
const softwareData = {
  pc: [
    { name: "Visual Studio Code", desc: "代码编辑器，写博客、写代码全靠它", tag: "开发", color: "#3b82f6", initial: "V", icon: "https://favicon.im/code.visualstudio.com?larger=true", link: "https://code.visualstudio.com/" },
    { name: "Chrome", desc: "主力浏览器，调试页面离不开", tag: "浏览", color: "#34a853", initial: "C", icon: "https://favicon.im/google.com?larger=true", link: "https://www.google.com/chrome/" },
    { name: "微信", desc: "日常沟通，工作生活都在上面", tag: "社交", color: "#07c160", initial: "微", icon: "https://favicon.im/weixin.qq.com?larger=true", link: "https://weixin.qq.com/" },
    { name: "Git", desc: "版本管理，博客源码都交给它", tag: "开发", color: "#f05033", initial: "G", icon: "https://favicon.im/git-scm.com?larger=true", link: "https://git-scm.com/" },
    { name: "剪映", desc: "视频剪辑，记录折腾过程", tag: "创作", color: "#4a5cf7", initial: "剪", icon: "https://favicon.im/capcut.cn?larger=true", link: "https://www.capcut.cn/" },
    { name: "Postman", desc: "接口调试，对接 API 必备", tag: "开发", color: "#ff6c37", initial: "P", icon: "https://favicon.im/postman.com?larger=true", link: "https://www.postman.com/" },
  ],
  mobile: [
    { name: "微信", desc: "每天打开次数最多的 App", tag: "社交", color: "#07c160", initial: "微", icon: "https://favicon.im/weixin.qq.com?larger=true", link: "https://weixin.qq.com/" },
    { name: "抖音", desc: "刷视频摸鱼找灵感", tag: "娱乐", color: "#161823", initial: "抖", icon: "https://favicon.im/douyin.com?larger=true", link: "https://www.douyin.com/" },
    { name: "小红书", desc: "生活分享与搜攻略", tag: "生活", color: "#ff2442", initial: "红", icon: "https://favicon.im/xiaohongshu.com?larger=true", link: "https://www.xiaohongshu.com/" },
    { name: "高德地图", desc: "出门导航、找店必备", tag: "出行", color: "#00a7ee", initial: "高", icon: "https://favicon.im/amap.com?larger=true", link: "https://www.amap.com/" },
    { name: "支付宝", desc: "移动支付与生活缴费", tag: "工具", color: "#1677ff", initial: "支", icon: "https://favicon.im/alipay.com?larger=true", link: "https://www.alipay.com/" },
    { name: "网易云音乐", desc: "写代码时的背景音乐", tag: "娱乐", color: "#c20c0c", initial: "云", icon: "https://favicon.im/music.163.com?larger=true", link: "https://music.163.com/" },
  ],
};

// 当前分类列表
const currentList = computed(() => softwareData[activeTab.value]);
</script>

<style lang="scss" scoped>
.software {
  min-height: 400px;
  // 标题
  .soft-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.2rem;
    .title-name {
      font-size: 2.1rem;
      margin: 0;
      background: linear-gradient(90deg, var(--main-color) 0%, #7c5cff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .title-desc {
      margin-top: 12px;
      font-size: 0.95rem;
      opacity: 0.6;
    }
  }
  // Tab
  .soft-tabs {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-bottom: 1.6rem;
    .tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 26px;
      border-radius: 40px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      color: var(--main-font-color);
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      transition: all 0.3s;
      .iconfont {
        font-size: 16px;
      }
      &:hover {
        color: var(--main-color);
        border-color: var(--main-color-bg);
        background-color: var(--main-color-bg);
      }
      &.active {
        color: #fff;
        border-color: transparent;
        background: linear-gradient(90deg, var(--main-color), #7c5cff);
        box-shadow: 0 8px 18px -8px var(--main-color);
      }
    }
  }
  // 网格
  .soft-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
    .soft-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 1rem 1.1rem;
      border-radius: 16px;
      opacity: 0;
      transform: translateY(18px);
      animation: soft-in 0.45s ease forwards;
      animation-delay: calc(var(--i) * 70ms);
      transition:
        transform 0.3s,
        box-shadow 0.3s,
        border-color 0.3s;
      .soft-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
        flex-shrink: 0;
        border-radius: 13px;
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        transition: transform 0.3s;
        img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 10px;
        }
      }
      .soft-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        .soft-name {
          font-size: 15px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .soft-desc {
          font-size: 12.5px;
          opacity: 0.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .soft-tag {
        flex-shrink: 0;
        padding: 3px 10px;
        font-size: 11.5px;
        border-radius: 20px;
        color: var(--soft-color);
        background-color: color-mix(in srgb, var(--soft-color) 10%, transparent);
        border: 1px solid color-mix(in srgb, var(--soft-color) 30%, transparent);
      }
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 22px -8px color-mix(in srgb, var(--soft-color) 45%, transparent);
        border-color: color-mix(in srgb, var(--soft-color) 40%, transparent);
        .soft-icon {
          transform: scale(1.08) rotate(-6deg);
        }
      }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .soft-card {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
}
// Tab 切换动画
.soft-fade-enter-active,
.soft-fade-leave-active {
  transition: all 0.25s ease;
}
.soft-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.soft-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
// 卡片浮现
@keyframes soft-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
