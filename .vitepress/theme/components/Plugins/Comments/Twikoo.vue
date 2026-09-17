<template>
  <div ref="commentRef" id="comment-dom" :class="['comment-content', 'twikoo', { fill }]" />
</template>

<script setup>
import { jumpRedirect } from "@/utils/commonTools";
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

// 评论数据
const twikoo = ref(null);
const commentRef = ref(null);

// 头像兜底：优先取评论者网站的 favicon，失败则用昵称首字母
const getNick = (item) =>
  (item.querySelector(".tk-nick-link") || item.querySelector(".tk-nick") || { textContent: "" }).textContent.trim();

const getHost = (item) => {
  const link =
    item.querySelector(".tk-nick-link")?.getAttribute("href") || "";
  if (!link) return "";
  try {
    return new URL(link).host;
  } catch (e) {
    return "";
  }
};

const showFavicon = (box, url) => {
  box.innerHTML = "";
  const img = document.createElement("img");
  img.src = url;
  img.alt = "avatar";
  img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
  box.appendChild(img);
};

const showLetterAvatar = (box, nick) => {
  box.innerHTML = "";
  const div = document.createElement("div");
  div.textContent = (nick || "友").trim().charAt(0);
  div.style.cssText =
    "width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,#42b883,#3eaf7c);color:#fff;font-size:18px;font-weight:bold;";
  box.appendChild(div);
};

const tryFallback = (box, item) => {
  const nick = getNick(item);
  const host = getHost(item);
  const candidates = host
    ? [`https://${host}/favicon.ico`, `https://favicon.im/${host}`]
    : [];
  const tryNext = (i) => {
    if (i >= candidates.length) {
      showLetterAvatar(box, nick);
      return;
    }
    const probe = new Image();
    probe.onload = () => showFavicon(box, candidates[i]);
    probe.onerror = () => tryNext(i + 1);
    probe.src = candidates[i];
  };
  tryNext(0);
};

const applyAvatarFallback = () => {
  document.querySelectorAll(".tk-comment").forEach((item) => {
    const box = item.querySelector(".tk-avatar");
    if (!box || box.dataset.fbApplied) return;
    box.dataset.fbApplied = "1";
    // 优先：评论人填了网址 → 直接用其网站图标（favicon）
    const host = getHost(item);
    if (host) {
      tryFallback(box, item);
      return;
    }
    // 未填网址：保留邮箱头像（QQ/gravatar），加载失败再用首字母
    const img =
      box.querySelector(".tk-avatar-img") || box.querySelector("img");
    if (!img || (img.complete && img.naturalWidth === 0)) {
      showLetterAvatar(box, getNick(item));
      return;
    }
    img.addEventListener("error", () => showLetterAvatar(box, getNick(item)));
  });
};

// 初始化 Twikoo
const initTwikoo = async () => {
  try {
    await nextTick();
    const Twikoo = await initComments(theme.value);
    twikoo.value = Twikoo.init({
      el: commentRef.value || "#comment-dom",
      envId: comment.twikoo.envId,
      placeholder: "欢迎留言～填 QQ 邮箱自动显示头像，其他邮箱需在 weavatar.com 设置头像",
      onCommentLoaded: () => {
        console.log("评论已加载完毕");
        applyAvatarFallback();
        // 动态监听：翻页、回复等新渲染的头像也兜底
        const target = document.querySelector("#comment-dom");
        if (target) {
          const observer = new MutationObserver(() => applyAvatarFallback());
          observer.observe(target, { childList: true, subtree: true });
        }
        if (props.fill) fillComments(props.fill);
        jumpRedirect(null, theme.value, true);
      },
    });
    return twikoo.value;
  } catch (error) {
    console.error("初始化评论出错：", error);
  }
};

// 填充评论区
const fillComments = (data) => {
  console.log("填充评论：", data);
  // 获取评论元素
  const commentDom = document.querySelector(".tk-input.el-textarea");
  if (!commentDom) return false;
  // 获取输入框
  const commentInput = commentDom.querySelector("textarea");
  // 写入内容
  commentInput.value = data + "\n\n";
  commentInput.focus();
};

onMounted(() => {
  initTwikoo();
});
</script>
