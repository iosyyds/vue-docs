<!-- 中控台 -->
<template>
  <Teleport to="body">
    <Transition name="fade" mode="out-in" @before-enter="changeCloseStyle">
      <div v-if="store.controlShow" class="control" @click="store.changeShowStatus('controlShow')">
        <!-- 关闭按钮 -->
        <div ref="closeControlRef" class="close-control">
          <i class="iconfont icon-close"></i>
        </div>
        <!-- 背景遮罩 -->
        <div class="control-mask" />
        <!-- 中控台内容 -->
        <div class="control-content" @click.stop>
          <!-- 功能菜单 -->
          <div class="menu">
            <!-- 显示模式切换 -->
            <div
              class="menu-item open"
              title="显示模式切换"
              @click.stop="store.changeThemeType"
            >
              <i :class="`iconfont icon-${store.themeType}`"></i>
              <span class="label">显示模式</span>
            </div>
            <!-- 右键菜单开关（仅电脑端） -->
            <div
              :class="['menu-item pc-only', { open: store.useRightMenu }]"
              title="自定义右键菜单开关"
              @click.stop="rightMenuSwitch"
            >
              <i class="iconfont icon-list"></i>
              <span class="label">右键菜单</span>
            </div>
            <!-- 播放器开关 -->
            <div
              :class="['menu-item', { open: store.playerShow }]"
              title="音乐播放器开关"
              @click.stop="store.playerShow = !store.playerShow"
            >
              <i class="iconfont icon-music"></i>
              <span class="label">播放器</span>
            </div>
            <!-- 背景模糊开关 -->
            <div
              :class="['menu-item', { open: store.backgroundBlur }]"
              title="背景模糊开关"
              @click.stop="store.changeShowStatus('backgroundBlur')"
            >
              <i class="iconfont icon-blur"></i>
              <span class="label">背景模糊</span>
            </div>
            <!-- 纪念日置灰开关 -->
            <div
              :class="['menu-item', { open: store.memorialGray }]"
              title="纪念日全站置灰开关"
              @click.stop="memorialGraySwitch"
            >
              <svg
                class="icon-gray"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
              </svg>
              <span class="label">纪念日灰</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();

const closeControlRef = ref(null);

// 更正关闭按钮位置
const changeCloseStyle = () => {
  nextTick().then(() => {
    const controlOpenDom = document.querySelector("#open-control");
    if (controlOpenDom && closeControlRef.value) {
      const { top, left } = controlOpenDom.getBoundingClientRect();
      closeControlRef.value.style.top = `${top}px`;
      closeControlRef.value.style.left = `${left}px`;
      closeControlRef.value.style.opacity = "1";
    }
  });
};

// 右键菜单开关
const rightMenuSwitch = () => {
  store.useRightMenu = !store.useRightMenu;
  $message.info(`${store.useRightMenu ? "已开启" : "已关闭"}自定义右键菜单`);
};

// 纪念日全站置灰开关
const memorialGraySwitch = () => {
  store.memorialGray = !store.memorialGray;
  applyMemorialGray(store.memorialGray);
  const todayGray = getTodayMemorial();
  $message.info(
    store.memorialGray
      ? todayGray
        ? `已开启纪念日置灰（今天是${todayGray}）`
        : "已开启纪念日置灰"
      : "已关闭纪念日置灰",
  );
};

// 应用置灰 class
const applyMemorialGray = (on) => {
  document.documentElement.classList.toggle("gray", !!on);
};

// 当天是否为纪念日
const getTodayMemorial = () => {
  const specialDays = [
    { date: "4-4", name: "清明节" },
    { date: "5-12", name: "汶川大地震纪念日" },
    { date: "7-7", name: "中国人民抗日战争纪念日" },
    { date: "9-18", name: "九·一八事变纪念日" },
    { date: "12-13", name: "南京大屠杀死难者国家公祭日" },
  ];
  const now = new Date();
  const current = `${now.getMonth() + 1}-${now.getDate()}`;
  const hit = specialDays.find((d) => d.date === current);
  return hit ? hit.name : "";
};

// 页面加载时恢复持久化的置灰状态
onMounted(() => {
  applyMemorialGray(store.memorialGray);
});
</script>

<style lang="scss" scoped>
.control {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 1109;
  .close-control {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    padding: 0;
    opacity: 0;
    transition:
      background-color 0.3s,
      opacity 0.3s;
    border-radius: 50%;
    cursor: pointer;
    .iconfont {
      font-size: 18px;
      line-height: 1;
      transition:
        color 0.3s,
        opacity 0.3s;
    }
    &:hover {
      background-color: var(--main-color);
      .iconfont {
        color: var(--main-card-background);
      }
    }
  }
  .control-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: var(--main-mask-background);
    backdrop-filter: blur(6px);
  }
  .control-content {
    position: absolute;
    animation: fade-up 0.5s forwards;
    .menu {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 24px;
      border-radius: 20px;
      border: 1px solid var(--main-card-border);
      background-color: var(--main-card-background);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
      max-width: min(600px, 90vw);
      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 76px;
        height: 80px;
        border-radius: 16px;
        border: 1px solid var(--main-card-border);
        background-color: var(--main-card-background);
        transition:
          transform 0.3s,
          background-color 0.3s,
          border-color 0.3s,
          box-shadow 0.3s;
        cursor: pointer;
        .iconfont {
          font-size: 24px;
          line-height: 1;
          margin-bottom: 8px;
          color: var(--main-font-color);
          transition: color 0.3s;
        }
        .icon-gray {
          display: block;
          margin-bottom: 8px;
          color: var(--main-font-color);
          transition: color 0.3s;
        }
        .label {
          font-size: 12px;
          line-height: 1;
          color: var(--main-font-second-color);
          white-space: nowrap;
          transition: color 0.3s;
        }
        &.open {
          background-color: var(--main-color);
          border-color: var(--main-color);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
          .iconfont,
          .icon-gray,
          .label {
            color: #fff;
          }
        }
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
        }
        &:active {
          transform: scale(0.97);
        }
      }
    }
  }
}

// 手机端适配
@media (max-width: 768px) {
  .control {
    .control-content {
      .menu {
        gap: 10px;
        padding: 16px;
        border-radius: 16px;
        .pc-only {
          display: none; // 右键菜单仅电脑端
        }
        .menu-item {
          width: 62px;
          height: 66px;
          border-radius: 13px;
          .iconfont,
          .icon-gray {
            font-size: 21px;
            margin-bottom: 6px;
          }
          .label {
            font-size: 11px;
          }
        }
      }
    }
  }
}
</style>
