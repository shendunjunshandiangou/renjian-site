# 发布清单 · dunkangmao.com（授权后按序照抄执行）

> 方向：**冻结代码，只解部署阻塞**。不碰设计、不碰业务代码。
> 每个步骤末尾是"证据"，做完把证据贴进本文件第 5 节 + HANDOFF.md 看板。
> 授权前只允许只读核验（`git status` / `gh auth status` / `cat` 等），不许改文件。

## 0. 授权前已核验的事实（2026-09-11，小毛3号只读核验）

| 项 | 结果 |
|---|---|
| 本地分支 | `master` ，工作区干净（0 个未提交变更） |
| 提交数 | 8 个，最新 `e60e696` |
| 构建 | 14 页通过（`npm run build`） |
| `gh auth status` | **未登录** ← 唯一阻塞 |
| 域名配置文件 | `public/CNAME` = `dunkangmao.com`；`astro.config.mjs` site 已设 |
| **⚠️ 分支不匹配** | `deploy.yml` 触发条件是 `push: branches: [main]`，本地是 `master` —— **直接推 master 不会触发部署**，必须先解决（见步骤 2） |

## 1. 授权 GitHub（人工，馆长操作）

控制台 **Settings → Agents → Tools → GitHub account** → Connect GitHub → 浏览器授权。
备选：终端 `gh auth login`。

**证据**：`gh auth status` 输出显示已登录账号名。

## 2. 建仓库并推送（含分支修正）

```bash
cd /Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site

# 2a. 分支修正：master → main（推荐，与 deploy.yml / Pages 默认一致）
git branch -M main
git branch --show-current          # 应输出 main

# 2b. 建远程仓库并推送
gh repo create renjian-site --public --source=. --remote=origin --push
```

> 备选（不改分支）：把 `deploy.yml` 的 `branches: [main]` 改成 `[main, master]`——
> 但这属于改配置文件，需先经小毛4号确认；**推荐走 2a**。

**证据**：`git remote -v` 显示 origin；`gh repo view --web` 能打开仓库。

## 3. 确认 Actions 成功

```bash
gh run list --limit 3
gh run watch            # 跟随最新一次运行直到结束
```

- 期望：`Deploy to GitHub Pages` 工作流 **success**
- 若失败：`gh run view --log-failed` 抓日志，贴给群里，小毛3号接手排查

**证据**：run 状态 success 的截图或 `gh run list` 输出。

## 4. 开启 Pages + 绑定域名

```bash
gh api -X POST "repos/{owner}/renjian-site/pages" \
  -f "source[branch]=main" -f "source[path]=/" 2>/dev/null || true

gh api -X PUT "repos/{owner}/renjian-site/pages" -f "cname=dunkangmao.com"
```

若 API 不通：仓库 **Settings → Pages** → Source 选 **GitHub Actions** → Custom domain 填 `dunkangmao.com`。

**证据**：`gh api repos/{owner}/renjian-site/pages` 返回里 `cname` = dunkangmao.com。

## 5. DNS（Cloudflare，馆长操作）

| 类型 | 名称 | 内容 | 代理 |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only（灰云） |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `{owner}.github.io` | DNS only |

⚠️ 橙云代理会与 GitHub 的 Let's Encrypt 签发冲突，首次必须灰云。

**证据**：`dig +short dunkangmao.com` 返回四条 185.199.x.x。

## 6. 等 HTTPS 证书并勾选 Enforce HTTPS

- 等 5-30 分钟，仓库 Settings → Pages 出现绿色 "DNS check successful"
- 勾选 **Enforce HTTPS**
- 访问 `https://dunkangmao.com` 与 `https://www.dunkangmao.com`

**证据**：浏览器 HTTPS 正常 + 证书有效截图。

## 7. 收尾更新

- 本文件第 8 节填执行记录
- `HANDOFF.md` 第 5 节更新为"已上线" + 证据链接
- 群里简报一行：域名 + 状态

## 8. 执行记录（谁做的谁填）

| 时间 | 步骤 | 执行人 | 结果/证据 |
|---|---|---|---|
| | | | |

---

## 附：出问题时找谁

- 构建/部署失败：小毛3号（技术质检）
- 方向取舍、要不要改配置：小毛4号（指挥）
- 授权、DNS、域名这类只有人能做：馆长
