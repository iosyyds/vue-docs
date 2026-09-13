import { h } from 'vue';
import Theme from 'vitepress/theme';
import HomeView from './views/HomeView.vue';
import PageView from './views/PageView.vue';
import Archives from './views/ArchivesView.vue';
import CategoryClassic from './views/CategoryClassicView.vue';
import Category from './views/CategoryView.vue';
import PostMeta from './components/PostMeta.vue';
import ReadingProgress from './components/ReadingProgress.vue';
import { bindFancybox, destroyFancybox } from './utils/fancybox';
import { BProgress } from '@bprogress/core';
import '@bprogress/core/css';
import './styles/index.less';

export default {
  extends: Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'nav-bar-content-after': () => h(ReadingProgress),
    });
  },
  enhanceApp({ app, router, siteData }: any) {
    app.component('HomeView', HomeView);
    app.component('Archives', Archives);
    app.component('CategoryClassic', CategoryClassic);
    app.component('Category', Category);
    app.component('PageView', PageView);
    app.component('PostMeta', PostMeta);
    app.component('ReadingProgress', ReadingProgress);
    if (typeof window !== 'undefined') {
      BProgress.configure({ showSpinner: false });
      let lastPath = '';
      router.onBeforeRouteChange = (to: string) => {
        if (to && to.split(/[\?#]/)[0] !== lastPath) {
          BProgress.start();
          destroyFancybox();
        }
      };
      router.onAfterRouteChange = (to: string) => {
        const toPath = to ? to.split(/[\?#]/)[0] : '';
        if (toPath !== lastPath) {
          lastPath = toPath;
          BProgress.done();
          bindFancybox();
        }
      };
    }
  },
  setup() {
    if (typeof window !== 'undefined') {
      onMounted(() => bindFancybox());
      onUnmounted(() => destroyFancybox());
    }
  }
};
