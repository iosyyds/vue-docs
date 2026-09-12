# 模板语法

Vue 使用了基于 HTML 的模板语法，允许开发者声明式地将 DOM 绑定到底层 Vue 实例的数据。

## 文本插值

最基本的数据绑定形式是文本插值，即 "Mustache" 语法（双大括号）：

```vue
template: <span>Message: {{ msg }}</span>
```

## 指令

指令是带有 `v-` 前缀的特殊属性。

### v-bind

用于响应式地更新 HTML 属性：

```vue
v-bind:href="url"
```

### v-on

用于监听 DOM 事件：

```vue
v-on:click="doSomething"
```

### v-model

在表单输入元素或组件上创建双向绑定：

```vue
<input v-model="text" />
```

## 缩写

Vue 为 `v-bind` 和 `v-on` 提供了特定的缩写：

| 完整写法 | 缩写 |
| --- | --- |
| `v-bind:href` | `:href` |
| `v-on:click` | `@click` |
