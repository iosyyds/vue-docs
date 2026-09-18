<template>
  <Transition name="fade" mode="out-in">
    <div v-if="listData?.length" class="link-list">
      <div v-for="(type, index) in groupedList" :key="index" class="link-type-list">
        <div class="title">
          <h2 class="name">
            <span class="name-text">{{ type?.typeName || "未知分组" }}</span>
            <span v-if="showCount" class="name-count">（{{ type?.typeList?.length || 0 }}）</span>
          </h2>
          <span class="tip">{{ type?.typeDesc || "分组暂无简介" }}</span>
        </div>
        <!-- 友链状态角标说明（推荐分组不显示） -->
        <div v-if="useFriendsLink && type?.type !== 'rec'" class="badge-legend">
          <span class="legend-item">
            <i class="dot owner"></i>博主（本站）
          </span>
          <span class="legend-item">
            <i class="dot friend"></i>好友（已互加）
          </span>
          <span class="legend-item">
            <i class="dot pending"></i>待回（对方未回加）
          </span>
          <span class="legend-item">
            <i class="dot unknown"></i>未知（无法检测）
          </span>
        </div>
        <div class="all-link" v-if="type?.typeList">
          <a
            v-for="(link, index) in sortedLinks(type.typeList)"
            :class="[
              'link-card',
              's-card',
              {
                loss: type?.type === 'loss',
                'cf-friends-link': type?.type !== 'loss' && useFriendsLink,
                'link-disabled': useFriendsLink && isDisabled(link.url),
              },
            ]"
            :key="index"
            :href="type?.type !== 'loss' && !isDisabled(link.url) ? link.url : null"
            target="_blank"
          >
            <div class="cover">
              <LazyLoader :useFriendsLink="link.avatar || link.ico">
                <img
                  :src="link.avatar || link.ico"
                  :class="['cover-img', { 'cf-friends-avatar': useFriendsLink }]"
                  :alt="link?.name || 'cover'"
                  @load="(e) => e.target.classList.add('loaded')"
                />
              </LazyLoader>
            </div>
            <span
              v-if="useFriendsLink && badgeOf(link.url)"
              :class="['link-badge', badgeOf(link.url)]"
            >
              {{ badgeText(link.url) }}
            </span>
            <div class="data">
              <span :class="['name', { 'cf-friends-name': useFriendsLink }]">{{ link.name }}</span>
              <span class="desc">{{ link.desc }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div v-else class="no-data">暂无友链数据</div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  // 列表数据
  listData: {
    type: [Array, String],
    default: () => [],
  },
  // 显示数量
  showCount: {
    type: Boolean,
    default: true,
  },
  // 友链朋友圈
  useFriendsLink: {
    type: Boolean,
    default: false,
  },
});

// ===== 友链互相添加检测：读取构建时生成的静态 JSON（GitHub Actions 检测）=====
const STATUS_URL = "/links-status.json";
const MY_SITE_URL = "https://xkbk.cn";

const statusMap = ref({});

const badgeOf = (url) => {
  // 本站显示"博主"
  if (url === MY_SITE_URL || url === "https://xkbk.cn/") return "owner";
  const s = statusMap.value[url];
  if (s === "friend" || s === "pending" || s === "unknown") return s;
  return "";
};

const badgeText = (url) => {
  if (url === MY_SITE_URL || url === "https://xkbk.cn/") return "博主";
  const s = statusMap.value[url];
  if (s === "friend") return "好友";
  if (s === "pending") return "待回";
  if (s === "unknown") return "未知";
  return "";
};

// 待回 / 未知 状态不可点击
const isDisabled = (url) => {
  const s = statusMap.value[url];
  return s === "pending" || s === "unknown";
};

// 好友优先排序：博主 > 好友 > 待回/未知（其余保持原顺序）
const rankOf = (url) => {
  if (url === MY_SITE_URL || url === "https://xkbk.cn/") return 0;
  const s = statusMap.value[url];
  if (s === "friend") return 1;
  return 2;
};

const sortedLinks = (list) => {
  if (!props.useFriendsLink || !Array.isArray(list)) return list || [];
  return [...list].sort((a, b) => rankOf(a.url) - rankOf(b.url));
};

