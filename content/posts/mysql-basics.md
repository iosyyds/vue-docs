---
title: "MySQL 入门实战：从建库建表到查询优化"
date: 2026-09-15
slug: mysql-basics
description: "这篇文章是 MySQL 的入门到进阶：安装与连接、建库建表、增删改查、索引原理与优化、常用 SQL 技巧，以及 EXPLAIN 怎么看执行计划，适合从零开始学数据库的开发者。"
categories: ["数据库"]
tags: ["MySQL", "数据库", "教程"]
cover: "/images/covers/cover_mysql.jpg"
aliases: [/posts/mysql-basics]
toc: true
comment: true
---

![封面](/images/covers/cover_mysql.jpg)

数据库是后端开发的必修课，MySQL 又是最主流的选择。这篇文章从"怎么连上"开始，一路讲到查询优化，都是实际开发中高频用到的。

## 安装与连接

```bash
# Ubuntu 安装
sudo apt install mysql-server -y
sudo systemctl start mysql

# 安全初始化（设 root 密码、删匿名用户）
sudo mysql_secure_installation

# 命令行连接
mysql -u root -p
```

也可以用图形工具（Navicat、DBeaver、TablePlus）连 `localhost:3306`。

## 建库建表

```sql
-- 建库
CREATE DATABASE IF NOT EXISTS blog
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blog;

-- 建表：文章表
CREATE TABLE posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT NOT NULL COMMENT '正文',
  category VARCHAR(50) DEFAULT '未分类',
  status TINYINT DEFAULT 1 COMMENT '1发布 0草稿',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;
```

要点：
- **utf8mb4** 才能存 emoji 和生僻字
- **InnoDB** 支持事务，默认引擎
- 经常查询的字段加索引（`INDEX`）

## 增删改查

```sql
-- 插入
INSERT INTO posts (title, content, category)
VALUES ('MySQL 入门', '正文内容', '数据库');

-- 查询（条件 + 排序 + 分页）
SELECT id, title, created_at
FROM posts
WHERE category = '数据库' AND status = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;   -- 第 1 页

-- 统计
SELECT category, COUNT(*) AS cnt
FROM posts
GROUP BY category
HAVING cnt > 1
ORDER BY cnt DESC;

-- 更新 / 删除（一定要带 WHERE！）
UPDATE posts SET status = 0 WHERE id = 1;
DELETE FROM posts WHERE id = 1;
```

![MySQL 查询执行流程](/images/tutorial/mysql.svg)

## 索引：快慢的分水岭

没有索引时查询是**全表扫描**，百万行数据就会明显变慢。索引相当于书的目录。

```sql
-- 看查询是否走索引：EXPLAIN
EXPLAIN SELECT * FROM posts WHERE category = '数据库';
-- type 是 ref / range / const 说明用了索引，ALL 就是全表扫描
```

建索引的原则：

1. **WHERE、JOIN、ORDER BY 的字段**适合建索引
2. 区分度高的字段优先（性别这种区分度低的不如不建）
3. **联合索引**遵循最左前缀：`(category, status)` 可以命中 `category` 查询，但不能单独命中 `status`
4. 索引不是越多越好，写入会变慢、占空间

```sql
-- 常用索引操作
CREATE INDEX idx_title ON posts (title);
DROP INDEX idx_title ON posts;
```

## 事务：保证数据一致性

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;      -- 成功提交
-- ROLLBACK; -- 出错回滚，两个更新都不生效
```

转账这种多步操作必须用事务，防止"扣了钱没到账"。

## 常用技巧

```sql
-- 模糊查询注意：%keyword% 用不上索引
SELECT * FROM posts WHERE title LIKE 'MySQL%';  -- 前缀匹配可以走索引

-- 避免 SELECT *，只查需要的列
SELECT id, title FROM posts;

-- 防止 SQL 注入：永远用参数化查询
-- 不要拼字符串："SELECT * FROM users WHERE name = '" + input + "'"
-- 用预处理：WHERE name = ?
```

## 数据备份

```bash
# 逻辑备份
mysqldump -u root -p blog > blog_backup.sql

# 恢复
mysql -u root -p blog < blog_backup.sql

# 建议加 cron 每天备份，保留最近 7 天
```

## 小结

MySQL 的学习路径：**建库建表 → 增删改查 → 索引优化 → 事务 → 备份**。面试和工作里最常考的就是索引和事务，把 `EXPLAIN` 用熟，性能问题基本都能自己定位。