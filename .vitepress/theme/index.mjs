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
    // 全局图片兜底：加载失败/挂起 → 换默认头像，避免一直转圈
    if (typeof window !== "undefined") {
      const DEFAULT_IMG =
        "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20100%20100%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%2342b883%27%2F%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%232f855a%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Ccircle%20cx%3D%2750%27%20cy%3D%2750%27%20r%3D%2750%27%20fill%3D%27url%28%23g%29%27%2F%3E%3Ctext%20x%3D%2750%27%20y%3D%2767%27%20font-size%3D%2742%27%20text-anchor%3D%27middle%27%20fill%3D%27%23fff%27%20font-family%3D%27Arial%2C%20sans-serif%27%3E%E5%8F%8B%3C%2Ftext%3E%3C%2Fsvg%3E";
      const bindImgGuard = (img) => {
        if (img.dataset.fbG) return;
        // 评论区头像有专门的网址favicon/首字母兜底，不重复处理
        if (img.closest(".tk-avatar")) return;
        img.dataset.fbG = "1";
        const fallback = () => {
          if (img.dataset.fbG === "done") return;
          img.dataset.fbG = "done";
          img.src = DEFAULT_IMG;
        };
        img.addEventListener("error", fallback);
        // 挂起检测：8 秒仍未加载成功 → 强制换默认图
        setTimeout(() => {
          if (!img.complete || img.naturalWidth === 0) fallback();
        }, 8000);
      };
      const scanImgs = () => {
        document.querySelectorAll("img").forEach(bindImgGuard);
      };
      window.addEventListener("load", () => setTimeout(scanImgs, 300));
      const mo = new MutationObserver(() => setTimeout(scanImgs, 200));
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }
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
