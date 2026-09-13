<template>
  <nav class="prev-next" v-if="prevNext.prev || prevNext.next">
    <div class="prev-next__slot prev-next__slot--prev">
      <a v-if="prevNext.prev" :href="withBase(prevNext.prev.link)" class="prev-next__card prev-next__card--prev">
        <span class="prev-next__label">上一篇</span>
        <span class="prev-next__title">{{ prevNext.prev.text }}</span>
      </a>
    </div>
    <div class="prev-next__slot prev-next__slot--next">
      <a v-if="prevNext.next" :href="withBase(prevNext.next.link)" class="prev-next__card prev-next__card--next">
        <span class="prev-next__label">下一篇</span>
        <span class="prev-next__title">{{ prevNext.next.text }}</span>
      </a>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { IPost } from '../types';
const props = withDefaults(defineProps<{ showPinned?: boolean }>(), { showPinned: true });
const { theme, frontmatter } = useData();
const allPosts: IPost[] = theme.value.posts || [];
const prevNext = computed(() => {
  const posts = props.showPinned ? allPosts : allPosts.filter((post) => !post.order);
  const index = posts.findIndex((post) => post.id === frontmatter.value.id);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: posts[index - 1] ? { text: posts[index - 1].title, link: posts[index - 1].permalink } : null,
    next: posts[index + 1] ? { text: posts[index + 1].title, link: posts[index + 1].permalink } : null
  };
});
</script>

<style lang="less" scoped>
.prev-next {
  display: flex; gap: 1rem; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--vp-c-divider);
  &__slot { flex: 0 0 calc(50% - 0.5rem); display: flex; &--prev { justify-content: flex-start; } &--next { justify-content: flex-end; } }
  &__card {
    width: 100%; display: flex; flex-direction: column; gap: 0.375rem; padding: 1rem 1.25rem;
    background-color: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 0.75rem;
    text-decoration: none; transition: all 0.2s ease;
    &:hover { background-color: var(--vp-c-bg-elv); border-color: var(--vp-c-text-3); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); text-decoration: none; }
    &--prev { align-items: flex-start; } &--next { align-items: flex-end; }
  }
  &__label { font-size: 0.75rem; font-weight: 500; color: var(--vp-c-text-3); letter-spacing: 0.05em; }
  &__title { font-size: 0.9375rem; font-weight: 500; color: var(--vp-c-text-1); line-height: 1.5; }
}
@media (max-width: 640px) {
  .prev-next { flex-direction: column; gap: 0.75rem; }
  .prev-next__slot { flex: none; width: 100%; }
  .prev-next__slot:not(:has(> a)) { display: none; }
  .prev-next__card--next { align-items: flex-start; }
  .prev-next__card--next .prev-next__title { text-align: left; }
}
</style>
