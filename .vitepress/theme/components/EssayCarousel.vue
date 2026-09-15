<!-- 首页顶部：即刻短文轮播 -->
<template>
  <div class="essay-carousel s-card" @click="goEssay">
    <!-- 头部 -->
    <div class="essay-header">
      <span class="essay-title">
        <i class="iconfont icon-article" />
        即刻短文
      </span>
      <span class="essay-more">全部短文 ›</span>
    </div>
    <!-- 轮播体 -->
    <div class="essay-body">
      <img class="essay-avatar" :src="theme.siteMeta.logo" alt="logo" />
      <div class="essay-content">
        <Transition name="essay-fade" mode="out-in">
          <p :key="current" class="essay-text">{{ essays[current].content }}</p>
        </Transition>
        <div class="essay-foot">
          <span class="essay-time">{{ formatDate(essays[current].date) }}</span>
          <div class="essay-dots" @click.stop>
            <i
              v-for="(_, i) in essays"
              :key="i"
              :class="['dot', { active: i === current }]"
              @click="current = i"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import essaysData from "@/data/essays.json";

const { theme } = useData();
const router = useRouter();

// 展示最近 5 条
const essays = essaysData.slice(0, 5);
const current = ref(0);
let timer = null;

// 自动轮播
const start = () => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % essays.length;
  }, 4000);
};

onMounted(() => {
  if (essays.length > 1) start();
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

// 时间格式化：显示为 MM-DD 或 YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const sameYear = d.getFullYear() === now.getFullYear();
  const pad = (n) => String(n).padStart(2, "0");
  return `${sameYear ? "" : d.getFullYear() + "-"}${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// 跳转短文页
const goEssay = () => {
  router.go("/pages/essay");
};
</script>

<style lang="scss" scoped>
.essay-carousel {
  margin-bottom: 1rem;
  padding: 0.9rem 1.1rem;
  cursor: pointer;
  transition: border-color 0.3s;
  .essay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    .essay-title {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 15px;
      font-weight: bold;
      color: var(--main-color);
      .iconfont {
        font-size: 16px;
      }
    }
    .essay-more {
      font-size: 12px;
      color: var(--main-font-color);
      opacity: 0.55;
      cursor: pointer;
      transition:
        color 0.3s,
        opacity 0.3s;
      &:hover {
        color: var(--main-color);
        opacity: 1;
      }
    }
  }
  .essay-body {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    .essay-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .essay-content {
      flex: 1;
      min-width: 0;
      .essay-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: var(--main-font-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .essay-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.4rem;
        .essay-time {
          font-size: 12px;
          color: var(--main-font-color);
          opacity: 0.5;
        }
        .essay-dots {
          display: flex;
          align-items: center;
          gap: 5px;
          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--main-font-color);
            opacity: 0.2;
            cursor: pointer;
            transition: all 0.3s;
            &.active {
              width: 16px;
              border-radius: 4px;
              opacity: 1;
              background-color: var(--main-color);
            }
          }
        }
      }
    }
  }
}

// 轮播切换动画
.essay-fade-enter-active,
.essay-fade-leave-active {
  transition: all 0.4s ease;
}
.essay-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.essay-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
