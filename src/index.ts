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
        // Remove back-to-top button completely
        const removeBackToTop = () => {
          document.querySelectorAll('*').forEach(el => {
            if (el.textContent === '回到顶部' || el.getAttribute('aria-label') === '回到顶部' || el.getAttribute('title') === '回到顶部') {
              el.remove();
            }
          });
        };
        [500, 1000, 2000, 5000].forEach(t => setTimeout(removeBackToTop, t));
        new MutationObserver(removeBackToTop).observe(document.body, { childList: true, subtree: true, characterData: true });

        // Fix mobile dark mode toggle text
        const fixDarkText = () => {
          const isDark = document.documentElement.classList.contains('dark');
          const target = isDark ? '切换浅色模式' : '切换深色模式';
          // Find all text nodes containing the old label
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.textContent.includes('切换深色模式') || node.textContent.includes('切换浅色模式')) {
              node.textContent = target;
            }
          }
        };
        [300, 800, 1500].forEach(t => setTimeout(fixDarkText, t));
        new MutationObserver(fixDarkText).observe(document.body, { childList: true, subtree: true, characterData: true });

        // Fix dark mode toggle tooltip
        const fixTooltip = () => {
          const btn = document.querySelector('.VPNavBarAppearance button');
          if (btn) {
            const isDark = document.documentElement.classList.contains('dark');
            btn.setAttribute('title', isDark ? '切换浅色模式' : '切换深色模式');
          }
        };
        fixTooltip();
        new MutationObserver(fixTooltip).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        // Mount ReadingProgress to body
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





