<!-- Google AdSense 广告位（自动挂载到对应页面，由主题 head 中的 adsbygoogle.js 加载） -->
<template>
  <div v-if="ready && visible" class="ad-unit" :class="wrapperClass">
    <span class="ad-unit-label">广告</span>
    <ins
      ref="insRef"
      class="adsbygoogle"
      style="display: block; text-align: center;"
      data-ad-client="ca-pub-7156604582462189"
      :data-ad-slot="slot"
      :data-ad-format="format"
      :data-ad-layout="layout || null"
      data-full-width-responsive="true"
    ></ins>
  </div>
</template>

<script setup>
const props = defineProps({
  // 广告位 ID（AdSense 后台「广告单元」编号）
  slot: { type: [String, Number], required: true },
  // auto：自适应展示广告；fluid：原生信息流 / 文章内嵌
  format: { type: String, default: "auto" },
  // 文章内嵌布局：in-article
  layout: { type: String, default: "" },
  wrapperClass: { type: String, default: "" },
});

const insRef = ref(null);
const ready = ref(false);
const visible = ref(false);
let ro = null;

onMounted(() => {
  // 仅客户端推送；SSR 阶段不触碰 window
  ready.value = true;
  nextTick(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // adsbygoogle.js 尚未加载完成时静默入队，不影响页面
    }
    const ins = insRef.value;
    if (!ins) return;
    // 监听广告真实高度：填充出内容才显示；始终为空则完全隐藏，不留残框
    const sync = () => {
      visible.value = ins.offsetHeight > 8;
    };
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(sync);
      ro.observe(ins);
    } else {
      setTimeout(sync, 2000);
    }
  });
});

onBeforeUnmount(() => {
  ro?.disconnect();
});
</script>

<style lang="scss" scoped>
.ad-unit {
  position: relative;
  margin: 1.5rem 0;
  padding: 12px;
  border-radius: 16px;
  background: var(--main-card-background);
  border: 1px solid var(--main-card-border);
  box-shadow: 0 2px 10px -6px var(--main-border-shadow);
  overflow: hidden;

  .ad-unit-label {
    position: absolute;
    top: 6px;
    left: 12px;
    font-size: 11px;
    letter-spacing: 2px;
    opacity: 0.35;
    user-select: none;
    pointer-events: none;
  }

  .adsbygoogle {
    width: 100%;
  }
}

.home-ad {
  margin: 1.2rem 0;
}

.sidebar-ad {
  margin: 0 0 1rem;
}

.article-ad {
  margin: 2rem 0;
}
</style>
