# 「人间样本」施工包 · 小毛1号交接手册

> 写给接手建站的小毛1号（以及任何后续接手的 agent）。
> 设计已全部定稿，你的任务是**按图纸施工，不要重新设计**。
> 小毛3号（K3）因额度可能随时掉线，本手册保证任何时刻都能继续。

---

## 0. 开工前必读（3 分钟）

1. 先读本手册全部，再读 `research/feishu-export/website-build-prompt-v3.md`（v3.6 定稿提示词，唯一权威规范）
2. 设计基准文件（对照它验收，不许偏离）：
   - 首页定稿：`research/mockups/home-final.html`（v8，含动效；浏览器打开直接看效果）
   - 七张定稿插图：`research/mockups/user-gen/final/*.jpg`（01 节拍器 / 02 相机 / 04 圆规 / 10 书 / 16 烧瓶 / 22 便签 / 26 采集箱主图）
   - 效果图截图：`research/mockups/shots/home-final-v8.jpg`（桌面终态对照图）
3. 硬性约束（违反 = 返工）：
   - 不许改配色、字体栈、字号体系、模块结构、动效参数——v3.6 里写死的一切
   - 前端代码禁止出现任何 API Key
   - 不写死用户名和绝对路径；环境项进配置文件
   - 每完成一步，`npm run build` 必须通过，再更新本手册第 5 节的状态看板

## 1. 项目位置与初始化

项目根目录：`/Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site/`（不存在就创建）

```bash
mkdir -p /Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site
cd /Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
git init && git add -A && git commit -m "chore: astro minimal init"
```

验收：`npm run dev` 能启动，浏览器打开 localhost:4321 有页面。

## 2. 施工顺序（每步独立可验收，按序做）

| # | 步骤 | 做什么 | 验收点 |
|---|---|---|---|
| 1 | 初始化 | 上面的命令 | dev 能跑 |
| 2 | 全局配置 | `src/consts.ts`：站名「人间样本」、模块清单（travel/ai-lab/math-notes/reading/music/notes/about）、强调色 #c2452d、域名占位 | 配置集中，无散落硬编码 |
| 3 | 内容集合 | `src/content.config.ts`：posts 与 notes 两个集合，zod 校验 frontmatter（见 v3.6 第四节，标本编号 specimen 必填唯一） | 非法 frontmatter 构建报错 |
| 4 | 示例内容 | posts 每模块 1 篇 + notes 2 条（占位文案可从 home-final.html 抄） | `npm run build` 通过 |
| 5 | 基础样式 | 把 home-final.html `<style>` 里的设计令牌（:root 变量）与基础排版抽到 `src/styles/global.css` | 变量与 v8 完全一致 |
| 6 | 首页 | 按 home-final.html 结构实现 `src/pages/index.astro`（数据改为从内容集合读取：统计、分区卡、新入库流），动效脚本原样移植 | 截图与 home-final-v8.jpg 对比无结构差异 |
| 7 | 插图管线 | 七张图放 `src/assets/illustrations/`，用 `astro:assets` 的 `<Image>` 引入（WebP、显式宽高、首屏外 lazy） | 构建产物有 webp + srcset |
| 8 | 模块页 | 每个模块列表页 + 文章详情页（标本编号 + 生长徽章在头部）+ notes 时间流页 + about 页 | 每页可达、样式与首页一致 |
| 9 | 导航与页脚 | 顶栏导航八项：首页/行旅志/AI工坊/数理札记/纸上回声/声音档案/**随想**/关于；页脚邮箱/社交/RSS | 导航含随想 |
| 10 | 收尾 | RSS（posts、notes 各一个 feed）、sitemap、暗色模式、README | RSS 可访问 |

## 3. 动效实现要点（照抄 v8）

