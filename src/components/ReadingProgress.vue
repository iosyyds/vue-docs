<template>
  <Transition name="progress-fade">
    <div
      v-if="visible"
      class="reading-progress"
      :style="{ '--progress': progress }"
      @click="scrollTop"
      :title="'阅读进度 ' + Math.round(progress * 100) + '%，点击回到顶部'"
    >
      <svg class="progress-ring" viewBox="0 0 50 50">
        <circle class="progress-bg" cx="25" cy="25" r="22" />
        <circle class="progress-bar" cx="25" cy="25" r="22" />
      </svg>
      <div class="progress-content">
        <span v-if="!hovered" class="progress-text">{{ Math.round(progress * 100) }}</span>
        <svg v-else class="progress-arrow" viewBox="0 0 24 24" width="18" height="18">
          <path d="M12 19V5m0 0l-7 7m7-7l7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);
const visible = ref(false);
const hovered = ref(false);

function update() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = height > 0 ? Math.min(scrollTop / height, 1) : 0;
  visible.value = scrollTop > 200;
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true });
  update();
});
onUnmounted(() => window.removeEventListener('scroll', update));
</script>

<style scoped>
.reading-progress {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  inset: 0;
  width: 48px;
  height: 48px;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: var(--vp-c-divider, rgba(0,0,0,0.1));
  stroke-width: 3;
}

.progress-bar {
  fill: none;
  stroke: #ec4899;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 138.2;
  stroke-dashoffset: calc(138.2 * (1 - var(--progress)));
  transition: stroke-dashoffset 0.15s ease;
}

.dark .progress-bar {
  stroke: #f472b6;
}

.progress-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.progress-text {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1;
}

.progress-arrow {
  color: #ec4899;
}

.reading-progress:hover .progress-ring {
  opacity: 0.9;
}

.progress-fade-enter-active,
.progress-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.progress-fade-enter-from,
.progress-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .reading-progress {
    bottom: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
  .progress-ring {
    width: 44px;
    height: 44px;
  }
  .progress-text {
    font-size: 12px;
  }
}
</style>
