<template>
  <DefaultLayout>
    <template #aside-outline-before>
      <div class="toc-card">
        <h4>本页目录</h4>
      </div>
    </template>
  </DefaultLayout>
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
const { Layout: DefaultLayout } = DefaultTheme
</script>
