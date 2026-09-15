---
title: "Vue 3 组合式 API 实战入门：从 setup 到组件拆分"
date: 2026-09-15
slug: vue3-composition-api
description: "这篇文章介绍 Vue 3 组合式 API 的核心用法：setup 语法糖、ref 与 reactive 的区别、computed 与 watch 的使用，以及如何用自定义 Hook 把组件逻辑拆分成可复用的模块，适合从 Options API 迁移或刚入门 Vue 3 的开发者。"
categories: ["前端开发"]
tags: ["Vue", "前端", "JavaScript"]
cover: "/images/covers/cover_vue3.jpg"
aliases: [/posts/vue3-composition-api]
toc: true
comment: true
---

![封面](/images/covers/cover_vue3.jpg)

Vue 3 最核心的变化就是组合式 API（Composition API）。相比 Vue 2 的选项式 API，它让相关逻辑可以聚在一起，组件大了之后更好维护。这篇文章用一个真实的计数器 + 请求示例，带你过一遍最常用的几个 API。

## 为什么需要组合式 API

Vue 2 时代，一个复杂组件里，同一个功能的 `data`、`methods`、`watch` 散落在不同选项里。功能一多，上下翻代码非常痛苦。组合式 API 的核心思想是：**按功能组织代码**，而不是按选项类型组织。

![组合式 API 逻辑组织对比](/images/tutorial/vue3.svg)

## setup 语法糖

Vue 3.2+ 推荐直接使用 `<script setup>`，省去 `setup()` 函数和 `return` 的样板代码：

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);
const double = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">点击 {{ count }}，翻倍是 {{ double }}</button>
</template>
```

`<script setup>` 里定义的变量和函数，模板中可以直接使用，不需要 `return`。

## ref 与 reactive 怎么选

```js
import { ref, reactive } from "vue";

// 基本类型用 ref，取值需要 .value
const count = ref(0);
count.value++;

// 对象用 reactive 更直观
const user = reactive({ name: "小坤", age: 18 });
user.age = 19;

// 但 reactive 解构会丢失响应性，需要用 toRefs
const { name, age } = toRefs(user);
```

**建议**：统一用 `ref` 也可以，现在 `ref` 底层已经支持对象，性能差距可以忽略。团队统一一种写法，比纠结哪个更好更重要。

## computed 与 watch

```js
import { ref, computed, watch } from "vue";

const keyword = ref("");

// computed：依赖变化自动重新计算
const filteredList = computed(() => {
  return list.value.filter((item) => item.includes(keyword.value));
});

// watch：监听变化执行副作用
watch(keyword, (newVal, oldVal) => {
  console.log(`关键词从 ${oldVal} 变成 ${newVal}`);
  // 这里可以防抖请求接口
});

// 立即执行一次
watch(keyword, handler, { immediate: true, deep: true });
```

## 自定义 Hook：把逻辑拆出去

当逻辑复杂时，抽成 `useXxx` 函数，组件之间复用：

```js
// useCounter.js
import { ref, computed } from "vue";

export function useCounter(initial = 0) {
  const count = ref(initial);
  const double = computed(() => count.value * 2);
  const increment = () => count.value++;
  const reset = () => (count.value = initial);
  return { count, double, increment, reset };
}
```

```vue
<script setup>
import { useCounter } from "./useCounter.js";
const { count, double, increment, reset } = useCounter(10);
</script>
```

## 异步请求的推荐写法

```js
import { ref, onMounted } from "vue";

const data = ref(null);
const loading = ref(true);
const error = ref(null);

async function fetchData() {
  loading.value = true;
  try {
    const res = await fetch("/api/posts");
    data.value = await res.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);
```

## 小结

- 用 `<script setup>` 简化样板代码
- 基本类型用 `ref`，对象可 `reactive`（配 `toRefs`）
- 派生状态用 `computed`，副作用用 `watch`
- 逻辑复杂就抽成 `useXxx` 自定义 Hook，天然可复用、可测试

组合式 API 上手成本很低，关键是养成"按功能分组"的思维。下一篇可以聊聊 `provide/inject` 做跨层级通信，以及 `watchEffect` 和 `watch` 的区别。