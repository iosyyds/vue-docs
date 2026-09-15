# 什么是 Vue

Vue（发音为 /vjuː/，类似于 **view**）是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型。

## 核心特性

### 渐进式框架

Vue 的设计自底向上逐层应用。核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。

### 声明式渲染

Vue 基于标准模板语法，让你可以声明式地描述最终的 UI 和 JavaScript 状态之间的关系：

```vue
<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue!')
</script>

<template>
  <h1>{{ message }}</h1>
  <input v-model="message" />
</template>
```

### 组件化

组件化应用构建是 Vue 的另一个重要概念，它允许我们使用小型、独立和通常可复用的组件构建大型应用。

## 下一步

- 继续阅读 [快速上手](./getting-started)
- 了解 [模板语法](./template-syntax)
