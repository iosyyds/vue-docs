<template>
  <div class="home">
    <div class="home__image">
      <img :src="withBase(imgUrl)" />
    </div>
    <div class="home__title">{{ title }}</div>
    <div class="home__desc">{{ desc }}</div>
    <div class="home__links">
      <a :href="item.url" target="_blank" v-for="item in links" :key="item.text">{{ item.text }}</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withBase } from 'vitepress';
import { ref, onMounted, onBeforeUnmount } from 'vue';
defineProps({
  imgUrl: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String },
  links: { type: Array<{ url: string; text: string }>}
});
const contentHeight = ref('');
const handleHeight = () => {
  const content = document.querySelector('.VPContent');
  if (content) {
    const pt = parseFloat(getComputedStyle(content).getPropertyValue('padding-top'));
    contentHeight.value = `${content.clientHeight - pt}px`;
  }
};
const debounce = (fn, delay = 100) => {
  let timer: number;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { fn.apply(this, arguments); timer = null; }, delay) as any;
  };
};
const debouncedHandleHeight = debounce(handleHeight);
onMounted(() => {
  if (typeof window === 'undefined') return;
  handleHeight();
  window.addEventListener('resize', debouncedHandleHeight);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', debouncedHandleHeight);
});
</script>

<style lang="less" scoped>
.home {
  display: flex; flex-direction: column; justify-content: center; align-items: center; height: v-bind(contentHeight);
  &__image { width: 18rem; height: 18rem; img { width: 100%; height: 100%; user-select: none; -webkit-user-drag: none; } }
  &__title { font-size: 2.3rem; font-weight: 700; margin: 1.2rem auto; }
  &__desc { font-size: 1.6rem; line-height: 1.3; color: #6a8bad; margin: 0 auto 1.8rem; }
  &__links { display: flex; a { display: block; padding: 0.5rem; border-radius: 5px; background-color: var(--vp-c-brand); color: #fff; &:not(:last-child) { margin-right: 1rem; } &:hover { background-color: var(--vp-c-brand-3); } } }
}
</style>
