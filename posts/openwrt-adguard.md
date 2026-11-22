---
title: OpenWrt + AdGuard Home：全屋去广告实战
date: '2026-11-12'
categories:
  - 生活折腾
tags:
  - 路由器
  - OpenWrt
  - 去广告
cover: /images/covers/cover_openwrt-adguard.jpg
articleGPT: "手机 App 里的开屏广告、网页横幅、电视盒子推送，靠浏览器插件挡不完。把 AdGuard Home 部署到 OpenWrt 或内网服务器，让全网设备统一走 DNS 过滤，一次配置全屋生效。"
---

# OpenWrt + AdGuard Home：全屋去广告实战

浏览器装个 uBlock 能挡住网页广告，但手机 App 的开屏、电视盒子的推送、智能音箱的推荐，都没法装插件。这类广告大多依赖 DNS 解析到广告域名，从 DNS 层拦截，所有设备都能受益。

AdGuard Home 就是做一个「会过滤广告的 DNS 服务器」，把它设为全屋的 DNS，广告域名直接返回空结果。

![DNS 层过滤的工作方式](/images/tutorial/adguard-1.svg)

## 一、部署位置怎么选

两种方案：

- **装在 OpenWrt 路由器上**：好处是所有流量都经过它，配置最简单；缺点是路由器闪存小，日志多了容易写满
- **装在内网服务器/NAS 上**：性能好、日志空间足；需要把路由器的 DNS 指向它

推荐后者：家里有 NAS 或软路由的，用 Docker 跑 AdGuard Home，路由器只负责把 DHCP 下发的 DNS 指过去。

## 二、Docker 部署

```bash
docker run -d \
  --name adguardhome \
  --restart unless-stopped \
  -p 53:53/tcp -p 53:53/udp \
  -p 3000:3000/tcp \
  -v /www/docker/adguard/work:/opt/adguardhome/work \
  -v /www/docker/adguard/conf:/opt/adguardhome/conf \
  adguard/adguardhome
```

**注意**：53 端口如果被系统的 `systemd-resolved` 占用，先停掉：

```bash
systemctl stop systemd-resolved
systemctl disable systemd-resolved
```

然后访问 `http://服务器IP:3000`，按向导设置管理密码、监听端口（Web 面板可改成 8080）。

## 三、路由器把 DNS 指过去

OpenWrt → 网络 → DHCP/DNS：

- **DNS 转发**：填 AdGuard Home 的内网 IP（如 `192.168.1.10`）
- 关闭「本地 DNS 缓存」以免绕过过滤
- 保存并重启 dnsmasq

或者在 DHCP 服务里把下发的 DNS 服务器改成 `192.168.1.10`，客户端重新联网后生效。

验证是否生效：

```bash
nslookup doubleclick.net 192.168.1.10
# 应该返回 0.0.0.0 或 NXDOMAIN
```

![全屋 DNS 过滤的部署位置](/images/tutorial/adguard-2.svg)

## 四、添加过滤规则

AdGuard Home 自带「广告过滤器」，建议启用：

- **AdGuard DNS filter**
- **EasyList China**（中文广告）
- **AdAway**（移动端广告）
- **Peter Lowe's list**

在「过滤器 → DNS 阻止列表」里添加，保存后自动更新。

自定义规则示例：

```
||doubleclick.net^
||googlesyndication.com^
||adservice.google.com^
@@||example.com^$important    # 白名单
```

## 五、查询日志与排查

「查询日志」能看到每个设备请求了哪些域名、是否被拦截。常见问题处理：

**某个 App 打不开**。在日志里搜该 App 的域名，如果被误拦，加到白名单：

```
@@||api.example.com^
```

**过滤太狠导致网页错乱**。先停用最激进的列表，逐个排查。

**设备不生效**。检查设备是否真的用了新 DNS：手机上看 Wi-Fi 详情里的 DNS，或者访问 `https://adguard.com/test.html`。

## 六、加密 DNS（可选但推荐）

明文 DNS 会被运营商看到，也可能被劫持。AdGuard Home 支持 DoH/DoT：

- 设置 → 加密 → 启用 **DNS-over-TLS**（853 端口）
- 申请证书（Let's Encrypt），填入证书路径
- 在手机/电脑的系统 DNS 里填 `tls://dns.example.com`

这样出门在外也能用自家的过滤规则，不用改路由器。

## 七、注意性能和稳定性

- 树莓派/NAS 跑 AdGuard Home 完全够用，日查询量几千到几万都没问题
- **日志保留天数别设太长**，7 天足够，否则数据库膨胀
- 路由器 DNS 只指一个上游时，AdGuard Home 挂了会导致全屋断网。建议在路由器里配**两个 DNS**：主用 AdGuard Home，备用 223.5.5.5
- 定期更新过滤列表：设置里开启自动更新（每天一次）

全屋去广告的效果是渐进的：刚配置完可能只感觉网页干净了，用一周后会明显发现 App 开屏变快、视频贴片变少。这套方案的一次性成本约半小时，长期收益是所有设备都受益。
