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
        <span v-if="commentCount > 0" class="count-badge">{{ commentCount }}</span>
      </span>
      <span class="title-right">
        <span class="anon" :class="{ __on: anonOn }" @click="toggleAnon">匿名评论</span>
        <span class="tool" @click="router.go('/pages/privacy')"> 隐私政策 </span>
      </span>
    </div>
    <!-- 区分评论系统 -->
    <Artalk v-if="theme.comment.type === 'artalk'" :fill="fill" />
    <Twikoo v-else-if="theme.comment.type === 'twikoo'" :fill="fill" @count="setCount" />
    <Giscus v-else-if="theme.comment.type === 'giscus'" :fill="fill" />
    <Valine v-else-if="theme.comment.type === 'valine'" :fill="fill" />

    <!-- 开启匿名评论确认弹窗 -->
    <Teleport to="body">
      <div v-if="showAnonConfirm" class="anon-mask" @click.self="showAnonConfirm = false">
        <div class="anon-modal">
          <span class="anon-close" @click="showAnonConfirm = false">×</span>
          <h3 class="anon-title">开启匿名评论</h3>
          <p class="anon-desc">开启后将使用随机昵称与匿名邮箱进行评论，是否继续？</p>
          <div class="anon-btns">
            <button class="anon-cancel" @click="showAnonConfirm = false">取消</button>
            <button class="anon-ok" @click="confirmAnon">确认开启</button>
          </div>
        </div>
      </div>
    </Teleport>
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
const showAnonConfirm = ref(false);
const commentCount = ref(0);

const setCount = (n) => {
  commentCount.value = n;
};

// 随机昵称词库
const ANON_NICKS = [
  "匿名用户",
  "路人甲",
  "过客",
  "吃瓜群众",
  "小透明",
  "潜水员",
  "夜行者",
  "旅人",
  "清风",
  "云朵",
  "山丘",
  "星野",
  "初雪",
  "可乐",
  "奶茶",
  "橘子",
  "柚子",
  "仙人掌",
  "可达鸭",
  "咸鱼",
  "板栗",
  "布丁",
  "青柠",
  "薄荷",
  "海盐",
];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 匿名评论：开启时弹确认框；确认后自动填随机昵称 + 匿名邮箱
const toggleAnon = () => {
  if (anonOn.value) {
    anonOn.value = false;
    waitAndSetMeta("", "", 0, false);
  } else {
    showAnonConfirm.value = true;
  }
};

const confirmAnon = () => {
  showAnonConfirm.value = false;
  anonOn.value = true;
  const nick = rand(ANON_NICKS) + Math.floor(Math.random() * 90 + 10);
  const mail = "anon" + Date.now().toString().slice(-7) + "@proton.me";
  // Twikoo 评论区是异步渲染的，输入框可能还没出现：轮询等待就绪后再填入
  waitAndSetMeta(nick, mail, 0, true);
};

// 填入昵称/邮箱（Twikoo 元信息输入框顺序：昵称、邮箱、网址）
const setInput = (el, value) => {
  if (!el) return;
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
};

const setMeta = (nick, mail) => {
  const inputs = document.querySelectorAll(".tk-meta-input input");
  if (inputs[0]) setInput(inputs[0], nick);
  if (inputs[1]) setInput(inputs[1], mail);
};

// 轮询等待输入框就绪（最长约 15 秒），兼容评论慢加载
const waitAndSetMeta = (nick, mail, attempt, doFocus) => {
  const inputs = document.querySelectorAll(".tk-meta-input input");
  if (inputs.length >= 2) {
    setInput(inputs[0], nick);
    setInput(inputs[1], mail);
    if (doFocus && nick) {
      // 输入框聚焦提示用户已填好
      try {
        inputs[0].focus();
        inputs[0].scrollIntoView({ block: "center", behavior: "smooth" });
      } catch (e) {
        /* 忽略 */
      }
    }
    return;
  }
  if (attempt >= 50) return; // 50 × 300ms ≈ 15s
  setTimeout(() => waitAndSetMeta(nick, mail, attempt + 1, doFocus), 300);
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
      .count-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        padding: 0 8px;
        margin-left: 10px;
        border-radius: 12px;
        background: var(--main-color, #2eaadc);
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
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

// 匿名确认弹窗
:deep(.anon-mask) {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.anon-modal) {
  position: relative;
  width: min(400px, 86vw);
  background: #fff;
  border-radius: 14px;
  padding: 28px 26px 22px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  text-align: center;
}
:deep(.anon-close) {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 22px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  &:hover {
    color: #333;
  }
}
:deep(.anon-title) {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2329;
}
:deep(.anon-desc) {
  margin: 0 0 22px;
  font-size: 14px;
  color: #646a73;
  line-height: 1.6;
}
:deep(.anon-btns) {
  display: flex;
  gap: 12px;
  justify-content: center;
  button {
    padding: 8px 26px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    border: none;
  }
}
:deep(.anon-cancel) {
  background: #f2f3f5;
  color: #646a73;
  &:hover {
    background: #e5e6eb;
  }
}
:deep(.anon-ok) {
  background: var(--main-color, #2eaadc);
  color: #fff;
  &:hover {
    opacity: 0.9;
  }
}
</style>
