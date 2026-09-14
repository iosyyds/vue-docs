<!-- 全局搜索（本地全文搜索，UI 与原站一致） -->
<template>
  <Modal
    :show="store.searchShow"
    title="全局搜索"
    titleIcon="search"
    @mask-click="store.changeShowStatus('searchShow')"
    @modal-close="store.changeShowStatus('searchShow')"
  >
    <div class="ais-InstantSearch">
      <div class="ais-SearchBox">
        <input
          v-model="query"
          class="ais-SearchBox-input"
          type="search"
          placeholder="想要搜点什么"
          autofocus
          @input="onSearch"
        />
      </div>
      <div v-if="hasSearchValue" class="ais-Hits">
        <Transition name="fade" mode="out-in">
          <div v-if="currentPageItems.length" class="search-list">
            <div
              v-for="(item, index) in currentPageItems"
              :key="index"
              class="search-item s-card hover"
              @click="jumpSearch(item.url)"
            >
              <p class="title" v-html="item.title" />
              <p v-if="item?.anchor" class="anchor" v-html="item.anchor" />
              <p v-if="item?.content" class="content s-card" v-html="item.content" />
            </div>
          </div>
          <div v-else class="no-result">
            <i class="iconfont icon-search-empty" />
            <span class="text">搜索结果为空</span>
          </div>
        </Transition>
      </div>
      <div v-if="hasSearchValue && totalPages > 1" class="ais-Pagination">
        <ul class="ais-Pagination-list">
          <li
            v-for="p in totalPages"
            :key="p"
            :class="[
              'ais-Pagination-item',
              { 'ais-Pagination-item--selected': p === currentPage },
            ]"
          >
            <a class="ais-Pagination-link" href="javascript:;" @click.prevent="currentPage = p">{{ p }}</a>
          </li>
        </ul>
      </div>
      <div class="ais-Stats">
        <span v-if="hasSearchValue" class="text"> 本次用时 {{ processingTimeMS }} 毫秒 </span>
        <span class="power">
          <span class="name">本地全文搜索</span>
        </span>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();
const router = useRouter();

// 查询词与结果
const query = ref("");
const hasSearchValue = ref(false);
const results = ref([]);
const currentPage = ref(1);
const processingTimeMS = ref(0);

// 每页条数（与原站一致）
const PAGE_SIZE = 8;

// 本地索引数据
let searchIndex = [];

// 弹窗打开时加载索引（只加载一次）
watch(
  () => store.searchShow,
  async (show) => {
    if (show && !searchIndex.length) {
      await loadIndex();
    }
  }
);

// 加载本地索引
const loadIndex = async () => {
  try {
    const res = await fetch("/search-index.json");
    const data = await res.json();
    searchIndex = Array.isArray(data) ? data : [];
  } catch (error) {
    searchIndex = [];
  }
};

// 组件挂载即预加载索引（避免持久化状态导致首次搜索为空）
onMounted(() => {
  loadIndex();
});

// 转义正则特殊字符
const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 高亮命中词
const highlight = (text, terms) => {
  let html = text;
  for (const t of terms) {
    html = html.replace(new RegExp(`(${escapeReg(t)})`, "gi"), "<mark>$1</mark>");
  }
  return html;
};

// 内容截取到命中词附近
const truncateAround = (content, terms) => {
  let idx = -1;
  for (const t of terms) {
    const i = content.toLowerCase().indexOf(t.toLowerCase());
    if (i >= 0 && (idx === -1 || i < idx)) idx = i;
  }
  if (idx < 0) return content.slice(0, 140);
  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + 140);
  return (start > 0 ? "…" : "") + content.slice(start, end) + (end < content.length ? "…" : "");
};

