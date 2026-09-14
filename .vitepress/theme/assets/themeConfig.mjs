// 主题配置
export const themeConfig = {
  // 站点信息
  siteMeta: {
    // 站点标题
    title: "小坤哥哥博客",
    // 站点描述
    description: "小坤哥哥的个人博客，记录技术分享与生活点滴",
    // 站点logo
    logo: "/logo.svg",
    // 站点地址（请替换为你自己的域名）
    site: "https://example.com",
    // 语言
    lang: "zh-CN",
    // 作者
    author: {
      name: "小坤哥哥",
      cover: "/images/logo/logo-1.png",
      email: "",
      link: "https://github.com/iosyyds/vue-docs",
    },
  },
  // 备案信息（留空则不显示）
  icp: "",
  ga: "",
  // 建站日期
  since: "2026-1-1",
  // 每页文章数据
  postSize: 8,
  // inject
  inject: {
    // 头部
    // https://vitepress.dev/zh/reference/site-config#head
    header: [
      // favicon
      ["link", { rel: "icon", href: "/favicon.ico" }],
      // RSS
      [
        "link",
        {
          rel: "alternate",
          type: "application/rss+xml",
          title: "RSS",
          href: "/rss.xml",
        },
      ],
      // 预载 CDN
      [
        "link",
        {
          crossorigin: "",
          rel: "preconnect",
          href: "https://s1.hdslb.com",
        },
      ],
      [
        "link",
        {
          crossorigin: "",
          rel: "preconnect",
          href: "https://mirrors.sustech.edu.cn",
        },
      ],
      // HarmonyOS font
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css",
        },
      ],
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/lxgw-wenkai-screen-webfont/1.7.0/style.css",
        },
      ],
      // iconfont
      [
        "link",
        {
          crossorigin: "anonymous",
          rel: "stylesheet",
          href: "https://cdn2.codesign.qq.com/icons/g5ZpEgx3z4VO6j2/latest/iconfont.css",
        },
      ],
      // Embed code
      ["link", { rel: "preconnect", href: "https://use.sevencdn.com" }],
      ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
      [
        "link",
        {
          crossorigin: "anonymous",
          href: "https://use.sevencdn.com/css2?family=Fira+Code:wght@300..700&display=swap",
          rel: "stylesheet",
        },
      ],
    ],
  },
  // 导航栏菜单
  nav: [
    {
      text: "文库",
      items: [
        { text: "文章列表", link: "/pages/archives", icon: "article" },
        { text: "全部分类", link: "/pages/categories", icon: "folder" },
        { text: "全部标签", link: "/pages/tags", icon: "hashtag" },
      ],
    },
    {
      text: "导航",
      items: [
        { text: "甜甜导航", link: "/pages/nav", icon: "link" },
        { text: "友情链接", link: "/pages/link", icon: "account" },
      ],
    },
    {
      text: "我的",
      items: [
        { text: "关于本站", link: "/pages/about", icon: "account" },
        { text: "隐私政策", link: "/pages/privacy", icon: "privacy" },
        { text: "甜甜发卡", link: "https://qqqi.top/", icon: "link" },
      ],
    },
  ],
  // 导航栏菜单 - 左侧
  navMore: [
    {
      name: "博客",
      list: [
        {
          icon: "/logo.svg",
          name: "主站",
          url: "/",
        },
        {
          icon: "/logo.svg",
          name: "网事集",
          url: "https://puaaa.cn",
        },
      ],
    },
    {
      name: "服务",
      list: [
        {
          icon: "/logo.svg",
          name: "甜甜导航",
          url: "https://iosdh.cn",
        },
        {
          icon: "/logo.svg",
          name: "甜甜发卡",
          url: "https://qqqi.top",
        },
        {
          icon: "/logo.svg",
          name: "我的药盒",
          url: "https://yao.hugv.me",
        },
        {
          icon: "/logo.svg",
          name: "甜甜游戏",
          url: "https://love.ttla.top",
        },
      ],
    },
    {
      name: "项目",
      list: [
        {
          icon: "/logo.svg",
          name: "GitHub",
          url: "https://github.com/iosyyds/vue-docs",
        },
      ],
    },
  ],
  // 封面配置
  cover: {
    // 是否开启双栏布局
    twoColumns: false,
    // 是否开启封面显示
    showCover: {
      // 是否开启封面显示 文章不设置cover封面会显示异常，可以设置下方默认封面
      enable: true,
      // 封面布局方式: left | right | both
      coverLayout: "both",
      // 默认封面(随机展示)
      defaultCover: [
        "/images/covers/cover_free-api.jpg",
        "/images/covers/cover_free-cdn.jpg",
        "/images/covers/cover_free-collab.jpg",
        "/images/covers/cover_free-database.jpg",
        "/images/covers/cover_free-email.jpg",
        "/images/covers/cover_free-monitor.jpg",
        "/images/covers/cover_free-online-ide.jpg",
        "/images/covers/cover_free-short-url.jpg",
        "/images/covers/cover_github-actions.jpg",
        "/images/covers/cover_ssl-cert.jpg",
      ],
    },
  },
  // 页脚信息
  footer: {
    // 社交链接（请确保为偶数个）
    social: [
      {
        icon: "github",
        link: "https://github.com/iosyyds/vue-docs",
      },
      {
        icon: "email",
        link: "",
      },
    ],
    // sitemap
    sitemap: [
      {
        text: "博客",
        items: [
          { text: "近期文章", link: "/" },
          { text: "全部分类", link: "/pages/categories" },
          { text: "全部标签", link: "/pages/tags" },
          { text: "文章归档", link: "/pages/archives", newTab: true },
        ],
      },
      {
        text: "导航",
        items: [
          { text: "甜甜导航", link: "/pages/nav" },
          { text: "友情链接", link: "/pages/link" },
          { text: "甜甜发卡", link: "https://qqqi.top", newTab: true },
        ],
      },
      {
        text: "页面",
        items: [
          { text: "关于本站", link: "/pages/about" },
          { text: "隐私政策", link: "/pages/privacy" },
        ],
      },
      {
        text: "专栏",
        items: [
          { text: "Vue 指南", link: "/pages/guide/what-is-vue" },
          { text: "快速上手", link: "/pages/guide/getting-started" },
        ],
      },
    ],
  },
  // 评论
  comment: {
    enable: false,
    // 评论系统选择
    // artalk / twikoo
    type: "artalk",
    // artalk
    // https://artalk.js.org/
    artalk: {
      site: "",
      server: "",
    },
    // twikoo
    // https://twikoo.js.org/
    twikoo: {
      // 必填，若不想使用 CDN，可以使用 pnpm add twikoo 安装并引入
      js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/twikoo/1.6.39/twikoo.all.min.js",
      envId: "",
      // 环境地域，默认为 ap-shanghai，腾讯云环境填 ap-shanghai 或 ap-guangzhou；Vercel 环境不填
      region: "ap-shanghai",
      lang: "zh-CN",
    },
  },
  // 侧边栏
  aside: {
    // 站点简介
    hello: {
      enable: true,
      text: "这里有关于<strong>开发</strong>相关的问题和看法，也会有一些<strong>奇技淫巧</strong>的分享，其中大部分内容会侧重于<strong>前端开发</strong>。希望你可以在这里找到对你有用的知识和教程。",
    },
    // 目录
    toc: {
      enable: true,
    },
    // 标签
    tags: {
      enable: true,
    },
    // 倒计时
    countDown: {
      enable: true,
      // 倒计时日期
      data: {
        name: "春节",
        date: "2027-02-06",
        // 春节为农历节日，不能按公历日期简单加一年
        dates: [
          "2027-02-06",
          "2028-01-26",
          "2029-02-13",
          "2030-02-03",
          "2031-01-23",
          "2032-02-11",
          "2033-01-31",
          "2034-02-19",
          "2035-02-08",
          "2036-01-28",
        ],
      },
    },
    // 站点数据
    siteData: {
      enable: true,
    },
  },
  // 友链
  friends: {
    // 友链朋友圈
    circleOfFriends: "",
    // 动态友链
    dynamicLink: {
      server: "",
      app_token: "",
      table_id: "",
    },
  },
  // 音乐播放器
  // https://github.com/imsyy/Meting-API
  music: {
    enable: false,
    // url
    url: "https://api-meting.example.com",
    // id
    id: 9379831714,
    // netease / tencent / kugou
    server: "netease",
    // playlist / album / song
    type: "playlist",
  },
  // 搜索
  // https://www.algolia.com/
  search: {
    enable: false,
    appId: "",
    apiKey: "",
  },
  // 打赏
  rewardData: {
    enable: false,
    // 微信二维码
    wechat: "/images/logo/wechat.png",
    // 支付宝二维码
    alipay: "/images/logo/alipay.jpg",
  },
  // 图片灯箱
  fancybox: {
    enable: true,
    js: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js",
    css: "https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css",
  },
  // 外链中转
  jumpRedirect: {
    enable: true,
    // 排除类名
    exclude: [
      "cf-friends-link",
      "upyun",
      "icp",
      "galink",
      "author",
      "rss",
      "cc",
      "power",
      "social-link",
      "link-text",
      "travellings",
      "post-link",
      "report",
      "more-link",
      "skills-item",
      "right-menu-link",
      "link-card",
    ],
  },
  // 站点统计
  tongji: {
    "51la": "",
  },
};
