<!-- 评论 -->
<template>
  <div
    v-if="theme.comment.enable"
    :key="router.route.path"
    ref="mainCommentRef"
    id="main-comment"
    class="comment"
  >
    <div v-if="!fill" class="title">
      <span class="name">
        <i class="iconfont icon-chat"></i>
        评论
      </span>
      <span class="title-right">
        <span class="anon" :class="{ __on: anonOn }" @click="toggleAnon">匿名评论</span>
        <span class="tool" @click="router.go('/pages/privacy')"> 隐私政策 </span>
      </span>
    </div>
    <!-- 区分评论系统 -->
    <Artalk v-if="theme.comment.type === 'artalk'" :fill="fill" />
    <Twikoo v-else-if="theme.comment.type === 'twikoo'" :fill="fill" />
    <Giscus v-else-if="theme.comment.type === 'giscus'" :fill="fill" />
    <Valine v-else-if="theme.comment.type === 'valine'" :fill="fill" />
  </div>
</template>

<script setup>
const { theme } = useData();
const router = useRouter();
const props = defineProps({
  // 填充评论区
  fill: {
    type: [Boolean, String],
    default: false,
  },
});
const mainCommentRef = ref(null);
const anonOn = ref(false);

// 匿名评论开关：开启时自动把昵称填为"匿名"
const toggleAnon = () => {
  anonOn.value = !anonOn.value;
  // Twikoo 渲染后昵称输入框在 .tk-meta-input 内
  const nick = document.querySelector(
    ".tk-meta-input input[placeholder*='昵称'], .tk-meta-input .el-input input"
  );
  if (!nick) return;
  nick.value = anonOn.value ? "匿名" : "";
  nick.dispatchEvent(new Event("input", { bubbles: true }));
  nick.dispatchEvent(new Event("change", { bubbles: true }));
  if (anonOn.value) nick.focus();
};

// 滚动至评论
const scrollToComments = () => {
  if (!mainCommentRef.value) return false;
  const elementRect = mainCommentRef.value.getBoundingClientRect();
  const elementTop = elementRect.top + window.scrollY;
  window.scrollBy({ top: elementTop - 80, behavior: "smooth" });
};

defineExpose({ scrollToComments });
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 2rem;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 3rem 0 1rem 0;
    padding: 0 6px;
    .name {
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      .iconfont {
        font-size: 26px;
        font-weight: normal;
        margin-right: 8px;
      }
    }
    .title-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .anon {
      opacity: 0.6;
      font-size: 14px;
      cursor: pointer;
      transition:
        opacity 0.3s,
        color 0.3s;
      &:hover {
        opacity: 1;
        color: var(--main-color);
      }
      &.__on {
        opacity: 1;
        color: var(--main-color);
        font-weight: 600;
      }
    }
    .tool {
      opacity: 0.6;
      font-size: 14px;
      cursor: pointer;
      transition:
        opacity 0.3s,
        color 0.3s;
      &:hover {
        opacity: 1;
        color: var(--main-color);
      }
    }
  }
}
</style>
