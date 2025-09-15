import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 取得當前檔案目錄
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 網站根 URL
const BASE_URL = 'https://bykeon.com';

// 目錄與 sitemap 路徑
const WANT_DIR = path.resolve(__dirname, 'dist-seo');
const WANT_XML = path.resolve(WANT_DIR, 'sitemap.xml');

// 優先權與更新頻率
const HOME_PRIORITY = '1.0';
const HOME_CHANGEFREQ = 'weekly';
const PAGE_PRIORITY = '0.8';
const PAGE_CHANGEFREQ = 'weekly';

// 生成 sitemap XML 字串
function buildSitemap(urls) {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach((u) => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${u.loc}</loc>\n`;
    sitemap += `    <changefreq>${u.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${u.priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });

  sitemap += `</urlset>\n`;
  return sitemap;
}

// 掃描語系資料夾
function getSubdomains(dir) {
  return fs.readdirSync(dir).filter((sub) => {
    const subPath = path.join(dir, sub);
    return (
      fs.statSync(subPath).isDirectory() &&
      fs.existsSync(path.join(subPath, 'index.html'))
    );
  });
}

// 主程式
function main() {
  const urls = [];

  // 主站首頁
  urls.push({
    loc: `${BASE_URL}/`,
    changefreq: HOME_CHANGEFREQ,
    priority: HOME_PRIORITY,
  });

  // 語系首頁
  const subdomains = getSubdomains(WANT_DIR);
  subdomains.forEach((sd) => {
    urls.push({
      loc: `${BASE_URL}/${sd}/`,
      changefreq: PAGE_CHANGEFREQ,
      priority: PAGE_PRIORITY,
    });
  });

  // 生成 sitemap.xml
  const sitemapContent = buildSitemap(urls);
  fs.writeFileSync(WANT_XML, sitemapContent, 'utf8');
  console.log(`✅ Sitemap 已生成：${WANT_XML}`);
}

main();
