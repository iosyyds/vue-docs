<!-- 首页 -->
<template>
  <div class="home">
    <Banner v-if="showHeader" :height="store.bannerType" />
    <div class="home-content">
      <div class="posts-content">
        <!-- 最新短文公告条（自动轮播前5条） -->
        <a class="essay-banner" href="/pages/essay.html">
          <i class="iconfont icon-article" />
          <span class="essay-banner-text">
            <Transition name="banner-fade" mode="out-in">
              <span :key="essayIndex" class="banner-text-inner">{{ bannerEssays[essayIndex].content }}</span>
            </Transition>
          </span>
          <span class="essay-banner-arrow">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </span>
        </a>
        <!-- 分类总览 -->
        <TypeBar :type="showTags ? 'tags' : 'categories'" />
        <!-- 文章列表 -->
        <PostList :listData="postData" />
        <!-- 分页 -->
        <Pagination
          :total="allListTotal"
          :page="Number(page)"
          :limit="postSize"
          :useParams="showCategories || showTags ? true : false"
          :routePath="
            showCategories
              ? `/pages/categories/${showCategories}`
              : showTags
                ? `/pages/tags/${showTags}`
                : ''
          "
        />
      </div>
      <!-- 侧边栏 -->
      <Aside />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { mainStore } from "@/store";
import essaysData from "@/data/essays.json";

const { theme } = useData();
const store = mainStore();

// 最新短文公告条：自动轮播全部短文
const bannerEssays = essaysData.slice();
const essayIndex = ref(0);
let essayTimer = null;
onMounted(() => {
  if (bannerEssays.length > 1) {
    essayTimer = setInterval(() => {
      essayIndex.value = (essayIndex.value + 1) % bannerEssays.length;
    }, 4000);
  }
});
onBeforeUnmount(() => {
  if (essayTimer) clearInterval(essayTimer);
});
const props = defineProps({
  // 显示首页头部
  showHeader: {
    type: Boolean,
    default: false,
  },
  // 当前页数
  page: {
    type: Number,
    default: 1,
  },
  // 显示分类
  showCategories: {
    type: [null, String],
    default: null,
  },
  // 显示标签
  showTags: {
    type: [null, String],
    default: null,
  },
});

// 每页文章数
const postSize = theme.value.postSize;

// 列表总数量
const allListTotal = computed(() => {
  const data = props.showCategories
    ? theme.value.categoriesData[props.showCategories]?.articles
    : props.showTags
      ? theme.value.tagsData[props.showTags]?.articles
      : theme.value.postData;
  // 返回数量
  return data ? data.length : 0;
});

// 获得当前页数
const getCurrentPage = () => {
  if (props.showCategories || props.showTags) {
    if (typeof window === "undefined") return 0;
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    if (!page) return 0;
    const currentPage = Number(page);
    return currentPage ? currentPage - 1 : 0;
  }
  return props.page ? props.page - 1 : 0;
};

// 根据页数计算列表数据
const postData = computed(() => {
  const page = getCurrentPage();
  console.log("当前页数：", page);
  let data = null;
  // 分类数据
  if (props.showCategories) {
    data = theme.value.categoriesData[props.showCategories]?.articles;
  }
  // 标签数据
  else if (props.showTags) {
    data = theme.value.tagsData[props.showTags]?.articles;
  }
  // 文章数据
  else {
    data = theme.value.postData;
  }
  // 返回列表
  return data ? data.slice(page * postSize, page * postSize + postSize) : [];
});

// 恢复滚动位置
const restoreScrollY = (val) => {
  if (typeof window === "undefined" || val) return false;
  const scrollY = store.lastScrollY;
  nextTick().then(() => {
    console.log("滚动位置：", scrollY);
    // 平滑滚动
    window.scrollTo({
      top: scrollY,
      behavior: "smooth",
    });
    // 清除滚动位置
    store.lastScrollY = 0;
  });
};

// 监听加载结束
watch(
  () => store.loadingStatus,
  (val) => restoreScrollY(val),
);
</script>

<style lang="scss" scoped>
.home {
  // 最新短文公告条（参考 blog.zrf.me）
  .essay-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
    padding: 0.9rem 1.3rem;
    margin-bottom: 1.2rem;
    border-radius: 18px;
    background: var(--main-card-background);
    border: 1px solid var(--main-card-border);
    box-shadow: 0 2px 10px -6px var(--main-border-shadow);
    text-decoration: none;
    color: var(--main-font-color);
    transition: box-shadow 0.25s ease;
    .iconfont {
      flex-shrink: 0;
      font-size: 20px;
      color: var(--main-color);
    }
    .essay-banner-text {
      flex: 1;
      min-width: 0;
      font-size: 14.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      opacity: 0.9;
    }
    .essay-banner-arrow {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--main-color);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s ease, background 0.25s ease;
    }
    &:hover {
      border-color: var(--main-color);
      box-shadow: 0 8px 22px -10px var(--main-border-shadow);
      transform: translateY(-1px);
      .essay-banner-arrow {
        background: #000;
        transform: translateX(3px);
      }
    }
  }
  .home-content {
    width: 100%;
    display: flex;
    flex-direction: row;
    .posts-content {
      width: calc(100% - 300px);
      transition: width 0.3s;
    }
    .main-aside {
      width: 300px;
      padding-left: 1rem;
    }
    @media (max-width: 1200px) {
      .posts-content {
        width: 100%;
      }
      .main-aside {
        display: none;
      }
    }
  }
}

// 公告条短文轮播切换动画
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: all 0.4s ease;
}
.banner-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.banner-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
