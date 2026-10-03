<!-- 侧边栏 - 站点数据 -->
<template>
  <div class="site-data s-card">
    <div class="title">
      <i class="iconfont icon-chart"></i>
      <span class="title-name">站点数据</span>
    </div>
    <div class="all-data">
      <div
        v-for="(item, index) in dataList"
        :key="index"
        class="data-item"
        :style="{ '--data-color': dataColors[index % dataColors.length], '--i': index }"
      >
        <div class="icon-wrap">
          <i :class="`iconfont ${item.icon}`"></i>
        </div>
        <span class="num">{{ item.value }}</span>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
    <!-- 51统计面板 -->
    <div class="la-widget">
      <div id="la-data-widget"></div>
    </div>
  </div>
</template>

<script setup>
import { loadScript } from "@/utils/commonTools";
import { daysFromNow } from "@/utils/helper";

const { theme } = useData();

// 数据项颜色
const dataColors = ["#5b8ff9", "#61ddaa", "#f6bd16", "#e8684a"];

// 站点数据列表
const dataList = computed(() => [
  { name: "文章总数", icon: "icon-article", value: `${theme.value.postData?.length || 0} 篇` },
  { name: "建站天数", icon: "icon-date", value: `${daysFromNow(theme.value.since)} 天` },
]);

onMounted(() => {
  // 加载51统计widget
  loadScript("https://v6-widget.51.la/v6/LJuM8F1h3kXFwnCW/quote.js?theme=0&f=12", {
    async: true,
    reload: true,
  });
});
</script>

<style lang="scss" scoped>
.site-data {
  .title {
    .iconfont {
      color: var(--main-color);
    }
  }
  .all-data {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    .data-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 14px 6px 12px;
      border-radius: 12px;
      background-color: var(--main-card-second-background);
      border: 1px solid var(--main-card-border);
      opacity: 0;
      transform: translateY(10px);
      animation: site-data-in 0.45s ease forwards;
      animation-delay: calc(var(--i) * 80ms);
      transition:
        transform 0.3s,
        box-shadow 0.3s,
        border-color 0.3s;
      .icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 11px;
        background-color: color-mix(in srgb, var(--data-color) 12%, transparent);
        color: var(--data-color);
        transition: transform 0.3s;
        .iconfont {
          font-size: 17px;
        }
      }
      .num {
        font-size: 16px;
        font-weight: bold;
        color: var(--main-font-color);
        line-height: 1.5;
      }
      .name {
        font-size: 12px;
        opacity: 0.6;
      }
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 16px -8px color-mix(in srgb, var(--data-color) 45%, transparent);
        border-color: color-mix(in srgb, var(--data-color) 35%, transparent);
        .icon-wrap {
          transform: scale(1.1) rotate(-6deg);
        }
      }
    }
  }
  .la-widget {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--main-card-border);
    text-align: center;
    opacity: 0.7;
  }
  @media (prefers-reduced-motion: reduce) {
    .data-item {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
}
// 数据卡浮现
@keyframes site-data-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>