<template>
  <div class="about">
    <h1 class="title">关于本站</h1>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 介绍 -->
      <div class="about-item hello">
        <span class="text1">你好，很高兴认识你👋</span>
        <span class="text2 title2">我是小坤哥哥</span>
        <span class="text3">是一名热爱折腾的开发者，前端为主，渴望全栈</span>
      </div>
      <!-- 追求 -->
      <div class="about-item pursuit">
        <span class="tip">追求</span>
        <span class="title2">源于</span>
        <span class="title2">热爱而去开发</span>
        <span class="title2">优秀的作品</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      <!-- 技能 -->
      <div class="about-item skills">
        <span class="tip">技能</span>
        <span class="title2">提升创造力</span>
        <div class="skills-list">
          <a
            v-for="(item, index) in skillsData"
            :key="index"
            :style="{ '--color': item.color }"
            :href="item.link"
            class="skills-item"
            target="_blank"
          >
            <div class="skills-logo">
              <i :class="`iconfont icon-${item.icon}`"></i>
            </div>
            <span class="skills-name">{{ item.name }}</span>
          </a>
        </div>
      </div>
      <!-- 生涯 -->
      <div class="about-item career">
        <span class="tip">生涯</span>
        <span class="title2">
          <i>無限進步</i> 
        </span>
        <div class="list">
          <span class="list-item" style="--color: #357ef5">一直在折腾 · 博客与开发</span>
          
        </div>
<!--        <img-->
<!--          class="career-img"-->
<!--          src="https://pic.efefee.cn/uploads/2024/02/22/65d71db18bcf9.png"-->
<!--          alt="career"-->
<!--        />-->
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 性格 -->
      <div class="about-item character" style="--color: #4298b4">
        <span class="tip">性格</span>
        <span class="title2">乐观积极</span>
        <span class="title2" style="color: var(--color)">乐于分享</span>
        <span class="more">
          相信分享与交流能带来
          <a href="https://github.com/iosyyds/vue-docs" target="_blank">更多的可能性</a>
        </span>
      </div>
      <!-- 座右铭 -->
      <div class="about-item">
        <span class="tip">座右铭</span>
        <span class="title1" style="margin-top: 20px">热爱生活，</span>
        <span class="title2">保持好奇。</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
      <div
        class="about-item like image"
        style="
          --color: #0c0e20;
          background-image: url(/images/covers/cover_free-monitor.jpg);
        "
      >
        <div class="image-content">
          <span class="tip">关注偏好</span>
          <span class="title2">数码科技</span>
          <div class="image-desc">
            <span class="left">手机、电脑及软硬件</span>
          </div>
        </div>
      </div>
      <div
        class="about-item like image"
        style="
          --color: #7b3c25;
          background-image: url(/images/covers/cover_free-cdn.jpg);
        "
      >
        <div class="image-content">
          <span class="tip">音乐偏好</span>
          <span class="title2">欧美、华语流行、纯音乐、ACG</span>
          <div class="image-desc">
            <span class="left">一起欣赏更多音乐</span>
          </div>
        </div>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      <!-- 数据 -->
      <div
        class="about-item static image"
        style="
          --color: #0d1322;
          background: linear-gradient(135deg, #101a2e 0%, #1b2f4e 55%, #22395f 100%);
        "
      >
        <div class="image-content">
          <span class="tip">数据</span>
          <span class="title2">访问统计</span>
          <div v-if="statisticsData" class="static-data">
            <div v-for="(item, key, index) in statisticsData" :key="index" class="static-item">
              <span class="static-name">{{ key }}</span>
              <span class="static-num">{{ item }}</span>
            </div>
          </div>
          <div v-else-if="statisticsError" class="static-empty">
            <i class="iconfont icon-chart" />
            <span>统计数据暂不可用</span>
          </div>
          <div v-else class="static-empty">
            <i class="iconfont icon-chart" />
            <span>数据加载中…</span>
          </div>
          <div class="image-desc opacity">
            <span class="left">
              统计信息来自 <a href="https://v6.51.la/" target="_blank">51la</a>
            </span>
          </div>
        </div>
      </div>
      <!-- 信息 -->
      <div class="about-item child">
        <div class="about-item map">
          <!-- 秦皇岛定位地图（SVG 自绘，无需第三方地图 key） -->
          <svg class="map-svg" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="map-sea" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#bfdcf2" />
                <stop offset="1" stop-color="#93c2e6" />
              </linearGradient>
            </defs>
            <!-- 陆地 -->
            <rect width="400" height="220" fill="#f2ecdf" />
            <!-- 渤海 -->
            <path
              d="M400,0 L268,14 C294,58 298,100 272,138 C250,170 214,193 168,203 L400,220 Z"
              fill="url(#map-sea)"
            />
            <!-- 海岸线 -->
            <path
              d="M268,14 C294,58 298,100 272,138 C250,170 214,193 168,203"
              fill="none"
              stroke="#7ba7c9"
              stroke-width="2"
            />
            <!-- 经纬网格 -->
            <g class="map-grid">
              <line x1="100" y1="0" x2="100" y2="220" />
              <line x1="200" y1="0" x2="200" y2="220" />
              <line x1="300" y1="0" x2="300" y2="220" />
              <line x1="0" y1="55" x2="400" y2="55" />
              <line x1="0" y1="110" x2="400" y2="110" />
              <line x1="0" y1="165" x2="400" y2="165" />
            </g>
            <!-- 省名 -->
            <text class="map-province" x="52" y="72">河北省</text>
            <!-- 定位点：秦皇岛 -->
            <g>
              <circle class="pin-pulse" cx="240" cy="112" r="7" />
              <circle class="pin-dot" cx="240" cy="112" r="4" />
              <text class="pin-label" x="254" y="107">秦皇岛</text>
              <text class="pin-coord" x="254" y="122">39.93°N · 119.60°E</text>
            </g>
          </svg>
          <div class="position">
            <span class="position-city">河北省 · 秦皇岛市</span>
            <span class="position-coord">📍 我在这里</span>
          </div>
        </div>
        <div class="about-item info">
          <div class="info-item">
            <span class="info-name">建站</span>
            <span class="info-num" style="--color: #43a6c6">2026</span>
          </div>
          <div class="info-item">
            <span class="info-name">热爱方向</span>
            <span class="info-num" style="--color: #dfac46">前端与全栈</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 心路历程 -->
    <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">心路历程</span>
        <span class="title2">为什么建站？</span>
        <p class="text">
          建这个站的时候，是为了能够有一个自己能够<strong>积累知识</strong>和<strong>兴趣</strong>的地方。和他人分享知识和经验，如果能够帮助到更多的人，帮助更多人解决问题，那一定是非常棒的事情。
        </p>
        <p class="text">
          这里大多都是<strong>技术向</strong>的文章，也是对自己的成长的记录，如果在下的某篇文章能够帮助到你，那我也是很开心的。
        </p>
        <p class="text">
          这些就是创造这个小站的本意，<strong>也是用于分享生活</strong>。有幸能和你相遇在这里，相信我们能共同留下一段美好记忆。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStatistics } from "@/api";

