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
      <PrevNext />
      <CommentItem />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme';
import PrevNext from '../../src/components/PrevNext.vue';
import Copyright from '../../src/components/Copyright.vue';
import Password from '../../src/components/Password.vue';
import ShareItem from '../../src/components/ShareItem.vue';
import CommentItem from './components/CommentItem.vue';
import { usePassword } from '../../src/composables/usePassword.ts';

const { Layout } = DefaultTheme;
const { verified } = usePassword();
</script>
