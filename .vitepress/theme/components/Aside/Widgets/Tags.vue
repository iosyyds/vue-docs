<!-- 侧边栏 - 标签 -->
<template>
  <div class="tags-cloud s-card">
    <div class="title">
      <i class="iconfont icon-hashtag"></i>
      <span class="title-name">热门标签</span>
    </div>
    <div class="all-tags">
      <a
        v-for="(item, tag, index) in theme.tagsData"
        :key="index"
        :href="`/pages/tags/${tag}`"
        class="tags"
        :style="{
          '--tag-color': tagColors[index % tagColors.length],
          '--tag-size': `${Math.min(12.5 + item.count * 1.6, 16)}px`,
          '--i': index,
        }"
      >
        <span class="name">{{ tag }}</span>
        <sup class="num">{{ item.count }}</sup>
      </a>
    </div>
    <a href="/pages/tags" class="more-tags">
      查看全部
      <i class="iconfont icon-right" />
    </a>
  </div>
</template>

<script setup>
const { theme } = useData();

// 标签色板（与全部标签页一致）
const tagColors = ["#5b8ff9", "#61ddaa", "#f6bd16", "#e8684a", "#6dc8ec", "#9270ca", "#ff9d6c", "#26c2c2"];
</script>

<style lang="scss" scoped>
.tags-cloud {
  .title {
    .iconfont {
      color: var(--main-color);
    }
  }
  .all-tags {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: 600px;
    overflow: hidden;
    .tags {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      margin: 3px;
      padding: 5px 12px;
      border-radius: 40px;
      border: 1px solid var(--tag-color);
      background-color: color-mix(in srgb, var(--tag-color) 8%, transparent);
      font-size: var(--tag-size);
      color: var(--tag-color);
      opacity: 0;
      transform: translateY(8px);
      animation: tag-cloud-in 0.4s ease forwards;
      animation-delay: calc(var(--i) * 30ms);
      transition:
        transform 0.3s,
        background-color 0.3s,
        box-shadow 0.3s;
      .num {
        margin-left: 2px;
        opacity: 0.7;
        font-size: 0.78em;
        transition: opacity 0.3s;
      }
      &:hover {
        transform: translateY(-3px);
        background-color: var(--tag-color);
        box-shadow: 0 6px 12px -4px var(--tag-color);
        color: #fff;
        .num {
          opacity: 0.9;
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }
  }
  .more-tags {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    height: 40px;
    margin-top: 4px;
    border-radius: 40px;
    font-size: 14px;
    color: var(--main-color);
    border: 1px solid var(--main-color-bg);
    background: linear-gradient(90deg, var(--main-color-bg), color-mix(in srgb, var(--main-color) 12%, transparent));
    transition:
      transform 0.3s,
      box-shadow 0.3s,
      background-color 0.3s;
    .iconfont {
      font-size: 13px;
      transition: transform 0.3s;
    }
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px -8px var(--main-color);
      background: linear-gradient(90deg, var(--main-color), #7c5cff);
      color: #fff;
      .iconfont {
        transform: translateX(3px);
      }
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .tags {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
}
// 标签浮现
@keyframes tag-cloud-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
