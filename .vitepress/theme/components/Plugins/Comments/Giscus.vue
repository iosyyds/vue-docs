<!-- Giscus 评论（基于 GitHub Discussions） -->
<template>
  <div ref="giscusRef" class="comment-content giscus" />
</template>

<script setup>
const route = useRoute();
const { theme } = useData();
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
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", giscus.inputPosition || "top");
  script.setAttribute("data-theme", getTheme());
  script.setAttribute("data-lang", giscus.lang || "zh-CN");
  script.setAttribute("data-loading", "lazy");
  giscusRef.value.appendChild(script);
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
});
</script>

<style lang="scss" scoped>
.comment-content {
  width: 100%;
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
