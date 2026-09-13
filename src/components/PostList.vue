<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.title" class="post-item" @click="navigate(post.permalink)">
      <div class="post-item__header">
        <h2 class="post-item__title">
          <span v-if="post.order && showPinned" class="post-item__pinned">
            <Icon class="post-item__pinned-icon" icon="mingcute:fire-fill" />
            {{ post.pinned || 'HOT' }}
          </span>
          <a :href="withBase(post.permalink)" @click.stop style="color:inherit;text-decoration:none">{{ post.title }}</a>
        </h2>
        <a v-if="post.category" :href="withBase(categoryLink(post.category))" class="post-item__category" @click.stop>{{ post.category }}</a>
      </div>
      <p v-if="post.excerpt" class="post-item__excerpt">{{ post.excerpt }}</p>
      <div class="post-item__footer">
        <div class="post-item__footer-left">
          <div class="post-item__meta">
            <Icon class="post-item__icon" icon="mingcute:calendar-line" />
            <span class="post-item__date">{{ post.datetime.split(' ')[0] }}</span>
          </div>
          <div v-if="post.tags && post.tags.length" class="post-item__tags">
            <a v-for="tag in post.tags" :key="tag" :href="withBase(tagLink(tag))" class="post-item__tag" @click.stop>
              <Icon class="post-item__tag-icon" icon="mingcute:tag-line" />{{ tag }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useData, withBase, useRouter } from 'vitepress';
import { IPost } from '../types';
import { Icon } from '@iconify/vue';
import { useLink } from '../composables/useLink';
const { theme } = useData();
const router = useRouter();
const { categoryLink, tagLink } = useLink();
defineProps({ posts: Array<IPost>, showPinned: { type: Boolean, default: true } });
const navigate = (url: string) => router.go(withBase(url));
</script>

<style lang="less" scoped>
.post-list { display: flex; flex-direction: column; gap: 1rem; }
.post-item {
  display: block; background-color: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem; padding: 1.25rem; transition: all 0.15s ease;
  -webkit-tap-highlight-color: rgba(0,0,0,0); cursor: pointer;
  &:hover { border-color: var(--vp-c-brand-soft); box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1); & .post-item__title { color: var(--vp-c-brand); } & .post-item__excerpt { color: var(--vp-c-text-1); } }
  &__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1.5rem; margin-bottom: 0.75rem; }
  &__title { flex: 1; font-size: 1.25rem; font-weight: 700; line-height: 1.4; color: var(--vp-c-text-1); margin: 0; }
  &__pinned { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.125rem 0.5rem; margin-right: 0.5rem; background-color: var(--vp-c-brand-soft); color: var(--vp-c-brand); font-size: 0.6875rem; font-weight: 600; border-radius: 0.375rem; }
  &__pinned-icon { font-size: 0.875rem; }
  &__category { flex-shrink: 0; padding: 0.25rem 0.625rem; background-color: var(--vp-c-bg-alt); color: var(--vp-c-text-2); font-size: 0.875rem; border-radius: 0.5rem; white-space: nowrap; text-decoration: none; &:hover { color: var(--vp-c-brand); background-color: var(--vp-c-brand-soft); } }
  &__excerpt { color: var(--vp-c-text-2); line-height: 1.6; margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
  &__footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--vp-c-gray-3); padding-top: 0.75rem; gap: 1rem; flex-wrap: wrap; }
  &__footer-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  &__meta { display: flex; align-items: center; color: var(--vp-c-text-2); font-size: 0.875rem; }
  &__icon { margin-right: 0.375rem; font-size: 1rem; }
  &__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
  &__tag { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.625rem; background-color: var(--vp-c-bg); color: var(--vp-c-text-2); font-size: 0.75rem; border: 1px solid var(--vp-c-divider); border-radius: 9999px; text-decoration: none; &:hover { background-color: var(--vp-c-brand-soft); color: var(--vp-c-brand); border-color: var(--vp-c-brand); text-decoration: none; } }
  &__tag-icon { font-size: 0.875rem; }
}
@media screen and (max-width: 768px) {
  .post-list { gap: 0.75rem; }
  .post-item { padding: 1rem; &__header { flex-direction: column; gap: 0.5rem; } &__title { font-size: 1rem; } &__excerpt { -webkit-line-clamp: 2; } &__footer { flex-direction: column; align-items: flex-start; } &__footer-left { gap: 0.75rem; }
}
</style>
