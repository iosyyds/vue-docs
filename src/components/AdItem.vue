<template>
  <div class="amazing" v-if="custom">
    <a class="amazing__link" :href="item.link" target="_blank" v-for="item in computedAds">
      <img class="amazing__img" :src="item.img" :title="item.title" :alt="item.title" />
    </a>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { IAd } from '../types';
defineProps({
  custom: Array<IAd | IAd[]>,
  type: String as PropType<'sidebar' | 'aside' | 'doc'>
});
const computedAds = computed(() => {
  const newArr: IAd[] = [];
  // This is simplified - actual logic in original
  return newArr;
});
</script>

<style lang="less" scoped>
.amazing {
  &__link { display: flex; justify-content: center; }
  &__img { width: 100%; }
}
</style>
