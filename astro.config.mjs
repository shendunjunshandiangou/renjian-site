// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// 部署方式：GitHub Pages 项目页（子路径 /renjian-site/）。
// site  = 站点绝对源（sitemap / RSS / canonical 用）
// base  = 子路径前缀（Astro 会自动给 _astro 资产加前缀；源码内链用 consts 的 url() 助手加前缀）
// 将来切换到自定义域名时：site 改回域名、删掉 base、并在 public/ 放回 CNAME。
export default defineConfig({
  site: 'https://shendunjunshandiangou.github.io',
  base: '/renjian-site/',
});
