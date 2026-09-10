// @ts-check
import { defineConfig } from 'astro/config';

// 部署模式：
//  - 生产（默认，无环境变量）：Cloudflare Pages 根路径 + 自定义域 https://dunkangmao.com，无 base。
//  - 预览：GitHub Pages 项目页 /renjian-site/，由 CI 注入 PAGES_BASE / PAGES_SITE 启用。
// 站内链接统一走 src/consts.ts 的 url() 助手，故两种模式共用同一份源码。
const env = process.env;

export default defineConfig({
  site: env.PAGES_SITE?.trim() || 'https://dunkangmao.com',
  base: env.PAGES_BASE?.trim() || undefined,
});
