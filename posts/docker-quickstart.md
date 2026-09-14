---
title: Docker 容器化部署入门：用 Dockerfile 把应用打包成镜像
date: '2026-09-15'
categories:
  - 运维部署
tags:
  - Docker
  - 部署
  - 运维
cover: /images/covers/cover_docker.jpg
articleGPT: "这篇文章带零基础读者入门 Docker：镜像与容器的关系、Dockerfile 的编写规则、构建推送镜像、docker-compose 编排多服务，以及如何把博客或 Node 项目一键容器化部署。"
---

# Docker 容器化部署入门

![封面](/images/covers/cover_docker.jpg)

"Docker 装环境"是现在部署服务的基本功。它把应用和依赖一起打包成镜像，在任何装了 Docker 的机器上都能跑，彻底告别"在我电脑上好好的"。

## 镜像与容器

- **镜像（Image）**：只读模板，包含代码、运行环境、配置，类似"安装包"
- **容器（Container）**：镜像运行起来的实例，类似"安装好的程序"
- **仓库（Registry）**：存放镜像的地方，默认 Docker Hub

![Docker 构建部署流程](/images/tutorial/docker.svg)

常用命令速查：

```bash
docker pull node:22-alpine      # 拉镜像
docker run -d -p 8080:3000 myapp # 后台运行，映射端口
docker ps                        # 查看运行中的容器
docker logs -f 容器ID            # 看日志
docker stop 容器ID               # 停止
docker rm 容器ID                 # 删除容器
docker exec -it 容器ID sh        # 进入容器
```

## 写一个 Dockerfile

以 Node 项目为例：

```dockerfile
# 构建阶段：装依赖并打包
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --registry=https://registry.npmmirror.com
COPY . .
RUN npm run build

# 运行阶段：只保留产物，镜像更小
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

要点：
- **多阶段构建**（builder + 运行）能大幅缩小镜像体积
- 先 `COPY package.json` 再 `COPY .`，利用层缓存加速
- `alpine` 基础镜像小（5MB 级别）

## 构建与运行

```bash
# 构建镜像
docker build -t my-blog:latest .

# 运行
docker run -d \
  --name my-blog \
  -p 8080:80 \
  --restart unless-stopped \
  my-blog:latest

# 推送到仓库（发布）
docker tag my-blog:latest 你的用户名/my-blog:latest
docker push 你的用户名/my-blog:latest
```

`--restart unless-stopped`：服务器重启后容器自动拉起，非常实用。

## 多服务编排：docker-compose

一个博客 + 数据库 + 缓存，用 compose 一条命令全起：

```yaml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: "your_password"
      MYSQL_DATABASE: blog
    volumes:
      - db_data:/var/lib/mysql   # 数据持久化
    restart: unless-stopped

volumes:
  db_data:
```

```bash
docker compose up -d        # 启动全部
docker compose logs -f      # 看日志
docker compose down         # 停止
```

## 数据持久化与备份

容器删除后数据会丢，必须用**数据卷**：

```bash
# 挂载目录（推荐）
docker run -v /host/path:/container/path myapp

# 或命名卷
docker run -v mydata:/data myapp

# 备份 MySQL
docker exec 容器ID mysqldump -u root -p blog > backup.sql
```

## 常见坑

- **容器时间不对**：加 `-e TZ=Asia/Shanghai` 或 `--network host` 时注意
- **端口冲突**：先 `docker ps` 看占用
- **镜像太大**：用多阶段构建 + alpine + `.dockerignore`（排除 node_modules、dist）
- **日志撑爆磁盘**：加 `--log-opt max-size=10m --log-opt max-file=3`

## 小结

Docker 的核心链路就三步：**写 Dockerfile → build 成镜像 → run 成容器**。配上 docker-compose，整个站点的依赖环境都能版本化管理，换服务器一键迁移。这是值得投入时间掌握的技能。
