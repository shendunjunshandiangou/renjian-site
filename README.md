# 人间样本 · RENJIAN SPECIMENS

一座小小的个人标本馆。把旅行途中采集的光线、与模型对话时掉落的句子、琴键上的错音、读到一半的书签，统统编号、归档、钉在软木板上。

## 技术栈

- **Astro 7**（minimal 模板 + TypeScript strict）
- 内容集合（Content Collections）：`posts` 与 `notes`，zod 校验 frontmatter
- 图片管线：`astro:assets` 自动生成 WebP + srcset（21 张图）
- 纯静态输出，零前端框架，零运行时依赖
- 无 JS 时页面为完整终态（动效仅在 `.anim` 类存在时启用）

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 静态产物输出到 dist/
npm run preview    # 预览构建产物
```

## 目录结构

```
src/
  consts.ts              # 站点/模块/导航/状态 全局配置（唯一配置源）
  content.config.ts      # posts + notes 集合 schema
  styles/global.css      # 设计令牌 + 全站样式
  layouts/BaseLayout.astro
  components/
  pages/
    index.astro          # 首页
    [module]/index.astro # 模块列表页（5 个）
    [module]/[slug].astro# 文章详情页
    notes.astro          # 随想时间流
    all.astro            # 全部标本（混排）
    about.astro          # 关于 / Now
    rss.xml.ts           # posts RSS
    notes.xml.ts         # notes RSS
    sitemap.xml.ts       # sitemap
  assets/illustrations/  # 7 张手绘插图源图
public/
  robots.txt
```

## 内容维护

### 新增一篇文章

在 `src/content/posts/<module>/` 下建一个 Markdown 文件，frontmatter：

```yaml
---
title: 标题
specimen: RS-0043        # 标本编号，必填且全站唯一
module: travel           # travel | ai-lab | math-notes | reading | music
date: 2026-09-11
description: 一句话摘要
tags: [京都, 雨]
status: growing          # seed | growing | evergreen
draft: false
---
```

### 新增一条随想

在 `src/content/notes/` 下建 `.md`，frontmatter 含 `specimen`（RS-F-XXXX）、`date`、可选 `module`，正文即片段内容。

## 部署

静态站点，`npm run build` 后把 `dist/` 交给任意静态托管即可。

GitHub Pages 示例（`.github/workflows/deploy.yml`）：

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages }
    steps:
      - uses: actions/deploy-pages@v4
```

## 上线前 TODO

- [ ] `src/consts.ts` 中 `SITE.url` 替换为真实域名（当前为 `renjian.example.com` 占位）
- [ ] `SITE.email` 与 `SOCIAL` 社交链接替换为真实地址
- [ ] `public/robots.txt` 中 sitemap 域名同步替换
- [ ] 按需替换 `src/content/` 下的示例文案与插图

## 设计基准

设计已定稿，施工不重新设计。基准文件：

- 提示词规范：`../research/feishu-export/website-build-prompt-v3.md`（v3.6）
- 首页定稿：`../research/mockups/home-final.html`（v8）
- 效果图对照：`../research/mockups/shots/home-final-v8.jpg`
- 施工手册：`HANDOFF.md`
