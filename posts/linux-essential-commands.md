---
title: Linux 新手必备 20 个命令：从 cd 到 grep 一篇够用
date: '2026-09-20'
categories:
  - 服务器
tags:
  - Linux
  - 命令行
  - 运维
articleGPT: "刚接触 Linux 不知道敲什么命令？这篇整理新手最常用的 20 个命令，从文件操作到进程查看，每个都带实战例子。"
---

# Linux 新手必备 20 个命令：从 cd 到 grep 一篇够用

刚买 VPS 登录上去，黑屏光标一闪一闪，不知道敲什么。这篇整理日常用得最多的 20 个命令，每个都带例子。

## 文件和目录

```bash
pwd              # 我现在在哪
ls -lah          # 列出所有文件（含隐藏），大小人类可读
cd /var/log      # 进日志目录
cd -             # 回到上一个目录
mkdir -p a/b/c   # 递归建多级目录
rm -rf node_modules  # 删目录（小心！）
cp -r src/ backup/   # 复制目录
mv old.txt new.txt   # 改名/移动
```

## 查看文件内容

```bash
cat /etc/os-release    # 看系统版本
tail -f /var/log/nginx/access.log   # 实时看日志
head -20 file.txt      # 看前 20 行
less big.log           # 翻页看（q 退出）
grep "error" app.log   # 搜关键词
grep -rn "TODO" src/   # 递归搜目录
```

## 系统状态

```bash
top              # 实时进程（q 退出）
htop             # 更好看的 top（要装）
df -h            # 磁盘还剩多少
free -h          # 内存用了多少
uptime           # 系统跑了多久
who              # 谁在登录
```

## 权限和用户

```bash
chmod +x script.sh    # 加执行权限
chown user:user file  # 改所有者
sudo -i               # 切 root
```

## 网络

```bash
curl -I https://xkbk.cn    # 看响应头
ping xkbk.cn                # 测连通性
netstat -tlnp               # 看端口占用
ss -tlnp                    # 新版 netstat
```

## 实用技巧

1. `Ctrl + C` 终止当前命令
2. `Ctrl + R` 搜索历史命令
3. `!!` 重复上一条命令
4. `tab` 自动补全文件名
5. `history` 看历史命令

## 小结

不用背，常用自然记住。先把 `ls/cd/ps/grep/tail` 这几个用熟，其他遇到再查。
