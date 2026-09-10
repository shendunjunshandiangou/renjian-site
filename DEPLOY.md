# 部署 Runbook · dunkangmao.com

> 本地施工已完成。本文件记录从"授权 GitHub"到"域名生效"的完整步骤。
> 任何人（或 agent）拿到授权后按序执行即可。

## 前置状态（2026-09-11 核实）

- 本地站点：`/Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site/`，构建 14 页通过
- 域名：`dunkangmao.com`，NS = Cloudflare（`donald`/`blakely.ns.cloudflare.com`）
- 域名当前**无 A 记录**（空解析），等待指向
- GitHub：**未授权**（`gh` 未登录，OpenClaw GitHub 身份未连接）← 唯一卡点
- 已完成配置：`astro.config.mjs` site、`public/CNAME`、`public/robots.txt`、`.github/workflows/deploy.yml`

## 步骤 1：授权 GitHub

在 OpenClaw 控制台 **Settings → Agents → Tools → GitHub** 连接账号。
（或本地终端 `gh auth login`——任选其一）

## 步骤 2：建仓库并推送

```bash
cd /Users/macminim4/.openclaw/workspace-xiaomao3/renjian-site
gh repo create renjian-site --public --source=. --remote=origin --push
```

仓库名可改（如 `renjian-site` / `dunkangmao`），但需与下文 Pages URL 一致。

## 步骤 3：开启 GitHub Pages

```bash
gh api -X POST "repos/{owner}/renjian-site/pages" \
  -f "source[branch]=main" -f "source[path]=/" 2>/dev/null || true
```

若 API 方式不通，就在仓库 **Settings → Pages → Source** 选 **GitHub Actions**。
`deploy.yml` 会在每次推 main 时自动构建部署。

## 步骤 4：绑定域名（Cloudflare DNS）

GitHub Pages 自定义域设为 `dunkangmao.com` 后，到 Cloudflare DNS 加记录：

| 类型 | 名称 | 内容 | 代理状态 |
|---|---|---|---|
| A | `@` | `185.199.108.153` | **DNS only（灰云）** ← 首次必须关闭代理 |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |
| CNAME | `www` | `{owner}.github.io` | DNS only |

> ⚠️ Cloudflare 的橙色云（代理）会和 GitHub 的 Let's Encrypt 证书签发冲突，
> **首次验证必须设为灰云**；证书签发成功后再决定是否开回代理。

## 步骤 5：验证

```bash
# 等待 DNS 生效（数分钟到数小时）
dig +short @1.1.1.1 A dunkangmao.com
# 应返回 185.199.108-111.153 之一

curl -sI https://dunkangmao.com | head -5
# 应返回 HTTP/2 200
```

GitHub 仓库 **Settings → Pages** 里勾选 **Enforce HTTPS**（证书就绪后）。

## 已知注意点

- `public/CNAME` 内容为 `dunkangmao.com`，GitHub Pages 靠它识别自定义域——不要删
- Vite/Astro 的 `site` 已设为 `https://dunkangmao.com`，sitemap/RSS 的绝对链接才对
- 首次部署需在仓库 Settings → Pages 把 Source 改为 **GitHub Actions**（默认可能是 "Deploy from a branch"）
