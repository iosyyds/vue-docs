import { onMounted, onUnmounted, createApp, h } from 'vue';
import { inBrowser } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
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

let progressApp: any = null;

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }: any) {
    app.component('HomeView', HomeView);
    app.component('Archives', Archives);
    app.component('CategoryClassic', CategoryClassic);
    app.component('Category', Category);
    app.component('PageView', PageView);
    app.component('PostMeta', PostMeta);
    app.component('ReadingProgress', ReadingProgress);
    if (inBrowser) {
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
    if (inBrowser) {
      onMounted(() => {
        bindFancybox();
        const fixTooltip = () => {
          const isDark = document.documentElement.classList.contains('dark');
          const btn = document.querySelector('.VPNavBarAppearance button');
          if (btn) {
            btn.setAttribute('title', isDark ? '切换浅色模式' : '切换深色模式');
          }
          document.querySelectorAll('.VPSidebar *').forEach(el => {
            if (el.children.length === 0 && el.textContent.includes('深色模式')) {
              el.textContent = isDark ? '切换浅色模式' : '切换深色模式';
            }
          });
        };
        fixTooltip();
        new MutationObserver(fixTooltip).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        const el = document.createElement('div');
        el.id = 'reading-progress-app';
        document.body.appendChild(el);
        progressApp = createApp({ render: () => h(ReadingProgress) });
        progressApp.mount(el);
      });
      onUnmounted(() => {
        destroyFancybox();
        if (progressApp) {
          progressApp.unmount();
          progressApp = null;
        }
      });
    }
  }
};