- 入场：主图居中放大（scale 1.12）停留后移右侧归位（1.5s），文字随后依次浮现（fadeUp，各间隔 ~130ms）
- 整屏：桌面端 `scroll-snap-type: y proximity`，hero/分区/新入库各 min-height 100vh
- 滚动浮现：IntersectionObserver，threshold 0.12，同批 90ms 级联，transition 0.8s cubic-bezier(.2,.7,.2,1)
- **JS 门控**：JS 给 `<html>` 加 `.anim` 类后才启用动画；无 JS 时页面是完整终态（v5 的教训：不用 CSS mask，默认态必须可见）
- `prefers-reduced-motion` 全部退化

## 4. 部署（等用户授权 GitHub 后做）

- 建 GitHub 仓库（需用户授权或用户自己建）
- GitHub Actions → GitHub Pages：官方 `withastro/action` 模板即可
- 自定义域名单独问用户

## 5. 状态看板（施工时实时更新）

| 步骤 | 状态 | 备注 |
|---|---|---|
| 1 初始化 | ✅ 完成 | astro 7.3.2 minimal + strict，3 次 commit |
| 2 全局配置 | ✅ 完成 | `src/consts.ts`：SITE/MODULES/NAV/SOCIAL/STATUS 集中管理 |
| 3 内容集合 | ✅ 完成 | posts + notes，specimen 必填唯一，zod 校验 |
| 4 示例内容 | ✅ 完成 | posts 每模块 1 篇 + notes 2 条 |
| 5 基础样式 | ✅ 完成 | global.css 351 行，令牌与 v8 一致，另补页面级样式 |
| 6 首页 | ✅ 完成 | 数据驱动，动效原样移植 |
| 7 插图管线 | ✅ 完成 | 21 张 webp，主图 379kB→102kB，srcset 生效 |
| 8 模块页 | ✅ 完成 | 5 模块列表页 + 5 文章页 + /notes + /about + /all |
| 9 导航页脚 | ✅ 完成 | 顶栏八项（含随想），页脚邮箱/社交/RSS |
| 10 收尾 | ✅ 完成 | rss.xml + notes.xml + sitemap.xml + robots.txt + 暗色模式 + README |

**当前构建：14 页通过**（`npm run build`）。路由全部 200。
质检截图见 `qa-shots/`（home / travel / travel_kyoto-rain / notes / about / all，浅色模式），对照 `research/mockups/shots/home-final-v8.jpg`。

> 第 8-10 步由小毛1号接手完成（小毛3号 k3 额度中断）。第 4 步部署待用户授权 GitHub。

### 质检发现（已修复）

| 问题 | 严重度 | 状态 |
|---|---|---|
| Astro `<Image>` 输出的 width/height 属性作为呈现提示压过 `aspect-ratio`，hero 图渲染 617×1400（应 617×617）、卡片图 388×934（应 388×267），图片被纵向拉伸 | 高（全局可见） | ✅ 已修（`global.css` 加 `height:auto`）|

### 验收方式与结论

设计基准 v8 与构建产物做**确定性布局比对**（CDP 量取真实渲染坐标，浅色模式，动画结束态）：

- 配色：`#faf8f3` / `#26221c` 一致
- 顶栏 1265×85、hero 1265×900、hero 网格 1265×644、hero 图 617×617@x600、分区卡 388×551、两处 section-head —— **逐项与 v8 完全一致**
- 唯一差异：`.stream` 高 1599 vs v8 1745，因示例内容按规格放 2 条随想（v8 为 3 条），属内容差异

> 注：视觉模型（kimi/k3、deepseek vision-exp）当时认证不可用，故改用渲染坐标比对替代肉眼验收。

## 6. 如果小毛3号掉线了

1. 看本看板确认最后完成的步骤
2. `cd renjian-site && npm run build` 验证当前态能构建
3. 从下一个 ⬜ 步骤继续，验收标准就是上表
4. 完工后在群里发：构建结果 + 首页截图 + 与 home-final-v8.jpg 的差异说明
5. 小毛3号恢复后会对照验收清单做质检

## 7. 协作规则

- 小毛1号：按本手册施工，每完成一步更新看板并在群里简报（一行话 + 构建是否通过）
- 小毛3号：质检与答疑；发现偏差直接指出对照点
- 用户（馆长）：只看验收截图，定夺任何手册没覆盖的取舍
