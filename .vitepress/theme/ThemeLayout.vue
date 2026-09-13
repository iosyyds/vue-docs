<template>
  <Password v-if="!verified" />
  <Layout v-else>
    <template #aside-outline-before>
      <ShareItem />
    </template>
    <template #doc-footer-before>
      <Copyright />
    </template>
    <template #doc-after>
      <div v-if="editUrl" class="edit-page-btn">
        <a :href="editUrl" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          在 GitHub 上编辑此页
        </a>
      </div>
      <PrevNext />
      <CommentItem />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import PrevNext from '../../src/components/PrevNext.vue';
import Copyright from '../../src/components/Copyright.vue';
import Password from '../../src/components/Password.vue';
import ShareItem from '../../src/components/ShareItem.vue';
import CommentItem from './components/CommentItem.vue';
import { usePassword } from '../../src/composables/usePassword.ts';

const { Layout } = DefaultTheme;
const { verified } = usePassword();
const { page } = useData();

const editUrl = page.value.filePath
  ? `https://github.com/iosyyds/vue-docs/edit/main/${page.value.filePath}`
  : '';
</script>

<style scoped>
.edit-page-btn {
  margin: 24px 0 8px;
}
.edit-page-btn a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-3);
  background: var(--vp-c-brand-soft);
  transition: all 0.2s;
}
.edit-page-btn a:hover {
  background: var(--vp-c-brand-3);
  color: #fff;
}
</style>
