<!-- 即刻短文：全部短文时间线 -->
<template>
  <div class="essay-list">
    <!-- 发短文输入框（参照 zrf 风格：即刻 + 提示 + 黑色圆形发送） -->
    <div class="essay-editor s-card">
      <span class="editor-tag">即刻</span>
      <input
        v-model="essayInput"
        class="editor-input"
        type="text"
        placeholder="快写一首情歌，雅俗共赏~"
        maxlength="200"
        @keyup.enter="sendEssay"
      />
      <button class="editor-send" title="发布短文" @click="sendEssay">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </div>
    <div class="essay-list-header s-card">
      <i class="iconfont icon-article" />
      <span>即刻短文</span>
      <small>记录零碎的日常与折腾</small>
    </div>
    <div class="essay-timeline">
      <div v-for="(item, i) in allEssays" :key="i" class="essay-item s-card">
        <div class="essay-meta">
          <img class="essay-avatar" :src="theme.siteMeta.logo" alt="logo" />
          <span class="essay-author">{{ item.author || theme.siteMeta.author.name }}</span>
          <time class="essay-date">{{ item.date }}</time>
        </div>
        <p class="essay-text">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import essaysData from "@/data/essays.json";
import initComments from "@/utils/initComments";

const { theme } = useData();

// 输入框内容
const essayInput = ref("");
// 全部短文（静态 + Twikoo 评论），按日期倒序
const allEssays = ref([]);

// 毫秒时间戳 -> YYYY-MM-DD
const formatDate = (ts) => {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// 加载 Twikoo 里存过的短文（即 /pages/essay.html 下的评论）
const loadTwikooEssays = async () => {
  try {
    const Twikoo = await initComments(theme.value);
    const res = await Twikoo.getComments({
      envId: theme.value.comment.twikoo.envId,
      url: "/pages/essay.html",
    });
    const comments = (res?.comments || []).filter((c) => !c.reply);
    const twikooList = comments.map((c) => ({
      content: c.commentText || c.comment || "",
      date: formatDate(c.created),
      author: c.nick || "小坤哥哥",
    }));
    allEssays.value = [...twikooList, ...essaysData].sort((a, b) =>
      a.date < b.date ? 1 : -1
    );
  } catch (e) {
    console.warn("短文（Twikoo）加载失败：", e);
    allEssays.value = [...essaysData].sort((a, b) => (a.date < b.date ? 1 : -1));
  }
};

// 等待 Twikoo 评论区（隐藏存储）渲染出输入框，最多等 15 秒
const waitForTextarea = (timeout = 15000) =>
  new Promise((resolve) => {
    const t0 = Date.now();
    const timer = setInterval(() => {
      const ta = document.querySelector(
        "#comment-dom .tk-input.el-textarea textarea, #comment-dom textarea"
      );
      if (ta || Date.now() - t0 > timeout) {
        clearInterval(timer);
        resolve(ta);
      }
    }, 300);
  });

// 发送短文：内容填入隐藏的 Twikoo 评论区并自动提交
const sendEssay = async () => {
  const text = essayInput.value.trim();
  if (!text) return;
  $message.info("正在发布，请稍候…");
  // 评论区可能还在加载（首次访问需拉 CDN + 后端），自动等待而不是直接报错
  const ta = await waitForTextarea();
  if (!ta) {
    $message.warning("评论组件加载失败，请刷新页面后再试");
    return;
  }
  // 昵称必填：自动填博主昵称（已有则不覆盖）
  const nickInput = document.querySelector("#comment-dom .tk-meta-input input");
  if (nickInput && !nickInput.value) {
    nickInput.value = theme.value.siteMeta.author.name || "小坤哥哥";
    nickInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
  // 填入内容并触发 Vue 的 input 事件
  ta.value = text;
  ta.dispatchEvent(new Event("input", { bubbles: true }));
  essayInput.value = "";
  $message.success("短文已提交，马上刷新");
  // 等表单更新后点提交（Twikoo 发送按钮是 .tk-submit）
  setTimeout(() => {
    const btn = document.querySelector("#comment-dom .tk-submit");
    if (btn) btn.click();
    // 提交后刷新列表
    setTimeout(() => loadTwikooEssays(), 2500);
  }, 200);
};

onMounted(() => {
  loadTwikooEssays();
});
</script>

<style lang="scss" scoped>
.essay-list {
  .essay-editor {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem 0.9rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    .editor-tag {
      flex-shrink: 0;
      font-size: 15px;
      font-weight: bold;
      color: var(--main-color);
    }
    .editor-input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-size: 14.5px;
      color: var(--main-font-color);
      &::placeholder {
        color: var(--main-font-color);
        opacity: 0.4;
      }
    }
    .editor-send {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border: none;
      border-radius: 50%;
      background: #000;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
      &:hover {
        opacity: 0.85;
        transform: scale(1.06);
      }
      &:active {
        transform: scale(0.94);
      }
    }
  }
  .essay-list-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.9rem 1.1rem;
    margin-bottom: 1rem;
    .iconfont {
      font-size: 18px;
      color: var(--main-color);
    }
    span {
      font-size: 17px;
      font-weight: bold;
    }
    small {
      font-size: 12px;
      color: var(--main-font-color);
      opacity: 0.55;
      margin-left: 2px;
    }
  }
  .essay-timeline {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    .essay-item {
      padding: 0.9rem 1.1rem;
      .essay-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 0.5rem;
        .essay-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
        }
        .essay-author {
          font-size: 14px;
          font-weight: bold;
        }
        .essay-date {
          margin-left: auto;
          font-size: 12px;
          color: var(--main-font-color);
          opacity: 0.5;
        }
      }
      .essay-text {
        margin: 0;
        font-size: 14.5px;
        line-height: 1.8;
        color: var(--main-font-color);
        white-space: pre-wrap;
        word-break: break-word;
      }
    }
  }
}
</style>
