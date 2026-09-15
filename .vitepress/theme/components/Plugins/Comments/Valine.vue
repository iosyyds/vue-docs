<!-- Valine 评论（基于 LeanCloud） -->
<template>
  <div v-if="!configured" class="valine-tip">
    评论系统正在配置中，请稍候…
  </div>
  <div v-else ref="commentRef" id="comment-dom" :class="['comment-content', 'valine', { fill }]" />
</template>

<script setup>
import { mainStore } from "@/store";
import initComments from "@/utils/initComments";

const props = defineProps({
  // 填充评论区
  fill: {
    type: [Boolean, String],
    default: false,
  },
});

const { theme } = useData();
const { comment } = theme.value;
const store = mainStore();

// 评论容器
const commentRef = ref(null);
const configured = computed(
  () => !!(comment.valine.appId && comment.valine.appKey),
);
const observer = ref(null);

// 从 DOM 统计真实评论数（Valine 渲染在 .vlist .vcard 中，含回复）
const updateCommentCount = () => {
  if (!commentRef.value) return;
  const cards = commentRef.value.querySelectorAll(".vlist .vcard");
  store.setCommentCount(cards.length);
};

// 初始化 Valine
const initValine = async () => {
  try {
    await nextTick();
    const Valine = await initComments(theme.value);
    const config = comment.valine;
    new Valine({
      el: commentRef.value || "#comment-dom",
      appId: config.appId,
      appKey: config.appKey,
      serverURLs: config.serverURLs,
      placeholder: config.placeholder || "说点什么吧~",
      avatar: config.avatar || "retro",
      requiredFields: config.requiredFields || ["nick"],
      recordIP: false,
      visitor: false,
      lang: "zh-CN",
    });
    // 监听评论区 DOM 变化，实时统计评论数
    observer.value = new MutationObserver(updateCommentCount);
    observer.value.observe(commentRef.value, { childList: true, subtree: true });
    updateCommentCount();
  } catch (error) {
    console.error("Valine 初始化失败：", error);
  }
};

onMounted(() => {
  if (configured.value) initValine();
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
});
</script>

<style lang="scss" scoped>
.comment-content {
  width: 100%;
  margin-top: 1rem;
}
.valine-tip {
  margin-top: 1rem;
  padding: 2rem;
  text-align: center;
  color: var(--main-font-second-color);
  background: var(--main-card-second-background);
  border-radius: 12px;
  border: 1px dashed var(--main-card-border);
  font-size: 14px;
}
</style>
