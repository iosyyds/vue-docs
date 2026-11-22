#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成博客文章正文配图（统一风格 SVG）
用法: python3 scripts/gen-article-svgs.py
输出: public/images/tutorial/<slug>-1.svg / <slug>-2.svg

设计规范:
- 画布 1200 x 675 (16:9)
- 背景 #f8fafc，卡片白色 + 细边框
- 主色 #6366f1 靛蓝，辅助 #0ea5e9 天蓝
- 中文无衬线字体栈
"""

import os

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images', 'tutorial')
os.makedirs(OUT_DIR, exist_ok=True)

FONT = "'PingFang SC','Microsoft YaHei','Noto Sans SC','Helvetica Neue',sans-serif"
INK = '#0f172a'
SUB = '#64748b'
BRAND = '#6366f1'
BRAND_DARK = '#4f46e5'
ACCENT = '#0ea5e9'
CARD = '#ffffff'
BORDER = '#e2e8f0'
BG = '#f8fafc'

# 每篇文章的两张图：类型 + 标题 + 副标题 + 节点
# type: flow(横向流程) / stack(纵向卡片) / compare(左右对比) / list(要点清单)
IMAGES = {
    'obsidian-workflow': [
        ('flow', 'Obsidian 到博客：五步发布', '写完即发布，收尾只用一条命令',
         ['Obsidian 写稿', '套用模板', '复制定稿', 'git push', 'Actions 上线']),
        ('flow', '发布脚本的四步执行', 'publish.sh 依次完成检查与上线',
         ['复制定稿', '校验 frontmatter', '构建并推送', '归档到 published']),
    ],
    'para-system': [
        ('flow', 'PARA：四个目录的分工', '按「行动 vs 领域 vs 兴趣」重新组织资料',
         ['Projects\n有截止时间', 'Areas\n长期责任', 'Resources\n备用资料', 'Archives\n已完成归档']),
        ('list', '资料归类的三个判断', '存之前先想清楚它服务于什么',
         ['服务于当前任务？→ Projects', '需要长期维护？→ Areas', '只是以后可能用？→ Resources + 标签']),
    ],
    'rsshub': [
        ('flow', 'RSSHub 的工作方式', '一次部署，全网内容变成标准 RSS',
         ['目标网站', 'RSSHub 路由转换', 'Redis 缓存', 'RSS 阅读器']),
        ('stack', '部署的三层结构', '公网入口、防护、容器各自独立',
         ['公网入口：Nginx + HTTPS + Basic Auth', '服务层：RSSHub 容器 + Redis 缓存', '数据层：缓存目录与日志持久化']),
    ],
    'baota-security': [
        ('flow', '八项加固的优先级', '先收紧入口，再补监控与备份',
         ['面板入口', 'SSH 密钥', '数据库本机', '防火墙', '2FA · 权限 · WAF · 备份']),
        ('compare', '必要端口 vs 禁止暴露', '只放行业务端口，其余一律关闭',
         ['必要：22 / 80 / 443 / 面板端口', '禁止：3306 / 6379 / 27017 / Docker API']),
    ],
    'uptime-kuma': [
        ('flow', '监控与告警的完整链路', '从检查到通知再到恢复确认',
         ['监控项', '定时检查', '失败重试', '多渠道告警', '恢复通知']),
        ('compare', '单渠道 vs 双渠道告警', '至少配两个渠道，避免漏报',
         ['单渠道：渠道故障即失联', '双渠道：即时推送 + 邮件兜底']),
    ],
    'webp-compress': [
        ('flow', '图片优化的正确顺序', '先降分辨率，再转格式，最后调质量',
         ['原始 JPG', '缩到 1200px', '转 WebP q82', '上线加载']),
        ('compare', '优化前后的典型体积', '同一张 3000px 截图的实际变化',
         ['原图 JPG：2.4 MB', 'WebP 1200px：380 KB（↓84%）']),
    ],
    'git-slim': [
        ('flow', '仓库瘦身的五个步骤', '先定位、备份，再重写历史',
         ['定位大文件', '镜像备份', 'filter-repo', '强推远程', '验证体积']),
        ('compare', '清理前后的对比', '历史里的视频和 PSD 才是元凶',
         ['.git 清理前：800 MB', '.git 清理后：60 MB']),
    ],
    'local-search': [
        ('compare', '本地搜索 vs 云端搜索', '成本与依赖的取舍',
         ['本地：构建生成索引，离线可用，零成本', 'Algolia：极速、结果更好，依赖推送']),
        ('flow', '本地搜索的工作流', '索引随构建生成，浏览器直接检索',
         ['Markdown 文章', '构建生成索引', '浏览器加载', '输入即搜']),
    ],
    'cf-tunnel': [
        ('compare', '端口映射 vs Cloudflare Tunnel', '一个暴露端口，一个只建出站连接',
         ['端口映射：公网直达内网，风险高', 'Tunnel：出站隧道，不开放入站端口']),
        ('flow', 'Access 的验证流程', '只有通过身份验证的邮箱才能访问',
         ['访问域名', 'Cloudflare 登录页', '邮箱验证码', '放行进内网']),
    ],
    'jellyfin': [
        ('flow', '媒体库的整理流程', '规范命名是刮削成功的前提',
         ['整理文件名', '建立媒体库', '自动刮削元数据', '多端播放']),
        ('compare', '软转 vs 硬转', '4K 转 1080p 时的资源占用差异',
         ['软件转码：CPU 100%，风扇狂转', '硬件转码：核显 <10%，CPU 空闲']),
    ],
    'adguard': [
        ('flow', '全屋 DNS 过滤链路', '一次配置，所有设备生效',
         ['手机 / 电视 / 电脑', '路由器 DNS', 'AdGuard Home', '广告域名拦截']),
        ('compare', 'AdGuard Home 放哪里', '路由器省事，NAS 性能更好',
         ['装在路由器：配置简单，闪存有限', '装在内网服务器：性能好，日志空间足']),
    ],
    'wsl2': [
        ('flow', 'WSL2 开发结构', 'Windows 做宿主，Linux 做开发环境',
         ['Windows 宿主', 'WSL2 Ubuntu', 'VS Code Remote', '项目与终端']),
        ('compare', '项目放哪更快', '跨文件系统的 IO 差距非常大',
         ['/mnt/c：跨盘访问，npm install 很慢', '~/projects：原生文件系统，快十倍']),
    ],
    'restic': [
        ('flow', '3-2-1 备份原则', '三份副本、两种介质、一份异地',
         ['原始数据', '本地快照', '对象存储', '异地服务器']),
        ('stack', '保留策略的时间轴', '日备 7 天、周备 4 周、月备 6 个月',
         ['每天增量备份：只传变化的数据块', '每周 forget + prune：回收旧快照空间', '每季恢复演练：验证备份真的可用']),
    ],
    'vaultwarden': [
        ('flow', '密码库的同步架构', '客户端加密后同步到你自己的服务器',
         ['浏览器扩展', '手机 App', 'Vaultwarden', 'SQLite 数据库']),
        ('list', '上线必做的安全加固', '密码管理器本身必须足够安全',
         ['关闭公开注册，只保留自己的账号', '强制 HTTPS + 开启两步验证', '每天备份数据库并异地存放']),
    ],
    'catchall': [
        ('flow', 'Catch-all 收信路由', '任意前缀都能送达主邮箱',
         ['任意前缀@域名', '邮件路由规则', 'Catch-all 匹配', '主邮箱收信']),
        ('list', '别名命名规则', '用网站名做前缀，泄露时一眼定位',
         ['github@域名 → 代码托管', 'taobao@域名 → 购物网站', 'newsletter@域名 → 订阅邮件']),
    ],
    'vps-line': [
        ('compare', '普通线路 vs CN2 GIA', '差别不在配置，在晚高峰的稳定性',
         ['普通线路：共享出口，丢包可达 20%', 'CN2 GIA：全程专线，丢包 <1%']),
        ('compare', '运营商与线路匹配', '你的宽带决定了哪条线路有价值',
         ['电信宽带 → CN2 / CN2 GIA', '联通 → 9929；移动 → CMI']),
    ],
    'typecho-wp': [
        ('compare', '两种博客程序的定位', '轻量写作 vs 生态扩展',
         ['Typecho：1 核 512M 可跑，Markdown 顺手', 'WordPress：插件丰富，资源占用更高']),
        ('compare', '按需求做选择', '标准博客两者都够，扩展需求看生态',
         ['个人博客 / Markdown → Typecho', '会员 / 电商 / 多作者 → WordPress']),
    ],
    'image-workflow': [
        ('flow', '配图从截图到上线', '把七八步压缩成三步',
         ['截图并命名', '自动转 WebP', 'Markdown 引用', '发布上线']),
        ('list', '发布前的六项检查', '尤其是截图里的敏感信息',
         ['路径存在、体积 <150KB', 'alt 文字完整、封面 1200×600', '密钥和隐私信息已打码']),
    ],
    'actions-cron': [
        ('flow', '定时任务的运行链路', '触发、执行、通知各司其职',
         ['cron 定时触发', 'Runner 执行脚本', '产出 / 上传', '失败通知']),
        ('list', '适合放进来的任务', '轻量、低频、失败可容忍',
         ['数据库与文件备份', '证书过期检查', '定时抓取数据生成页面', '清理过期产物']),
    ],
    'blog-review': [
        ('flow', '复盘看的三层指标', '从流量到内容再到工具链',
         ['流量结构', '内容贡献', '工具效率', '下一年目标']),
        ('flow', '下一年的执行节奏', '目标要可衡量，而不是「多更新」',
         ['每周一篇教程', 'Top 文章做系列', '搜索占比 70%', '季度复盘']),
    ],
}


def esc(s):
    return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))


def wrap(s, width):
    """按字符宽度粗略换行"""
    lines = []
    cur = ''
    for ch in s:
        cur += ch
        if len(cur) >= width:
            lines.append(cur)
            cur = ''
    if cur:
        lines.append(cur)
    return lines


def header(title, subtitle):
    return f'''
  <text x="64" y="92" font-family="{FONT}" font-size="40" font-weight="700" fill="{INK}">{esc(title)}</text>
  <text x="64" y="136" font-family="{FONT}" font-size="22" fill="{SUB}">{esc(subtitle)}</text>
  <line x1="64" y1="168" x2="1136" y2="168" stroke="{BORDER}" stroke-width="1.5"/>
'''


def flow(nodes, y=250):
    n = len(nodes)
    gap = 28
    total_w = 1136 - 64
    card_w = (total_w - gap * (n - 1)) / n
    parts = []
    for i, label in enumerate(nodes):
        x = 64 + i * (card_w + gap)
        h = 170
        parts.append(f'''
  <rect x="{x:.1f}" y="{y}" width="{card_w:.1f}" height="{h}" rx="20" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
  <circle cx="{x + 32:.1f}" cy="{y + 34}" r="16" fill="{BRAND}" opacity="0.12"/>
  <text x="{x + 32:.1f}" y="{y + 40}" font-family="{FONT}" font-size="18" font-weight="700" fill="{BRAND_DARK}" text-anchor="middle">{i + 1}</text>
''')
        lines = label.split('\n')
        ty = y + 82
        for ln in lines:
            parts.append(f'  <text x="{x + card_w / 2:.1f}" y="{ty}" font-family="{FONT}" font-size="24" font-weight="600" fill="{INK}" text-anchor="middle">{esc(ln)}</text>')
            ty += 34
        if i < n - 1:
            ax = x + card_w + 6
            parts.append(f'''
  <path d="M{ax:.1f} {y + h / 2} L{ax + gap - 12:.1f} {y + h / 2}" stroke="{BRAND}" stroke-width="3" stroke-linecap="round"/>
  <path d="M{ax + gap - 16:.1f} {y + h / 2 - 7} L{ax + gap - 6:.1f} {y + h / 2} L{ax + gap - 16:.1f} {y + h / 2 + 7}" fill="none" stroke="{BRAND}" stroke-width="3"/>
''')
    return ''.join(parts)


def stack(items, y=240):
    parts = []
    for i, item in enumerate(items):
        yy = y + i * 108
        parts.append(f'''
  <rect x="64" y="{yy}" width="1072" height="88" rx="18" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
  <rect x="64" y="{yy}" width="8" height="88" rx="4" fill="{BRAND}"/>
  <text x="100" y="{yy + 52}" font-family="{FONT}" font-size="24" font-weight="500" fill="{INK}">{esc(item)}</text>
''')
    return ''.join(parts)


def compare(items, y=240):
    """左右两栏对比"""
    h = 220
    parts = []
    for i, item in enumerate(items[:2]):
        x = 64 + i * 548
        color = BRAND if i == 0 else ACCENT
        parts.append(f'''
  <rect x="{x}" y="{y}" width="508" height="{h}" rx="20" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
  <rect x="{x}" y="{y}" width="508" height="10" rx="5" fill="{color}"/>
''')
        lines = wrap(item, 20)
        ty = y + 70
        for ln in lines:
            parts.append(f'  <text x="{x + 28}" y="{ty}" font-family="{FONT}" font-size="24" font-weight="600" fill="{INK}">{esc(ln)}</text>')
            ty += 38
    parts.append(f'''
  <text x="516" y="{y + h / 2 + 8}" font-family="{FONT}" font-size="20" font-weight="700" fill="{SUB}" text-anchor="middle">VS</text>
''')
    return ''.join(parts)


def list_items(items, y=240):
    parts = []
    for i, item in enumerate(items):
        yy = y + i * 96
        parts.append(f'''
  <rect x="64" y="{yy}" width="1072" height="76" rx="16" fill="{CARD}" stroke="{BORDER}" stroke-width="2"/>
  <circle cx="104" cy="{yy + 38}" r="14" fill="{BRAND}" opacity="0.14"/>
  <path d="M97 {yy + 38} l5 6 l10 -12" fill="none" stroke="{BRAND_DARK}" stroke-width="3" stroke-linecap="round"/>
  <text x="142" y="{yy + 47}" font-family="{FONT}" font-size="23" font-weight="500" fill="{INK}">{esc(item)}</text>
''')
    return ''.join(parts)


def footer():
    return f'''
  <text x="1136" y="634" font-family="{FONT}" font-size="16" fill="#94a3b8" text-anchor="end">xkbk.cn · 小坤哥哥博客</text>
'''


def build_svg(kind, title, subtitle, items):
    if kind == 'flow':
        body = flow(items)
    elif kind == 'stack':
        body = stack(items)
    elif kind == 'compare':
        body = compare(items)
    else:
        body = list_items(items)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="{BG}"/>
  <circle cx="1080" cy="60" r="180" fill="{BRAND}" opacity="0.05"/>
  <circle cx="100" cy="640" r="140" fill="{ACCENT}" opacity="0.05"/>
{header(title, subtitle)}
{body}
{footer()}
</svg>
'''


def main():
    count = 0
    for slug, items in IMAGES.items():
        for idx, (kind, title, subtitle, nodes) in enumerate(items, start=1):
            path = os.path.join(OUT_DIR, f'{slug}-{idx}.svg')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(build_svg(kind, title, subtitle, nodes))
            count += 1
    print(f'生成完成：{count} 张 SVG -> {OUT_DIR}')


if __name__ == '__main__':
    main()
