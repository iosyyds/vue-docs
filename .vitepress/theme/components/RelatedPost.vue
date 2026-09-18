<!-- 相关文章 -->
<template>
  <div v-if="relatedData" class="related-post">
    <div class="title">
      <span class="name">
        <i class="iconfont icon-star"></i>
        相关推荐
      </span>
      <span class="shuffle" @click="router.go(shufflePost(theme.postData))"> 随便逛逛 </span>
    </div>
    <!-- 文章列表 -->
    <PostList :listData="relatedData" simple />
  </div>
</template>

<script setup>
import { generateId } from "@/utils/commonTools";
import { shufflePost } from "@/utils/helper";

const router = useRouter();
const { theme, page, frontmatter } = useData();

// 文章信息
const relatedData = ref(null);

// 获取同一分类的文章
const getRelatedData = () => {
  // 分类名
  const catName = frontmatter.value.categories?.[0];
  // 指定分类数据
  const postData = theme.value.categoriesData?.[catName]?.articles;
  // 本篇索引
  const postId = generateId(page.value?.filePath);
  // 过滤掉当前文章
  const filteredPosts = postData.filter((post) => post.id !== postId);
  // 取出两篇文章
  relatedData.value = filteredPosts.slice(0, 2);
  if (relatedData.value.length === 0) {
    relatedData.value = null;
  }
};

watch(
  () => router.route?.path,
  () => {
    getRelatedData();
  },
);

onMounted(() => {
  getRelatedData();
});
</script>

<style lang="scss" scoped>
.related-post {
  margin-top: 1rem;
  // 相关推荐独立卡片矩形：与评论区矩形分开，手机端同样生效
  background-color: var(--main-card-background);
  border: 1px solid var(--main-card-border);
  border-radius: 14px;
  padding: 14px 18px 10px;
  box-shadow: 0 8px 20px -8px var(--main-border-shadow);
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0.2rem 0 1rem 0;
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
    .shuffle {
      opacity: 0.6;
      font-size: 14px;
      transition:
        color 0.3s,
        opacity 0.3s;
      cursor: pointer;
      &:hover {
        opacity: 1;
        color: var(--main-color);
      }
    }
  }
}
</style>
