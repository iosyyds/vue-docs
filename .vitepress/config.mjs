import { defineConfig } from "vitepress";
import { createRssFile } from "./theme/utils/generateRSS.mjs";
import { createSearchIndex } from "./theme/utils/generateSearchIndex.mjs";
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
import { readFileSync } from "fs";

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
    // transformHead
    transformPageData: async (pageData, ctx) => {
      const site = themeConfig.siteMeta.site;
      const isPost = pageData.relativePath.startsWith("posts/");
      const isHome = pageData.relativePath === "index.md";

      // 1) 缺失 description 时从正文提取摘要（文章/页面独立描述，替代站点默认）
      if (!pageData.frontmatter.description && pageData.filePath) {
        try {
          const file = path.resolve(ctx.siteConfig.srcDir, pageData.filePath);
          const raw = readFileSync(file, "utf-8")
            .replace(/^---[\s\S]*?---/, "")
            .replace(/^\s*#\s+[^\n]+\n?/, "");
          const excerpt = raw
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/<script[\s\S]*?<\/script>/g, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
            .replace(/[#>*|`~\-\[\]()]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (excerpt) {
            const desc = excerpt.length > 110 ? excerpt.slice(0, 110) + "…" : excerpt;
            // pageData.description 直接决定 SSR 的 meta description
            pageData.description = desc;
            // 同步写回 frontmatter，供 RSS / 其他逻辑使用
            pageData.frontmatter.description = desc;
          }
        } catch (error) {
          // 读取失败时忽略，回退站点默认描述
        }
      }

      // 2) canonical + Open Graph / Twitter / keywords / JSON-LD
      const canonicalUrl = `${site}/${pageData.relativePath}`
        .replace(/index\.md$/, "")
        .replace(/\.md$/, "");
      const desc = pageData.description || themeConfig.siteMeta.description;
      const pageTitle = isHome ? themeConfig.siteMeta.title : pageData.title || themeConfig.siteMeta.title;
      const cover = pageData.frontmatter.cover || "/images/logo/favicon-512x512.png";
      const ogImage = cover.startsWith("http") ? cover : `${site}${cover}`;

      pageData.frontmatter.head ??= [];
      const head = pageData.frontmatter.head;
      head.push(["link", { rel: "canonical", href: canonicalUrl }]);
      head.push(["meta", { property: "og:site_name", content: themeConfig.siteMeta.title }]);
      head.push(["meta", { property: "og:locale", content: "zh_CN" }]);
      head.push(["meta", { property: "og:type", content: isPost ? "article" : "website" }]);
      head.push(["meta", { property: "og:title", content: pageTitle }]);
      head.push(["meta", { property: "og:description", content: desc }]);
      head.push(["meta", { property: "og:url", content: canonicalUrl }]);
      head.push(["meta", { property: "og:image", content: ogImage }]);
      head.push(["meta", { name: "twitter:card", content: "summary" }]);
      head.push(["meta", { name: "twitter:title", content: pageTitle }]);
      head.push(["meta", { name: "twitter:description", content: desc }]);
      head.push(["meta", { name: "twitter:image", content: ogImage }]);
      // 文章标签作为 keywords
      if (isPost && Array.isArray(pageData.frontmatter.tags) && pageData.frontmatter.tags.length) {
        head.push(["meta", { name: "keywords", content: pageData.frontmatter.tags.join(", ") }]);
      }
      // JSON-LD 结构化数据
      const jsonLd = isPost
        ? {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: pageTitle,
            description: desc,
            image: ogImage,
            datePublished: pageData.frontmatter.date || undefined,
            dateModified: pageData.frontmatter.date || undefined,
            author: {
              "@type": "Person",
              name: themeConfig.siteMeta.author.name,
              url: themeConfig.siteMeta.author.link,
            },
            publisher: {
              "@type": "Person",
              name: themeConfig.siteMeta.author.name,
            },
            mainEntityOfPage: canonicalUrl,
            url: canonicalUrl,
          }
        : {
            "@context": "https://schema.org",
            "@type": isHome ? "WebSite" : "WebPage",
            name: pageTitle,
            description: desc,
            url: canonicalUrl,
          };
      head.push(["script", { type: "application/ld+json" }, JSON.stringify(jsonLd)]);
    },
    // transformHtml
    transformHtml: (html) => {
      return jumpRedirect(html, themeConfig);
    },
    // buildEnd
    buildEnd: async (config) => {
      await createRssFile(config, themeConfig);
      await createSearchIndex(config, themeConfig);
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
            type: "image/png",
          },
          {
            src: "/images/logo/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/images/logo/favicon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "/images/logo/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },
  }),
);