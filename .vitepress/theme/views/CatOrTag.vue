<!-- 分类 / 标签 -->
<template>
  <div class="cat-or-tag">
    <!-- 标题 -->
    <div class="title">
      <h1 class="title-name">{{ type === "categories" ? "全部分类" : "全部标签" }}</h1>
      <span class="title-num">
        <i :class="type === 'categories' ? 'iconfont icon-folder' : 'iconfont icon-hashtag'" />
        共 {{ count }} 个{{ type === "categories" ? "分类" : "标签" }}
      </span>
    </div>
    <!-- 列表 -->
    <div class="type-lists" :class="type">
      <a
        v-for="(item, key, index) in listData"
        :key="index"
        :href="type === 'categories' ? `/pages/categories/${key}` : `/pages/tags/${key}`"
        class="type-item s-card"
        :style="itemStyle(index, item.count)"
      >
        <i :class="type === 'categories' ? 'iconfont icon-folder' : 'iconfont icon-hashtag'" />
        <span class="name">{{ key }}</span>
        <span class="num">{{ item.count }} 篇</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";

const { theme } = useData();
const props = defineProps({
  // 页面类型
  type: {
    type: String,
    default: "categories",
  },
});

// 当前列表数据
const listData = computed(() =>
  props.type === "categories" ? theme.value.categoriesData : theme.value.tagsData
);
const count = computed(() => Object.keys(listData.value)?.length || 0);

// 标签云色板
const tagColors = ["#5b8ff9", "#61ddaa", "#f6bd16", "#e8684a", "#6dc8ec", "#9270ca", "#ff9d6c", "#26c2c2"];

// 每项样式：标签按数量分级大小 + 循环配色
const itemStyle = (index, num) => {
  if (props.type === "tags") {
    return {
      "--i": index,
      "--tag-color": tagColors[index % tagColors.length],
      "--tag-size": `${Math.min(13 + num * 2.2, 20)}px`,
    };
  }
  return { "--i": index };
};

// 滚动进入视口浮现动画
onMounted(() => {
  const items = document.querySelectorAll(".type-item");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in-view"));
  }
});
</script>

<style lang="scss" scoped>
.cat-or-tag {
  min-height: 400px;
  // 标题
  .title {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0.5rem;
    .title-name {
      font-size: 2.1rem;
      margin-bottom: 0;
      background: linear-gradient(90deg, var(--main-color) 0%, #7c5cff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .title-num {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 16px;
      padding: 6px 18px;
      font-size: 0.95rem;
      border-radius: 40px;
      color: var(--main-color);
      background-color: var(--main-color-bg);
      .iconfont {
        font-size: 15px;
      }
    }
  }
  // 分类：网格大卡片
  .type-lists.categories {
    padding: 2rem 0 3rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 560px) {
      grid-template-columns: 1fr;
    }
    .type-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 1.8rem 1rem 1.5rem;
      border-radius: 16px;
      transition:
        transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
        box-shadow 0.35s,
        background-color 0.35s;
      .iconfont {
        font-size: 2rem;
        color: var(--main-color);
        opacity: 0.75;
        transition: transform 0.35s;
      }
      .name {
        font-size: 1.15rem;
        font-weight: bold;
        transition: color 0.3s;
      }
      .num {
        display: inline-flex;
        align-items: center;
        padding: 3px 12px;
        font-size: 12px;
        border-radius: 30px;
        background-color: var(--main-card-border);
        color: var(--main-font-color);
        transition:
          color 0.3s,
          background-color 0.3s;
      }
      &:hover {
        transform: translateY(-6px);
        background: linear-gradient(135deg, var(--main-color) 0%, #7c5cff 100%);
        box-shadow: 0 12px 24px -8px color-mix(in srgb, var(--main-color) 40%, transparent);
        .iconfont {
          transform: scale(1.15) rotate(-8deg);
          color: var(--main-card-background);
        }
        .name {
          color: var(--main-card-background);
        }
        .num {
          background-color: rgba(255, 255, 255, 0.22);
          color: var(--main-card-background);
        }
      }
    }
  }
  // 标签：彩色标签云
  .type-lists.tags {
    padding: 2rem 0 3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .type-item {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      gap: 6px;
      margin: 0.45em;
      padding: 8px 18px;
      border-radius: 40px;
      border: 1px solid var(--tag-color);
      background-color: color-mix(in srgb, var(--tag-color) 10%, transparent);
      font-size: var(--tag-size);
      transition:
        transform 0.3s,
        box-shadow 0.3s,
        background-color 0.3s;
      .iconfont {
        font-size: 0.9em;
        color: var(--tag-color);
        transition: transform 0.3s;
      }
      .name {
        font-weight: bold;
        color: var(--tag-color);
      }
      .num {
        display: inline-flex;
        align-items: center;
        padding: 1px 9px;
        font-size: 0.72em;
        border-radius: 20px;
        background-color: var(--tag-color);
        color: #fff;
      }
      &:hover {
        transform: translateY(-4px) scale(1.06);
        box-shadow: 0 8px 18px -6px var(--tag-color);
        background-color: var(--tag-color);
        .iconfont,
        .name {
          color: #fff;
        }
        .num {
          background-color: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
      }
    }
  }
  // 浮现动画（最后声明，覆盖 transform）
  .type-item {
    opacity: 0;
    transform: translateY(22px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease,
      background-color 0.3s,
      box-shadow 0.3s;
    transition-delay: calc(var(--i, 0) * 60ms);
    &.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .type-item {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
}
</style>
