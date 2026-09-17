import { loadScript, loadCSS } from "./commonTools.mjs";

const initComments = async (themeConfig) => {
  try {
    // 必要数据
    const option = themeConfig.comment;
    const commentType = option.type;
    if (!option.enable) return false;
    const server = option[commentType].server;
    console.log("开始加载", commentType, server);
    switch (commentType) {
      case "artalk":
        // 引入资源
        await loadCSS(`${server}/dist/Artalk.css`);
        return await new Promise((resolve, reject) => {
          loadScript(`${server}/dist/Artalk.js`, {
            callback: () => {
              if (typeof Artalk === "object") {
                resolve(Artalk);
              } else {
                reject(new Error("Artalk 初始化失败"));
              }
            },
          });
        });
      case "twikoo":
        // 多 CDN 源依次尝试，避免单一源失效导致评论区空白
        {
          const cdnList = [
            option[commentType].js || "",
            "https://cdn.staticfile.org/twikoo/1.6.39/twikoo.all.min.js",
            "https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js",
            "https://unpkg.com/twikoo@1.6.39/dist/twikoo.all.min.js",
            "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/twikoo/1.6.39/twikoo.all.min.js",
          ].filter(Boolean);
          let lastErr = null;
          for (const src of cdnList) {
            try {
              await new Promise((resolve, reject) => {
                loadScript(src, {
                  callback: () => {
                    if (typeof window.twikoo === "object") {
                      resolve(window.twikoo);
                    } else {
                      reject(new Error("Twikoo 加载失败"));
                    }
                  },
                });
              });
              return window.twikoo;
            } catch (err) {
              lastErr = err;
              console.warn(`[twikoo] CDN 加载失败，切换备用源: ${src}`, err);
            }
          }
          throw new Error(`Twikoo CDN 全部加载失败: ${lastErr}`);
        }
      case "valine":
        // 引入资源
        return await new Promise((resolve, reject) => {
          loadScript(
            option[commentType].js ||
              "https://cdn.staticfile.org/valine/1.5.1/Valine.min.js",
            {
              callback: () => {
                if (typeof Valine === "object") {
                  resolve(Valine);
                } else {
                  reject(new Error("Valine 初始化失败"));
                }
              },
            },
          );
        });
      default:
        return false;
    }
  } catch (error) {
    // 修复：commentType 是 try 块内 const，catch 无法访问，打印通用错误信息
    console.error("评论组件初始化失败:", error && error.stack);
    throw error;
  }
};

export default initComments;
