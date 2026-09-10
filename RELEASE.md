# 发布执行单 · dunkangmao.com

> 状态：**待授权**。本单为「授权后发布」的逐步执行清单，每步都有验收点。
> 对应 HANDOFF.md 第 4 节（部署）与第 5 节（看板）。
> 原则：未授权前只做只读核验，不反复改代码。

---

## 前置核验（已完成 · 只读）

| 项 | 结果 |
|---|---|
| 本地分支 | `master`（唯一分支，无 remote）|
| HEAD | `e60e696` |
| 工作区 | 干净（无未跟踪/未提交）|
| 提交数 | 8 个，步骤 1–10 全绿 |
| 构建 | 14 页通过 |
| GitHub 连接 | ❌ 未授权（`gh` 未登录，无 GH 环境变量）← **唯一阻塞** |
| 域名 NS | Cloudflare（`donald` / `blakely.ns.cloudflare.com`）|
| 域名 A 记录 | 暂无（空解析，等待指向）|
| 发布基建 | `astro.config.mjs` site ✅ / `public/CNAME` ✅ / `robots.txt` ✅ / `deploy.yml` ✅ |
| workflow 触发分支 | 已修为 `[master, main]`（原仅 main，与本地 master 不匹配会不触发）|

---

## ① 确认 GitHub 连接可用

**动作**：二选一
- OpenClaw 控制台 → **Settings → Agents → Tools → GitHub** 连接；或
- 本地终端 `gh auth login`（选 GitHub.com → HTTPS → 浏览器登录）

**验收**：`gh auth status` 显示已登录，且 `gh api user -q .login` 返回账号名。

---

## ② 创建/确认仓库并推送 master

```bash
cd /Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site
gh repo create renjian-site --public --source=. --remote=origin --push
```

**验收**：`gh repo view --json url,defaultBranchRef` 返回仓库地址，且默认分支为 `master`（推送后 GitHub 会自动设为默认分支）。

> 仓库名若改动（如 `dunkangmao`），需同步第 ⑤ 步与 `DEPLOY.md`。

---

## ③ Pages Source 设为 GitHub Actions，确认 workflow 成功

```bash
# 开启 Pages（Actions 构建模式）
gh api -X POST "repos/{owner}/renjian-site/pages" -f "build_type=workflow" 2>/dev/null || true
# 查看 workflow 运行
gh run list --limit 3
gh run watch $(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
```

若 API 方式不通：仓库 **Settings → Pages → Source** 选 **GitHub Actions**。

**验收**：`gh run list` 最新一次为 `completed / success`；仓库 Settings→Pages 显示站点 URL。

---

## ④ 配置 DNS（四条 A + www CNAME）

在 Cloudflare DNS 添加：

| 类型 | 名称 | 内容 | 代理 |
|---|---|---|---|
| A | `@` | `185.199.108.153` | **DNS only（灰云）** |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `{owner}.github.io` | DNS only |

> ⚠️ 首次必须**灰云（DNS only）**：橙色云代理会与 GitHub 的 Let's Encrypt 证书签发冲突。证书签发成功后可再决定是否开代理。

**验收**：`dig +short @1.1.1.1 A dunkangmao.com` 返回 `185.199.108-111.153` 之一。

---

## ⑤ 填写 Custom domain 并验证 HTTPS

```bash
gh api -X PUT "repos/{owner}/renjian-site/pages" -f "cname=dunkangmao.com"
```

GitHub 会读取 `public/CNAME` 并签发证书。**验收**：

```bash
curl -sI https://dunkangmao.com | head -3     # 期望 HTTP/2 200
curl -sI https://www.dunkangmao.com | head -3 # 期望 301 → 主域
```

再到 Settings→Pages 勾选 **Enforce HTTPS**。

---

## ⑥ 更新 HANDOFF 第 5 节

在 HANDOFF.md 第 5 节补一行发布结果：仓库地址 / Actions 运行地址 / 线上地址 / 构建结果。

**验收**：HANDOFF 第 5 节含可点击的仓库、Actions、线上三地址。

---

## 附：风险与回滚

- **DNS 改错**：Cloudflare 改记录即可回退，无破坏性
- **部署失败**：`gh run view <id> --log-failed` 看日志；本地 `npm run build` 已保底 14 页通过
- **证书不签发**：99% 是橙色云代理；改灰云后重新签发
- **回滚**：`git revert <commit>` 后 push，workflow 自动重部署
