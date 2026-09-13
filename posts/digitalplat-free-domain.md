---
id: digitalplat-free-domain
title: 白嫖 DigitalPlat 永久免费域名！支持托管到 Cloudflare
datetime: '2026-09-13 22:00:00'
category: 域名
tags:
  - 免费域名
---

# 白嫖 DigitalPlat 永久免费域名！支持托管到 Cloudflare

## 前言

说起 DigitalPlat 你可能不太熟悉，它其实就是之前的 us.kg 免费域名，在加上 dpdns.org 域名后更名而来。除了平台名称的调整以外，相关的注册、续费规则也在一直变动，主打一个「随心所欲」。

![DigitalPlat](/images/digitalplat/digitalplat.jpg)

DigitalPlat

刚开始 DigitalPlat 的免费域名其实还挺灵的，us.kg 三天两头被停止解析，后面切换到 dpdns.org 之后，也算平稳运行了 2 年。目前一共有 5 个后缀可以选择，分别是最开始的 `us.kg` 和 `dpdns.org`，去年添加的 `xx.kg` 和 `qzz.io` 以及今年刚刚添加的 `qd.je`。

前面四个 `us.kg` `xx.kg` `dpdns.org` `qzz.io` 均已进入 PSL，支持托管到 Cloudflare，至于 `qd.je` 近期估计是悬了，后面细说。

## 规则

::: danger 注意
**免费域名不能保证长期稳定，请勿用于生产环境**
:::

现行的规则如下：

- 每个账号**默认** 只能 1 个域名
- 通过**邀请链接** 注册可以额外获得 1 个
- 给 GitHub 仓库 **Star** 可以额外获得 1 个
- `us.kg` 和 `xx.kg` 注册需要一次性付费 **$3**，免费续费
- 永久免费，但每年需要**提前 120 天** 手动续期 1 年

总结来说，一个账号最多能获得 **3 个免费域名**，推荐优先注册 `dpdns.org` 和 `qzz.io`，完全白嫖，也可以托管到 Cloudflare。

相比之前的规则是 **缩水 + 涨价** 的：

- 每个账号默认就能注册 3 个，GitHub 仓库 Star 再给一个，**一共是 4 个**
- `us.kg` 和 `xx.kg` 一次性付费是 **$2**
- 每年**提前 180 天** 手动续期 1 年

## 插槽与订阅

插槽就是域名容量：1 个插槽可注册并运行 1 个域名。付费插槽是一次性费用，无需循环订阅。

目前就是 **$3** 一个插槽，可以用来注册 `us.kg` 和 `xx.kg`，如果你实在有喜欢的域名可以买个支持一下平台，毕竟是一次性付费，后面**续费** 是和其他域名一样**免费** 的。

![插槽价格](/images/digitalplat/slots.jpg)

插槽

至于订阅就没必要了，甚至还是按月付费，这价格完全可以去买好几个正常的域名了，谁会去花钱买随时可能停止解析的免费域名呢？

![订阅价格](/images/digitalplat/subscriptions.jpg)

订阅

## 回顾 us.kg

一开始提供的免费域名就只有 `us.kg`，但由于滥用被停止解析了几次，后面将把所有**免费注册** 的 `us.kg` 按照相同前缀平移到了 `dpdns.org`，然后 `us.kg` 借着 KYC 的名义收 $2 注册费，当然这也无可厚非，平台运营也需要成本~

不过收费之后，域名确实稳定了很多，可能因为 `kg` 的注册局对于滥用比较严格，后面推出的 `xx.kg` 也参照 `us.kg` 的模式，同样需要付费注册。

## 关于 qd.je

`qd.je` 是今年刚上的新域名，也是免费注册的，但目前还无法托管到 Cloudflare。正常流程是需要将域名提交到 PSL，PSL 收录之后，再等 Cloudflare 拉取 PSL 的列表之后，最终才能托管到 Cloudflare。

