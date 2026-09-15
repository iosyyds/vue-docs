<!-- 即刻短文：全部短文时间线 -->
<template>
  <div class="essay-list">
    <div class="essay-list-header s-card">
      <i class="iconfont icon-article" />
      <span>即刻短文</span>
      <small>记录零碎的日常与折腾</small>
    </div>
    <div class="essay-timeline">
      <div v-for="(item, i) in allEssays" :key="i" class="essay-item s-card">
        <div class="essay-meta">
          <img class="essay-avatar" :src="theme.siteMeta.logo" alt="logo" />
          <span class="essay-author">{{ theme.siteMeta.author.name }}</span>
          <time class="essay-date">{{ item.date }}</time>
        </div>
        <p class="essay-text">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import essaysData from "@/data/essays.json";

const { theme } = useData();

// 全部短文，按日期倒序（数据已倒序，防御性再排一次）
const allEssays = [...essaysData].sort((a, b) => (a.date < b.date ? 1 : -1));
</script>

<style lang="scss" scoped>
.essay-list {
  .essay-list-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.9rem 1.1rem;
    margin-bottom: 1rem;
    .iconfont {
      font-size: 18px;
      color: var(--main-color);
    }
    span {
      font-size: 17px;
      font-weight: bold;
    }
    small {
      font-size: 12px;
      color: var(--main-font-color);
      opacity: 0.55;
      margin-left: 2px;
    }
  }
  .essay-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    .essay-item {
      padding: 0.9rem 1.1rem;
      .essay-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 0.5rem;
        .essay-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        .essay-author {
          font-size: 14px;
          font-weight: bold;
        }
        .essay-date {
          margin-left: auto;
          font-size: 12px;
          color: var(--main-font-color);
          opacity: 0.5;
        }
      }
      .essay-text {
        margin: 0;
        font-size: 14.5px;
        line-height: 1.8;
        color: var(--main-font-color);
        white-space: pre-wrap;
        word-break: break-word;
      }
    }
  }
}
</style>