// 分组整理：好友（检测为 friend）归入"推荐"分组；"小伙伴们"保留剩余（待回/未知）
const groupedList = computed(() => {
  if (!props.useFriendsLink || !Array.isArray(props.listData)) return props.listData || [];
  const friendSource = props.listData.find((t) => t.type === "friends");
  const friendList = Array.isArray(friendSource?.typeList) ? friendSource.typeList : [];
  return props.listData.map((type) => {
    const list = Array.isArray(type.typeList) ? type.typeList : [];
    if (type.type === "rec") {
      // 推荐 = 原有推荐（本站）+ 所有好友
      const friendsItems = friendList.filter(
        (l) =>
          (l.url !== MY_SITE_URL && l.url !== "https://xkbk.cn/") &&
          statusMap.value[l.url] === "friend",
      );
      return { ...type, typeList: [...list, ...friendsItems] };
    }
    // 其他分组：排除好友（好友已进推荐）
    const rest = list.filter((l) => statusMap.value[l.url] !== "friend");
    return { ...type, typeList: rest };
  });
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

onMounted(async () => {
  if (!props.useFriendsLink) return;
  const friends = (Array.isArray(props.listData) ? props.listData : []).find(
    (t) => t.type === "friends",
  );
  if (!friends || !friends.typeList?.length) return;

  // 尝试读取静态检测结果
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(STATUS_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && data.map) {
        statusMap.value = data.map;
        return;
      }
    }
  } catch (e) {
    /* 读不到则显示未知 */
  }

  // 读不到 JSON：全部标记为未知（检测失败提示）
  const unknownMap = {};
  friends.typeList.forEach((l) => {
    unknownMap[l.url] = "unknown";
  });
  statusMap.value = unknownMap;
});
</script>

<style lang="scss" scoped>
.link-list {
  .link-type-list {
    margin-top: 2rem;
    .title {
      margin-left: 6px;
      margin-bottom: 1.6rem;
      .name {
        border-bottom: none;
        margin-bottom: 4px;
        font-size: 20px;
        .name-count {
          color: var(--main-font-second-color);
        }
      }
      .tip {
        color: var(--main-font-second-color);
        font-size: 13px;
      }
    }
    // 友链状态角标说明
    .badge-legend {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px 18px;
      margin: -0.6rem 0 1.2rem 6px;
      padding: 10px 14px;
      border-radius: 12px;
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      box-shadow: 0 6px 16px -6px var(--main-border-shadow);
      .legend-item {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: var(--main-font-second-color);
        .dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 6px;
          &.owner {
            background: linear-gradient(135deg, #6366f1, #4f46e5);
          }
          &.friend {
            background: linear-gradient(135deg, #42b883, #2ea07a);
          }
          &.pending {
            background: linear-gradient(135deg, #f0a24b, #e08a2e);
          }
          &.unknown {
            background: linear-gradient(135deg, #7d93b2, #5e7391);
          }
        }
      }
    }
    .all-link {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(5, 1fr);
      .link-card {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 90px;
        width: 100%;
        padding: 12px;
        &.loss {
          pointer-events: none;
        }
        // 待回/未知：不可点击（置灰 + 禁用光标）
        &.link-disabled {
          pointer-events: none;
          cursor: not-allowed;
          opacity: 0.55;
          filter: grayscale(0.35);
        }
        // 好友/待回 徽标（卡片矩形右上角）
        .link-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 3;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.4;
          color: #fff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
          white-space: nowrap;
          &.friend {
            background: linear-gradient(135deg, #42b883, #2ea07a);
          }
          &.owner {
            background: linear-gradient(135deg, #6366f1, #4f46e5);
          }
          &.pending {
            background: linear-gradient(135deg, #f0a24b, #e08a2e);
          }
          &.unknown {
            background: linear-gradient(135deg, #7d93b2, #5e7391);
          }
        }
        .cover {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          min-width: 60px;
          margin-right: 20px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(
            90deg,
            var(--main-card-border) 25%,
            var(--main-card-background) 37%,
            var(--main-card-border) 63%
          );
          background-size: 400% 100%;
          animation: skeleton-loading 1.4s ease infinite;
          transition: all 0.6s;
          .cover-img {
            width: 100%;
            height: 100%;
            background-color: var(--main-card-background);
            opacity: 0;
            filter: blur(10px);
            transition:
              filter 0.3s,
              opacity 0.3s;
            &.loaded {
              opacity: 1;
              filter: blur(0);
            }
          }
        }
        .data {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .name {
            font-weight: bold;
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            line-clamp: 1;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            white-space: nowrap;
          }
          .desc {
            font-size: 13px;
            margin-top: 4px;
            line-height: 1.2;
            color: var(--main-font-second-color);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            transition:
              color 0.3s,
              opacity 0.3s;
          }
        }
        &:hover {
          color: var(--main-card-background);
          background-color: var(--main-color);
          border-color: var(--main-color);
          box-shadow: 0 0 16px 6px var(--main-color-bg);
          .cover {
            margin-right: 6px;
            min-width: 0;
            opacity: 0;
            width: 0;
            height: 0;
          }
          .data {
            .desc {
              opacity: 0.7;
              color: var(--main-card-background);
            }
          }
        }
      }
      @media (max-width: 1200px) {
        grid-template-columns: repeat(4, 1fr);
      }
      @media (max-width: 992px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        .link-card {
          height: 72px;
          padding: 8px 10px;
          .cover {
            width: 48px;
            height: 48px;
            min-width: 48px;
            margin-right: 12px;
          }
          .data {
            .name {
              font-size: 14px;
            }
            .desc {
              font-size: 12px;
            }
          }
        }
      }
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
    }
  }
}
.no-data {
  text-align: center;
  margin-top: 40px;
  font-size: 1.4rem;
  font-weight: bold;
}
</style>
