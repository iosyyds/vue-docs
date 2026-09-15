<!-- Giscus 评论（基于 GitHub Discussions） -->
<template>
  <div ref="giscusRef" class="comment-content giscus" />
</template>

<script setup>
import { mainStore } from "@/store";

const route = useRoute();
const { theme } = useData();
const store = mainStore();
const giscusRef = ref(null);
const observer = ref(null);

// 当前主题
const getTheme = () => {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

// 加载 Giscus
const loadGiscus = () => {
  const { giscus } = theme.value.comment;
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-repo", giscus.repo);
  script.setAttribute("data-repo-id", giscus.repoId);
  script.setAttribute("data-category", giscus.category);
  script.setAttribute("data-category-id", giscus.categoryId);
  script.setAttribute("data-mapping", giscus.mapping || "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", giscus.reactionsEnabled ? "1" : "0");
  script.setAttribute("data-emit-metadata", "1");
  script.setAttribute("data-input-position", giscus.inputPosition || "top");
  script.setAttribute("data-theme", getTheme());
  script.setAttribute("data-lang", giscus.lang || "zh-CN");
  // 注意：不要使用 data-loading="lazy"。
  // giscus 的 iframe 初始高度为 0，若开启懒加载，浏览器会认为它从未进入视口，
  // 导致 widget 永不加载，评论区一直空白。
  giscusRef.value.appendChild(script);
};

// 接收 Giscus 元数据（真实评论数）
const onGiscusMessage = (event) => {
  if (event.origin !== "https://giscus.app") return;
  const giscus = event.data?.giscus;
  if (!giscus) return;
  // discussion 存在时返回该讨论的评论总数，无评论时为 0
  const count = giscus.discussion ? giscus.discussion.totalCommentCount || 0 : 0;
  store.setCommentCount(count);
};

// 切换主题
const changeGiscusTheme = () => {
  const iframe = document.querySelector("iframe.giscus-frame");
  if (!iframe) return;
  iframe.contentWindow.postMessage(
    {
      giscus: { setConfig: { theme: getTheme() } },
    },
    "https://giscus.app",
  );
};

onMounted(() => {
  if (typeof window === "undefined") return;
  loadGiscus();
  window.addEventListener("message", onGiscusMessage);
  // 监听 html class 变化（明暗切换）
  observer.value = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "class") {
        changeGiscusTheme();
      }
    }
  });
  observer.value.observe(document.documentElement, { attributes: true });
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
  window.removeEventListener("message", onGiscusMessage);
});
</script>

<style lang="scss" scoped>
.comment-content {
  width: 100%;
  min-height: 180px;
  margin-top: 1rem;
  :deep(.giscus) {
    width: 100%;
  }
  :deep(iframe.giscus-frame) {
    width: 100%;
    border: none;
  }
}
</style>
