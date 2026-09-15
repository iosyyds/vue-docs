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
        <span class="num" v-html="item.value"></span>
        <span class="name">{{ item.name }}</span>
      </div>
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
  {
    name: "总访问量",
    icon: "icon-visibility",
    value: '<span id="busuanzi_value_site_pv">0</span> 次',
  },
  {
    name: "总访客数",
    icon: "icon-account",
    value: '<span id="busuanzi_value_site_uv">0</span> 人',
  },
]);

onMounted(() => {
  loadScript("https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js", {
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