**Public Suffix List (PSL)** 是一份由社区维护的权威清单，用于明确界定哪些域名属于"公共后缀"，其核心作用是帮助浏览器和系统识别域名的归属边界，从而防止恶意跨域设置 Cookie、限制通配符证书滥用，并确保 DMARC 等安全协议能够准确识别组织根域名。

目前 `qd.je` 提交 PSL 的 PR 看起来是受阻了，主要是两个问题，一方面是 `qd.je` 目前用户量还不够，但这并不是关键，更重要的是 `qd.je` 被发现提交 PSL 就是为了绕过 Cloudflare 的子域名限制，违反了 PSL 的本意。

![Add QD.JE](/images/digitalplat/qdje_pr.jpg)

Add QD.JE

所以说近期 `qd.je` 应该还是不能托管到 Cloudflare 的，不过每个账号反正都有 3 个免费域名额度，注册完 `dpdns.org` 和 `qzz.io` 刚好能剩一个注册 `qd.je`。作为今年刚上的新后缀，还有挺多不错的域名没被注册的，可以先注册，暂时托管到其他地方解析。

## 申请流程

### 注册账号

进入[注册页面](https://dash.domain.digitalplat.org/auth/register)，这个链接已经带上了邀请码，注册完可以直接获得 2 个免费域名。

需要注意 **Username** 后期是**无法更改**的，**不要填写敏感信息**，其次**邮箱**会显示在免费域名的 WHOIS 中，强烈建议不要使用 QQ 邮箱，避免隐私泄露。

下面的**姓名**和**电话**以及**地址**等，直接用**地址生成器**生成即可，不需要填写真实信息。

![注册](/images/digitalplat/register.jpg)

注册

最后的账单地址勾选与 WHOIS 相同，省去重复填写。

![WHOIS](/images/digitalplat/whois.jpg)

WHOIS

### Star

注册完你会发现只有 2 个免费域名的插槽，还需要给 GitHub 仓库点个 Star。

![Star](/images/digitalplat/star.jpg)

Star

完成 Star 后，来到首页找到 **"verify your GitHub account"**。

![绑定 GitHub](/images/digitalplat/bind_github.jpg)

绑定 GitHub 账号

授权一下 GitHub 账号就能额外获得 1 个免费域名插槽了。

![授权 GitHub](/images/digitalplat/auth_github.jpg)

授权 GitHub 账号

### 申请域名

侧边栏找到 **"注册"**，然后输入你想要的域名，后缀选择 `dpdns.org` `qzz.io` `qd.je` 其中一个，点击 **"检查可用性"**

![搜索域名](/images/digitalplat/search_domain.jpg)

搜索域名

如果你已经在 Cloudflare 中添加了这个域名，可以直接填写上 DNS，没有的话先留空，后面再添加。

![注册域名](/images/digitalplat/register_domain.jpg)

注册域名

下方选择 **"使用免费插槽"**，点击 **"注册"** 就获得了一个免费域名了。

## 域名管理

### 修改 DNS

如果注册的时候没有填写 DNS，可以在域名的管理页中添加。

![修改DNS](/images/digitalplat/modify_dns.jpg)

修改 DNS

### 免费续费

域名续费是免费的，只需要在到期前 120 天内来到页面中，点击 **"申请免费续费"**，最好在日历里设置日程提醒一下自己，**完全没必要花钱续费**。

![免费续费](/images/digitalplat/renew.jpg)

免费续费

### 隐私保护

虽然 WHOIS 支持隐私保护，但是聊胜于无，因为**邮箱无法隐藏**，而其他信息又是地址生成器生成的，所以才建议注册账号时**邮箱**不要填 QQ 邮箱。

![隐私保护](/images/digitalplat/privacy.jpg)

隐私保护

### 删除域名

现在 DigitalPlat 终于返场**删除域名**功能了，如果你不喜欢这个域名了，可以点击删除，等待 7 天 pending 状态结束，域名释放后，就可以重新注册一个新域名了。

![删除域名](/images/digitalplat/delete.jpg)

删除域名
