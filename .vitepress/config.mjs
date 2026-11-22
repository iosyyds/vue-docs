import { defineConfig } from "vitepress";
import { createRssFile } from "./theme/utils/generateRSS.mjs";
import { withPwa } from "@vite-pwa/vitepress";
import {
  getAllPosts,
  getAllType,
  getAllCategories,
  getAllArchives,
} from "./theme/utils/getPostData.mjs";
import { jumpRedirect } from "./theme/utils/commonTools.mjs";
import { getThemeConfig } from "./init.mjs";
import markdownConfig from "./theme/utils/markdownConfig.mjs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from "path";

// 获取全局数据
const postData = await getAllPosts();

// 获取主题配置
const themeConfig = await getThemeConfig();

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    title: themeConfig.siteMeta.title,
    description: themeConfig.siteMeta.description,
    lang: themeConfig.siteMeta.lang,
    // 简洁的 URL
    cleanUrls: true,
    // 最后更新时间戳
    lastUpdated: true,
    // // 修改为你想要的路径（如 `../dist` 或 `../public`）
    // outDir: ".vitepress/dist",
    // 主题
    appearance: "dark",
    // Head
    head: themeConfig.inject.header,
    // sitemap
    sitemap: {
      hostname: themeConfig.siteMeta.site,
      transformItems(items) {
        // 文章用 frontmatter 发布日期作 lastmod；过滤掉分页 URL
        const norm = (u) =>
          "/" + String(u || "").replace(/^\/+/, "").replace(/\.html$/, "");
        const dateMap = new Map();
        for (const p of postData) {
          const key = norm(p.regularPath);
          if (key !== "/") dateMap.set(key, p.date);
        }
        return items
          .filter((item) => !/^(?:\/)page(?:\/\d+)?$/.test(norm(item.url)))
          .map((item) => {
            const d = dateMap.get(norm(item.url));
            return d ? { ...item, lastmod: new Date(d).toISOString() } : item;
          });
      },
    },
    // 主题配置
    themeConfig: {
      ...themeConfig,
      // 必要数据
      postData: postData,
      tagsData: getAllType(postData),
      categoriesData: getAllCategories(postData),
      archivesData: getAllArchives(postData),
    },
    // markdown
    markdown: {
      math: true,
      lineNumbers: true,
      toc: { level: [1, 2, 3] },
      image: {
        lazyLoading: true,
      },
      config: (md) => markdownConfig(md, themeConfig),
    },
    // 构建排除
    srcExclude: ["**/README.md", "**/TODO.md"],
    // transformPageData：页面级 TDK、OG、结构化数据
    transformPageData: async (pageData) => {
      const site = themeConfig.siteMeta.site.replace(/\/$/, "");
      const siteName = themeConfig.siteMeta.title;
      const siteDesc = themeConfig.siteMeta.description;
      const rawPath = pageData.relativePath || "index.md";
      const fm = pageData.frontmatter || {};
      const isPost = rawPath.startsWith("posts/");
      const canonicalUrl = `${site}/${rawPath}`
        .replace(/index\.md$/, "")
        .replace(/\.md$/, "");

      pageData.frontmatter.head ??= [];

      // 描述：frontmatter.description → articleGPT → 站点默认，控制在 150 字以内
      let desc = "";
      if (isPost) {
        desc = String(fm.description || fm.articleGPT || "")
          .replace(/[\r\n]+/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim();
        if (desc.length > 150) {
          desc = desc.slice(0, 150).replace(/[，。；、,.;：]$/, "") + "…";
        }
        if (!desc) desc = `${pageData.title} - ${siteName}`;
      } else {
        desc = String(fm.description || siteDesc);
      }
      pageData.description = desc;

      // 关键词：标签 + 分类
      const tags = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [fm.tags] : [];
      const cats = Array.isArray(fm.categories)
        ? fm.categories
        : fm.categories
          ? [fm.categories]
          : [];
      const keywords = [...new Set([...tags, ...cats, siteName])].filter(Boolean).join(",");

      if (isPost) {
        pageData.frontmatter.head.push(["meta", { name: "keywords", content: keywords }]);
        pageData.frontmatter.head.push([
          "meta",
          { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
        ]);
      }

      // 分享图：文章封面优先
      const cover = fm.cover
        ? fm.cover.startsWith("http")
          ? fm.cover
          : `${site}${fm.cover}`
        : `${site}/images/og-default.jpg`;

      pageData.frontmatter.head.push(["link", { rel: "canonical", href: canonicalUrl }]);

      pageData.frontmatter.head.push(
        ["meta", { property: "og:type", content: isPost ? "article" : "website" }],
        ["meta", { property: "og:site_name", content: siteName }],
        ["meta", { property: "og:title", content: pageData.title }],
        ["meta", { property: "og:description", content: desc }],
        ["meta", { property: "og:url", content: canonicalUrl }],
        ["meta", { property: "og:image", content: cover }],
        ["meta", { property: "og:locale", content: "zh_CN" }],
        ["meta", { name: "twitter:card", content: "summary_large_image" }],
        ["meta", { name: "twitter:title", content: pageData.title }],
        ["meta", { name: "twitter:description", content: desc }],
        ["meta", { name: "twitter:image", content: cover }],
      );

      if (isPost && fm.date) {
        const iso = new Date(fm.date).toISOString();
        pageData.frontmatter.head.push(
          ["meta", { property: "article:published_time", content: iso }],
          ["meta", { property: "article:modified_time", content: iso }],
        );
        tags.slice(0, 6).forEach((t) => {
          pageData.frontmatter.head.push(["meta", { property: "article:tag", content: t }]);
        });
      }

      // 结构化数据：文章用 BlogPosting，首页用 WebSite
      if (isPost) {
        const ld = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: pageData.title,
          description: desc,
          image: [cover],
          url: canonicalUrl,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          author: {
            "@type": "Person",
            name: themeConfig.siteMeta.author?.name || siteName,
            url: themeConfig.siteMeta.author?.link || site,
          },
          publisher: {
            "@type": "Organization",
            name: siteName,
            logo: { "@type": "ImageObject", url: `${site}/logo.svg` },
          },
          keywords,
          articleSection: cats.join(","),
          inLanguage: "zh-CN",
        };
        if (fm.date) {
          ld.datePublished = new Date(fm.date).toISOString();
          ld.dateModified = new Date(fm.date).toISOString();
        }
        pageData.frontmatter.head.push([
          "script",
          { type: "application/ld+json" },
          JSON.stringify(ld),
        ]);
      } else if (rawPath === "index.md") {
        const ld = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: site,
          description: siteDesc,
          inLanguage: "zh-CN",
          author: {
            "@type": "Person",
            name: themeConfig.siteMeta.author?.name || siteName,
            url: themeConfig.siteMeta.author?.link || site,
          },
        };
        pageData.frontmatter.head.push([
          "script",
          { type: "application/ld+json" },
          JSON.stringify(ld),
        ]);
      }
    },
    // transformHtml
    transformHtml: (html) => {
      return jumpRedirect(html, themeConfig);
    },
    // buildEnd
    buildEnd: async (config) => {
      await createRssFile(config, themeConfig);
    },
    // vite
    vite: {
      plugins: [
        AutoImport({
          imports: ["vue", "vitepress"],
          dts: ".vitepress/auto-imports.d.ts",
        }),
        Components({
          dirs: [".vitepress/theme/components", ".vitepress/theme/views"],
          extensions: ["vue", "md"],
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
          dts: ".vitepress/components.d.ts",
        }),
      ],
      resolve: {
        // 配置路径别名
        alias: {
          // eslint-disable-next-line no-undef
          "@": path.resolve(__dirname, "./theme"),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ["legacy-js-api"],
          },
        },
      },
      // 服务器
      server: {
        port: 8088,
      },
      // 构建
      build: {
        target: 'es2020',
        minify: "terser",
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"],
          },
        },
      },
      optimizedeps: {
        esbuildoptions: {
          target: 'es2020'
        }
      },
    },
    // PWA
    pwa: {
      registerType: "autoUpdate",
      selfDestroying: true,
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        // 资源缓存
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(woff2|woff|ttf|css)/,
            handler: "CacheFirst",
            options: {
              cacheName: "file-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(ico|webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
            },
          },
          {
            urlPattern: /^https:\/\/cdn2\.codesign\.qq\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "iconfont-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 2,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        // 缓存文件
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg,woff2,ttf}"],
        // 排除路径
        navigateFallbackDenylist: [/^\/sitemap.xml$/, /^\/rss.xml$/, /^\/robots.txt$/],
      },
      manifest: {
        name: themeConfig.siteMeta.title,
        short_name: themeConfig.siteMeta.title,
        description: themeConfig.siteMeta.description,
        display: "standalone",
        start_url: "/",
        theme_color: "#fff",
        background_color: "#efefef",
        icons: [
          {
            src: "/images/logo/favicon-32x32.png",
            sizes: "32x32",
            type: "image/webp",
          },
          {
            src: "/images/logo/favicon-96x96.png",
            sizes: "96x96",
            type: "image/webp",
          },
          {
            src: "/images/logo/favicon-256x256.png",
            sizes: "256x256",
            type: "image/webp",
          },
          {
            src: "/images/logo/favicon-512x512.png",
            sizes: "512x512",
            type: "image/webp",
          },
        ],
      },
    },
  }),
);