const { theme } = useData();

// 技能数据
const skillsData = [
  {
    name: "JavaScript",
    color: "#f1e05abd",
    icon: "javascript",
    link: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript",
  },
  {
    name: "HTML5",
    color: "#e34f26",
    icon: "html5",
    link: "https://developer.mozilla.org/zh-CN/docs/Web/HTML",
  },
  {
    name: "Vue",
    color: "#41b883",
    icon: "vue",
    link: "https://cn.vuejs.org/",
  },
  {
    name: "Node.js",
    color: "#026E00",
    icon: "nodejs",
    link: "https://nodejs.org/",
  },
  {
    name: "Python",
    color: "#3776AB",
    icon: "python",
    link: "https://www.python.org/",
  },
  {
    name: "Docker",
    color: "#2496f2",
    icon: "docker",
    link: "https://www.docker.com/",
  },
  {
    name: "Git",
    color: "#F05032",
    icon: "git",
    link: "https://git-scm.com/",
  },
  {
    name: "Photoshop",
    color: "#31A8FF",
    icon: "photoshop",
    link: "https://www.adobe.com/cn/lead/creativecloud/business.html",
  },
  {
    name: "ChatGPT",
    color: "#4AA181",
    icon: "chatgpt",
    link: "https://chat.openai.com/",
  },
];

// 站点统计数据
const statisticsData = ref(null);
const statisticsError = ref(false);

// 获取站点统计数据
const getStatisticsData = async () => {
  try {
    const result = await getStatistics(theme.value.tongji["51la"]);
    statisticsData.value = result;
    if (!result) statisticsError.value = true;
  } catch (error) {
    statisticsError.value = true;
  }
};

onMounted(() => {
  getStatisticsData();
});
</script>