// 搜索
const onSearch = () => {
  const q = query.value.trim();
  hasSearchValue.value = q.length > 0;
  currentPage.value = 1;
  if (!q) {
    results.value = [];
    return;
  }
  const start = performance.now();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const matched = [];
  for (const item of searchIndex) {
    const titleLow = item.title.toLowerCase();
    const contentLow = item.content.toLowerCase();
    // 所有关键词都命中（标题或正文）
    const hitTitle = terms.every((t) => titleLow.includes(t));
    const hitContent = terms.every((t) => contentLow.includes(t));
    if (!hitTitle && !hitContent) continue;
    // 相关度：标题命中大幅靠前，命中次数越多越靠前（分数越小越靠前）
    let score = hitTitle ? 0 : 1000;
    for (const t of terms) {
      const titleHits = titleLow.split(t).length - 1;
      const contentHits = contentLow.split(t).length - 1;
      score -= titleHits * 10 + Math.min(contentHits, 3);
    }
    matched.push({
      title: highlight(item.title, terms),
      content: hitContent ? highlight(truncateAround(item.content, terms), terms) : "",
      url: item.url,
      score,
    });
  }
  matched.sort((a, b) => a.score - b.score);
  results.value = matched.slice(0, 100);
  processingTimeMS.value = Math.round(performance.now() - start);
};

// 当前页数据
const currentPageItems = computed(() =>
  results.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE)
);

// 总页数
const totalPages = computed(() => Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)));

// 跳转搜索结果
const jumpSearch = (url) => {
  store.changeShowStatus("searchShow");
  router.go(url);
};

onBeforeUnmount(() => {
  hasSearchValue.value = false;
});
</script>

<style lang="scss">
.ais-InstantSearch {
  height: 100%;
  .ais-SearchBox {
    height: 40px;
    width: 100%;
    .ais-SearchBox-input {
      width: 100%;
      outline: none;
      border-radius: 8px;
      font-size: 16px;
      padding: 0.6rem 1rem;
      color: var(--main-font-color);
      font-family: var(--main-font-family);
      border: 1px solid var(--main-card-border);
      background-color: var(--main-card-second-background);
      transition:
        border-color 0.3s,
        box-shadow 0.3s;
      &:focus {
        border-color: var(--main-color);
        box-shadow: 0 8px 16px -4px var(--main-color-bg);
      }
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
  }
  .ais-Hits {
    margin-top: 20px;
    min-height: 300px;
    height: 100%;
    .no-result {
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .iconfont {
        font-size: 40px;
        margin-bottom: 12px;
      }
      .text {
        font-size: 18px;
        opacity: 0.6;
      }
    }
    .search-list {
      .search-item {
        margin-bottom: 12px;
        cursor: pointer;
        .title {
          display: inline;
          font-size: 16px;
          margin-bottom: 6px;
        }
        .anchor {
          margin-top: 6px;
          color: var(--main-font-second-color);
          font-size: 14px;
          &::before {
            content: "# ";
          }
        }
        .content {
          color: var(--main-font-second-color);
          margin-top: 0.8rem;
          font-size: 12px;
          padding: 8px;
          border-radius: 8px;
        }
        p {
          margin: 0;
          mark {
            background-color: transparent;
            color: var(--main-color);
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .ais-Pagination {
    margin-top: 20px;
    .ais-Pagination-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .ais-Pagination-item {
        margin: 0 4px;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        transition: background-color 0.3s;
        cursor: pointer;
        .ais-Pagination-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          &:hover {
            color: var(--main-font-color);
          }
        }
        &:hover {
          color: var(--main-font-color);
          background-color: var(--main-color);
          .ais-Pagination-link {
            color: var(--main-card-border);
          }
        }
        &.ais-Pagination-item--selected {
          font-weight: bold;
          background-color: var(--main-color);
          .ais-Pagination-link {
            color: var(--main-card-border);
          }
        }
      }
    }
  }
  .ais-Stats {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
    opacity: 0.8;
    font-size: 14px;
    .power {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 16px;
      opacity: 0.6;
      transition:
        color 0.3s,
        opacity 0.3s;
      .name {
        font-weight: bold;
      }
      &:hover {
        opacity: 1;
        color: var(--main-color);
      }
    }
    @media (max-width: 512px) {
      justify-content: center;
      .information {
        display: none;
      }
    }
  }
}
</style>
