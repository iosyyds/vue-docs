import { h } from "vue";
import { createPinia } from "pinia";
import { routeChange } from "@/utils/initTools.mjs";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import LazyLoader from "@/components/LazyLoader.vue";
import EssayCarousel from "@/components/EssayCarousel.vue";
import EssayList from "@/components/EssayList.vue";
import SoftwareList from "@/views/SoftwareList.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 根组件
import App from "@/App.vue";
// 全局样式
import "@/style/main.scss";

// pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// InstantSearch
import InstantSearch from "vue-instantsearch/vue3/es";

// Theme
const Theme = {
  // extends: Theme,
  Layout: () => {
    return h(App);
  },
  enhanceApp({ app, router, siteData }) {
    // 挂载
    app.use(pinia);
    app.use(InstantSearch);
    app.component("LazyLoader", LazyLoader);
    app.component("EssayCarousel", EssayCarousel);
    app.component("EssayList", EssayList);
    app.component("SoftwareList", SoftwareList);
    // 插件
    enhanceAppWithTabs(app);
    // 路由守卫
    router.onBeforeRouteChange = (to) => {
      routeChange("before", to);
    };
    router.onAfterRouteChanged = (to) => {
      routeChange("after", to);
    };
    // 预热 Algolia 连接，消除首次打开搜索弹窗的卡顿
    if (typeof window !== "undefined") {
      window.addEventListener("load", () => {
        const search = siteData.themeConfig?.search;
        if (search?.appId && search?.apiKey && search?.indexName) {
          fetch(
            `https://${search.appId}-dsn.algolia.net/1/indexes/${search.indexName}/query`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Algolia-Application-Id": search.appId,
                "X-Algolia-API-Key": search.apiKey,
              },
              body: JSON.stringify({ query: "", hitsPerPage: 1 }),
            }
          ).catch(() => {});
        }
      });
    }
  },
};

export default Theme;