<style lang="scss" scoped>
.about {
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
  }
  .about-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    margin-bottom: 20px;
    .about-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 12px;
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      box-shadow: 0 8px 12px -4px var(--main-border-shadow);
      overflow: hidden;
      .tip {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 12px;
      }
      .title1 {
        font-size: 36px;
        font-weight: bold;
        opacity: 0.6;
      }
      .title2 {
        font-size: 36px;
        font-weight: bold;
        margin-right: 4rem;
      }
      .text {
        font-size: 18px;
        margin: 0.6rem 0;
      }
      &.child {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        gap: 20px;
        .about-item {
          height: 100%;
        }
      }
      &.hello {
        justify-content: center;
        padding: 2rem;
        color: #fff;
        background-image: linear-gradient(120deg, #5b27ff 0%, #00d4ff 100%);
        background-size: 200% 200%;
        animation: gradientFlow 6s ease infinite;
        .title2 {
          line-height: 2;
        }
      }
      &.pursuit {
        .title2 {
          line-height: 1.2;
          &:last-child {
            display: inline-block;
            background-size: 100% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-repeat: no-repeat;
            background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
          }
        }
      }
      &.character {
        min-height: 220px;
        cursor: pointer;
        .more {
          margin-top: auto;
          font-size: 14px;
          color: var(--main-color-gray);
          a {
            color: var(--main-color-gray);
            &:hover {
              color: var(--color);
            }
          }
        }
        .male {
          position: absolute;
          top: 20px;
          right: -10px;
          height: 140%;
          width: auto;
          transition: transform 0.5s;
          transform-origin: top center;
          @media (max-width: 768px) {
            height: 80%;
          }
        }
        &:hover {
          .male {
            transform: scale(1.2);
          }
        }
      }
      &.skills {
        .skills-list {
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .skills-item {
            display: flex;
            align-items: center;
            margin-right: 10px;
            margin-top: 10px;
            padding: 8px 12px 8px 8px;
            border-radius: 40px;
            background-color: var(--main-site-background);
            border: 1px solid var(--main-card-border);
            box-shadow: 0 8px 12px -4px var(--main-border-shadow);
            transition: background-color 0.3s;
            cursor: pointer;
            .skills-logo {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              margin-right: 8px;
              border-radius: 50%;
              background-color: var(--color);
              .iconfont {
                color: #fff;
              }
            }
            .skills-name {
              font-weight: bold;
              transition: color 0.3s;
            }
            &:hover {
              background-color: var(--main-card-background);
            }
          }
        }
      }
      &.career {
        .title2 {
          letter-spacing: 0.2rem;
          font-size: 40px;
        }
        .list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          .list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 12px;
            color: var(--main-font-second-color);
            &::before {
              content: "";
              display: block;
              width: 16px;
              height: 16px;
              background-color: var(--color);
              border-radius: 50%;
              margin-right: 8px;
            }
          }
        }
        .career-img {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          @media (max-width: 768px) {
            position: static;
          }
        }
      }
      &.game {
        min-height: 300px;
        @media (max-width: 768px) {
          min-height: 240px;
        }
      }
      &.like {
        min-height: 400px;
        @media (max-width: 768px) {
          min-height: 300px;
        }
      }
      &.image {
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        .image-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
          color: #fff;
          .image-desc {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            &.opacity {
              font-size: 14px;
              color: #eee;
              opacity: 0.8;
              a {
                color: #eee;
                &:hover {
                  color: var(--main-color);
                }
              }
            }
          }
        }
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          box-shadow: inset 0 -70px 204px 10px var(--color);
          z-index: 0;
        }
      }
      &.static {
        .static-data {
          display: grid;
          gap: 10px 16px;
          grid-template-columns: 1fr 1fr;
          margin: 18px 0;
          .static-item {
            display: flex;
            flex-direction: column;
            .static-name {
              font-size: 13px;
              opacity: 0.65;
              letter-spacing: 1px;
            }
            .static-num {
              font-size: 27px;
              font-weight: bold;
              line-height: 1.5;
              background: linear-gradient(90deg, #6fd3ff 0%, #9be89b 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
            }
          }
        }
        .static-empty {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 26px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          .iconfont {
            font-size: 20px;
            animation: static-spin 1.6s linear infinite;
          }
        }
      }
      &.map {
        min-height: 170px;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s;
        @media (max-width: 768px) {
          pointer-events: none;
        }
        .map-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
        .map-grid {
          stroke: rgba(255, 255, 255, 0.55);
          stroke-width: 1;
          stroke-dasharray: 3 5;
        }
        .map-province {
          font-size: 17px;
          font-weight: bold;
          letter-spacing: 3px;
          fill: rgba(74, 85, 104, 0.55);
        }
        .pin-pulse {
          fill: #e5484d;
          opacity: 0.5;
          transform-origin: center;
          transform-box: fill-box;
          animation: pin-pulse 2s ease-out infinite;
        }
        .pin-dot {
          fill: #e5484d;
          stroke: #fff;
          stroke-width: 1.5;
        }
        .pin-label {
          font-size: 13px;
          font-weight: bold;
          fill: #2d3a4d;
        }
        .pin-coord {
          font-size: 9px;
          fill: #6b7a8a;
        }
        .position {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          padding: 12px 20px;
          color: #fff;
          background: linear-gradient(90deg, #1f2c40 0%, #16202f 100%);
          font-size: 15px;
          .position-city {
            font-weight: bold;
            letter-spacing: 1px;
          }
          .position-coord {
            font-size: 12px;
            opacity: 0.75;
          }
        }
      }
      &.info {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .info-item {
          display: flex;
          flex-direction: column;
          margin-right: 32px;
          .info-name {
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--main-font-second-color);
          }
          .info-num {
            font-size: 34px;
            font-weight: bold;
            color: var(--color);
          }
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }
}
// 定位点脉冲动画
@keyframes pin-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}
// 统计加载图标旋转
@keyframes static-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
