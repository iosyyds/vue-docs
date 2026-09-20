---
title: Docker Compose 入门：一条命令启动整个环境
date: '2026-09-20'
categories:
  - 服务器运维
tags:
  - Docker
  - 部署
  - 运维
articleGPT: "Docker Compose 让你一条命令启动 MySQL+Redis+Nginx 整套环境。这篇从安装到写 docker-compose.yml，实战演示。"
---

# Docker Compose 入门：一条命令启动整个环境

![Docker Compose](https://picsum.photos/seed/docker-compose/800/400)

以前装个网站要装 Nginx、MySQL、Redis，每个都配置半天。Docker Compose 一个文件全搞定。

## 安装

```bash
# Ubuntu
sudo apt install docker.io docker-compose-plugin

# 验证
docker compose version
```

## 第一个 compose 文件

建个 `docker-compose.yml`：

```yaml
version: '3'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    restart: always

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: blog
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    restart: always

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: always

volumes:
  mysql-data:
```

## 常用命令

```bash
docker compose up -d          # 后台启动
docker compose ps             # 看运行状态
docker compose logs -f        # 看日志
docker compose stop           # 停止
docker compose down           # 停止并删除容器
docker compose exec mysql bash # 进 MySQL 容器
docker compose up -d --force-recreate  # 重新创建
```

## 实战：用 Compose 跑一个静态博客

```yaml
version: '3'
services:
  blog:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./dist:/usr/share/nginx/html
    restart: always
```

把构建好的静态文件放到 `dist/`，一条 `docker compose up -d` 就上线了。

## 小贴士

1. `restart: always` 让服务器重启后自动拉起
2. 数据一定要挂 volume，不然容器删了数据没了
3. 生产环境密码别写在 yml 里，用 `.env` 文件
4. 镜像选 `alpine` 版本，体积小一半

## 小结

Docker Compose 把"装环境"从几小时变成几分钟。一个 yml 文件搞定所有服务，换服务器直接 `docker compose up -d`。
