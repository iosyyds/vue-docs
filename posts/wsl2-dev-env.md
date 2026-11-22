---
title: Windows 开发环境：WSL2 + Windows Terminal 配置
date: '2026-11-13'
categories:
  - 效率工具
tags:
  - Windows
  - WSL
  - 开发环境
cover: /images/covers/cover_wsl2-setup.jpg
articleGPT: "在 Windows 上做开发最舒服的方式不是装一堆 Windows 版工具，而是用 WSL2 跑 Linux 环境，Windows 只做宿主。本文给出安装、迁移到 D 盘、SSH、Git、Node 环境与终端美化的完整配置。"
---

# Windows 开发环境：WSL2 + Windows Terminal 配置

Windows 做开发有两条路：一条是给每个工具装 Windows 版，环境变量、路径分隔符、换行符到处是坑；另一条是用 WSL2 跑一个真正的 Linux，Windows 只负责编辑器和浏览器。

习惯之后，第二条路明显更省心：命令和服务器一致、包管理一致、脚本可以直接复用。

![WSL2 与 Windows 的协作结构](/images/tutorial/wsl2-1.svg)

## 一、安装 WSL2

管理员 PowerShell 执行：

```powershell
wsl --install
```

默认会装 Ubuntu。装完重启，设置用户名和密码。

确认版本：

```powershell
wsl --list --verbose
```

看到 `VERSION 2` 才是 WSL2（WSL1 性能和兼容性都差很多）。如果是 1：

```powershell
wsl --set-version Ubuntu 2
```

## 二、迁移到 D 盘（重要）

WSL 默认装在 C 盘，几百 G 的镜像和缓存很快把 C 盘吃满。迁移：

```powershell
# 1. 关闭 WSL
wsl --shutdown

# 2. 导出
wsl --export Ubuntu D:\wsl\ubuntu-backup.tar

# 3. 注销旧实例
wsl --unregister Ubuntu

# 4. 导入到 D 盘
wsl --import Ubuntu D:\wsl\Ubuntu D:\wsl\ubuntu-backup.tar --version 2
```

导入后默认用户会变成 root，改回普通用户：

```bash
# 在 Ubuntu 内查看你的用户名
whoami
```

在 `D:\wsl\Ubuntu\wsl.conf` 里加：

```ini
[user]
default=你的用户名
```

## 三、SSH 与 Git 配置

WSL 里生成密钥并复用 Windows 的 SSH agent 是可选的，简单起见直接在 WSL 内维护一套：

```bash
ssh-keygen -t ed25519 -C "wsl"
cat ~/.ssh/id_ed25519.pub
```

Git 配置：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global core.autocrlf input
git config --global init.defaultBranch main
```

`core.autocrlf input` 很关键：Windows 编辑器和 Linux 工具混用时，避免换行符把整个文件标记成修改。

## 四、Node 环境

不要用系统包管理器装 Node，版本切换麻烦。用 nvm：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
node -v
```

npm 换源：

```bash
npm config set registry https://registry.npmmirror.com
```

## 五、Windows Terminal 配置

Windows Terminal 是官方终端，支持多标签、分屏、GPU 渲染。配置文件路径：

```
%LOCALAPPDATA%\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json
```

推荐配置片段：

```json
{
  "defaultProfile": "{Ubuntu的GUID}",
  "profiles": {
    "defaults": {
      "font": { "face": "Cascadia Code", "size": 11 },
      "opacity": 90,
      "useAcrylic": true,
      "padding": "8"
    }
  },
  "actions": [
    { "command": { "action": "splitPane", "split": "vertical" }, "keys": "alt+shift+d" },
    { "command": "toggleFullscreen", "keys": "f11" }
  ]
}
```

字体建议装 **Cascadia Code PL** 或 **JetBrains Mono**，前者自带 Powerline 图标，配 Starship 提示符刚好。

## 六、在 WSL 里编辑 Windows 文件

WSL 可以访问 Windows 盘符：

```bash
cd /mnt/d/projects
```

但**不要把项目放在 `/mnt/c` 或 `/mnt/d` 里做开发**：跨文件系统的 IO 性能差十倍，`npm install` 会明显变慢。项目放在 WSL 自己的文件系统（`~/projects`），Windows 侧通过 VS Code 的 Remote WSL 打开。

VS Code 装 **WSL 扩展**，然后在 WSL 终端里执行：

```bash
code .
```

![WSL2 开发环境的推荐目录划分](/images/tutorial/wsl2-2.svg)

## 七、常用维护命令

```powershell
# 查看所有发行版
wsl -l -v

# 关闭
wsl --shutdown

# 查看 WSL 占用
Get-Process -Name "*wsl*" | Select-Object Name, WorkingSet

# 更新 WSL
wsl --update
```

WSL 的磁盘占用会随使用增长，定期在 WSL 内清理：

```bash
sudo apt autoremove -y
sudo apt clean
```

## 小结

WSL2 的价值不是「在 Windows 上模拟 Linux」，而是让同一套命令、同一套脚本在本地和服务器上通用。配置一次，之后写代码、部署、调试都在一个环境里完成，少掉很多「在我电脑上能跑」的问题。
