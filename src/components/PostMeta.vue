<template>
  <div class="post-info" v-if="datetime">
    <div class="post-info__row post-info__row--primary">
      <div class="post-info__group post-info__group--left">
        <div class="post-info__item">
          <Icon class="post-info__icon" icon="mingcute:calendar-line" />
          <span class="post-info__label">发布于</span>
          <span class="post-info__value">{{ formatDate(datetime) }}</span>
        </div>
        <div class="post-info__item" v-if="lastUpdated">
          <Icon class="post-info__icon" icon="mingcute:time-line" />
          <span class="post-info__label">更新于</span>
          <span class="post-info__value">{{ formatDate(lastUpdated) }}</span>
        </div>
      </div>
    </div>
    <div class="post-info__row post-info__row--secondary" v-if="category || (tags && tags.length > 0)">
      <div class="post-info__category" v-if="category">
        <Icon class="post-info__icon" icon="mingcute:folder-line" />
        <span class="post-info__label">分类</span>
        <a :href="withBase(categoryLink(category))" class="post-info__badge post-info__badge--category">{{ category }}</a>
      </div>
      <div class="post-info__tags" v-if="tags && tags.length > 0">
        <Icon class="post-info__icon" icon="mingcute:tag-line" />
        <span class="post-info__label">标签</span>
        <div class="post-info__tags-list">
          <a v-for="tag in tags" :key="tag" :href="withBase(tagLink(tag))" class="post-info__badge post-info__badge--tag">{{ tag }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase } from 'vitepress';
import { useLink } from '../composables/useLink';
import { Icon } from '@iconify/vue';
const { page, frontmatter } = useData();
const { categoryLink, tagLink } = useLink();
const { lastUpdated } = page.value;
const { datetime, category, tags } = frontmatter.value;
const formatDate = (d: string | number) => {
  if (!d) return '';
  const date = new Date(d);
  return `${date.getFullYear()}年${String(date.getMonth()+1).padStart(2,'0')}月${String(date.getDate()).padStart(2,'0')}日`;
};
</script>

<style lang="less" scoped>
.post-info {
  padding: 16px 20px; border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft); border-radius: 1rem; margin: 20px 0;
  &__row { display: flex; align-items: center; &--primary { justify-content: space-between; } &--secondary { gap: 20px; margin-top: 12px; flex-wrap: wrap; } }
  &__group { display: flex; align-items: center; &--left { gap: 20px; flex-wrap: wrap; } }
  &__item { display: flex; align-items: center; gap: 6px; font-size: 14px; color: var(--vp-c-text-2); }
  &__icon { width: 16px; height: 16px; color: var(--vp-c-text-2); flex-shrink: 0; }
  &__label { color: var(--vp-c-text-2); font-weight: 400; font-size: 14px; flex-shrink: 0; }
  &__value { color: var(--vp-c-text-1); font-weight: 500; }
  &__category { display: flex; align-items: center; gap: 8px; font-size: 14px; }
  &__tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  &__tags-list { display: flex; flex-wrap: wrap; gap: 8px; }
  &__badge {
    display: inline-block; padding: 0.075rem 0.625rem; border-radius: 0.5rem;
    font-size: 0.8rem; color: var(--vp-c-text-1); text-decoration: none; font-weight: 500;
    &--category { background-color: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); &:hover { background-color: var(--vp-c-brand-3); color: #fff; text-decoration: none; } }
    &--tag { border-radius: 9999px; background-color: var(--vp-c-bg-elv); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); &:hover { background-color: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-2); color: var(--vp-c-brand-1); text-decoration: none; } }
  }
}
@media (max-width: 768px) {
  .post-info__row--primary { flex-direction: column; align-items: flex-start; gap: 12px; }
  .post-info__row--secondary { flex-direction: column; align-items: flex-start; gap: 12px; }
  .post-info__group--left { gap: 12px; }
  .post-info__item { font-size: 13px; }
  .post-info__badge { font-size: 0.75rem; }
}
</style>
