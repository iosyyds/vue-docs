---
title: 图片批量压缩转 WebP：体积降 80% 画质不降
date: '2026-11-07'
categories:
  - 技术教程
tags:
  - 图片优化
  - WebP
  - 性能
cover: /images/covers/cover_webp-compress.jpg
articleGPT: "博客加载慢，八成是图片拖的后腿。JPG 原图动辄两三兆，压到 WebP 后往往只剩几百 K。本文给出 cwebp、ImageMagick 和脚本批量处理的完整方法，含质量参数和对比验证。"
---

# 图片批量压缩转 WebP：体积降 80% 画质不降

一篇带十张截图的教程，原始素材可能有 30 MB。直接塞进博客，读者在手机流量下打开要等十几秒，跳出率立马上去。

WebP 在同等主观画质下通常只有 JPG 的 20%~30% 体积。这篇讲怎么批量转换，以及怎么验证「画质确实没降」。

![JPG 与 WebP 体积与画质对比](/images/tutorial/webp-compress-1.svg)

## 一、先装工具

Ubuntu / Debian：

```bash
apt install -y webp imagemagick
```

CentOS / OpenCloudOS：

```bash
dnf install -y libwebp-tools ImageMagick
```

验证：

```bash
cwebp -version
convert -version | head -1
```

## 二、单张转换与质量参数

```bash
cwebp -q 82 input.jpg -o output.webp
```

参数怎么选：

- `-q 80~85`：大多数照片和截图的最优点，肉眼几乎看不出差别
- `-q 75`：体积还能再降一截，放大到 200% 才能看出轻微色块
- `-q 90+`：画质过剩，体积优势消失，不建议

**注意**：纯文字截图、UI 界面图用 `-q 90` 更合适，因为文字边缘容易出现压缩伪影；照片类用 `-q 80` 就够。

## 三、限制最大宽度

很多时候图片体积大不是因为压缩率，而是分辨率过高。博客正文宽度约 800px，原图 3000px 完全是浪费：

```bash
cwebp -q 82 -resize 1200 0 input.jpg -o output.webp
```

`-resize 1200 0` 表示宽度压到 1200，高度等比缩放。这个参数对截图尤其有效，体积经常能再降一半。

## 四、批量转换脚本

在 `scripts/` 下放一个 `compress.sh`：

```bash
#!/bin/bash
# 用法: ./scripts/compress.sh ./assets/inbox 82
set -e
SRC=$1
Q=${2:-82}

mkdir -p public/images/inline

find "$SRC" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r f; do
  name=$(basename "${f%.*}")
  cwebp -q "$Q" -resize 1200 0 "$f" -o "public/images/inline/${name}.webp"
  echo "✓ ${name}.webp  $(du -h "$f" | cut -f1) → $(du -h "public/images/inline/${name}.webp" | cut -f1)"
done
```

执行：

```bash
chmod +x scripts/compress.sh
./scripts/compress.sh ./assets/inbox 82
```

输出会直接显示每张图的体积变化，方便确认压缩效果。

![批量压缩脚本的执行流程](/images/tutorial/webp-compress-2.svg)

## 五、在 Markdown 里引用

VitePress 直接支持 WebP：

```markdown
![步骤一](/images/inline/step-1.webp)
```

如果需要兼容极老的浏览器（基本可以忽略），可以用 `<picture>` 标签回退 JPG，但 2026 年主流浏览器对 WebP 的支持率已经接近 100%。

## 六、验证画质的方法

不要只信体积数字，做一次直观对比：

```bash
# 把原图和压缩图并排拼接，肉眼对比
convert input.jpg output.webp -background white -splice 10x0 +append compare.jpg
```

看三个地方：**文字边缘**（有没有发虚）、**大面积渐变**（有没有色带）、**暗部**（有没有块状噪点）。如果三处都过关，`-q 82` 可以放心用。

## 七、进阶：AVIF 值得用吗

AVIF 比 WebP 还能再小 20%~30%，但编码慢、部分旧设备解码支持一般。个人博客的折中方案：

- 正文配图统一 WebP（兼容性和速度平衡最好）
- 封面图可以试 AVIF，配合 `<picture>` 回退
- 不要为了省几十 KB 牺牲构建时间和兼容性

## 小结

图片优化的顺序是：**先压分辨率，再转格式，最后调质量**。把 3000px 的 JPG 直接转 WebP 只能省一半，先缩到 1200px 再转，往往能省 85%。博客首屏能不能进 2 秒，很大程度就看这一步做没做。
