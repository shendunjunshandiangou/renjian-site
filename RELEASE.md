# 发布执行单 · dunkangmao.com

> 状态：**代码部分已部署上线，域名绑定待馆长批准**。本单为「绑定 dunkangmao.com」的逐步执行清单，每步都有验收点。
> 对应 HANDOFF.md 第 4 节（部署）与第 5 节（看板）。
> 原则：冻结代码，只解部署/域名阻塞；不碰设计、不碰业务代码。

---

## 前置核验（已完成 · 只读）

| 项 | 结果 |
|---|---|
| 本地分支 | `master`（已设 origin）|
| HEAD | `521cd03` |
| 工作区 | 干净（无未跟踪/未提交）|
| 提交数 | 11 个，步骤 1–10 全绿 |
| 构建 | 14 页通过 |
| GitHub 连接 | ✅ 已授权（`shendunjunshandiangou`，scopes `gist, read:org, repo, workflow`）|
| 仓库 | ✅ https://github.com/shendunjunshandiangou/renjian-site （public，默认分支 master）|
| Pages | ✅ 已启用（`build_type=workflow`），Actions 3 次运行全 success |
| 线上地址 | ✅ https://shendunjunshandiangou.github.io/renjian-site/ （HTTP 200）|
| 域名 NS | Cloudflare（`donald` / `blakely.ns.cloudflare.com`）|
| 域名 A 记录 | 暂无（空解析，等待指向）|
| 发布基建 | `astro.config.mjs` site ✅ / `public/CNAME` ✅ / `robots.txt` ✅ / `deploy.yml` ✅ |
| workflow 触发分支 | `[master, main]` |
| **当前卡点** | 域名绑定（第 ④–⑦ 步）需馆长人工批准与操作 |

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

> 仓库名若改动，需同步第 ⑥ 步的 `www` CNAME 目标与 `DEPLOY.md`。

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

## ④（可选但强烈建议）先在账号层验证域名 dunkangmao.com

> 官方依据：<https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
> （官方原文：*"We recommend verifying your custom domain prior to adding it to your repository, in order to improve security and avoid takeover attacks."*）

**动作**：账号 **Settings → Pages → Add a domain** → 输入 `dunkangmao.com` → 按提示到 Cloudflare 添加一条 **TXT** 验证记录（`_github-pages-challenge-{owner}.dunkangmao.com`）→ 回 GitHub 点 **Verify**。

**验收**：Settings → Pages 显示 `dunkangmao.com` 已验证 / verified。
**理由**：不先验证，若日后 DNS 指向失效，他人可能抢注你的子域（takeover）。

---

## ⑤ 仓库 Settings → Pages 设置 Custom domain = dunkangmao.com

> ⚠️ **顺序关键**：必须在配置 DNS **之前**把 Custom domain 加到 GitHub。
> 官方原文：*"Make sure you add your custom domain to your GitHub Pages site before configuring your custom domain with your DNS provider. Configuring your custom domain with your DNS provider without adding your custom domain to GitHub could result in someone else being able to host a site on one of your subdomains."*

```bash
gh api -X PUT "repos/shendunjunshandiangou/renjian-site/pages" -f "cname=dunkangmao.com"
```

或在仓库 **Settings → Pages → Custom domain** 填 `dunkangmao.com` 并 Save。
`public/CNAME` 已是 `dunkangmao.com`，GitHub 会读取它。

**验收**：`gh api repos/shendunjunshandiangou/renjian-site/pages -q .cname` 返回 `dunkangmao.com`。

---

## ⑥ 配置 Cloudflare DNS（四条 A + www CNAME）

在 Cloudflare DNS 添加：

| 类型 | 名称 | 内容 | 代理 |
|---|---|---|---|
| A | `@` | `185.199.108.153` | **DNS only（灰云）** |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `shendunjunshandiangou.github.io` | DNS only |

> ⚠️ 首次必须**灰云（DNS only）**：橙色云代理会与 GitHub 的 Let's Encrypt 证书签发冲突。证书签发成功后可再决定是否开代理。

**验收**：`dig +short @1.1.1.1 A dunkangmao.com` 返回 `185.199.108-111.153` 之一。

---

## ⑦ 等待 DNS/证书并复验 HTTPS

- DNS 变更最长可能需 24 小时传播；仓库 Settings → Pages 出现绿色 "DNS check successful" 后等待证书签发（通常 5–30 分钟）
- 勾选 **Enforce HTTPS**

**验收**：

```bash
curl -sI https://dunkangmao.com | head -3      # 期望 HTTP/2 200
curl -sI https://www.dunkangmao.com | head -3  # 期望 301 → 主域
```

---

## ⑧ 更新 HANDOFF 第 5 节

在 HANDOFF.md 第 5 节补一行发布结果：仓库地址 / Actions 运行地址 / 线上地址 / 构建结果。

**验收**：HANDOFF 第 5 节含可点击的仓库、Actions、线上三地址。

---

## 附：风险与回滚

- **DNS 改错**：Cloudflare 改记录即可回退，无破坏性
- **部署失败**：`gh run view <id> --log-failed` 看日志；本地 `npm run build` 已保底 14 页通过
- **证书不签发**：99% 是橙色云代理；改灰云后重新签发
- **回滚**：`git revert <commit>` 后 push，workflow 自动重部署
