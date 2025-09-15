// build-seo.ts
import {
  rmSync,
  cpSync,
  writeFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from 'fs';
import { resolve, join, basename } from 'path';
import puppeteer from 'puppeteer';
import express from 'express';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

/* ----------------------
   🧩 1. 統一設定區
----------------------- */
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const CONFIG = {
  port: 4173,
  distDir: resolve(__dirname, './dist'),
  wantDir: resolve(__dirname, './dist-seo'),
  viewDir: resolve(__dirname, './dist-seo-view'),
  langDir: resolve(__dirname, './src/locales'),
  excludeLocale: 'all',
  rootId: '#root',
  waitTimeout: 10000,
};

/* ----------------------
   🧹 2. 清理與初始化
----------------------- */
function prepareDirs() {
  if (existsSync(CONFIG.wantDir))
    rmSync(CONFIG.wantDir, { recursive: true, force: true });
  cpSync(CONFIG.distDir, CONFIG.wantDir, { recursive: true });

  if (existsSync(CONFIG.viewDir))
    rmSync(CONFIG.viewDir, { recursive: true, force: true });
  mkdirSync(CONFIG.viewDir);
}

/* ----------------------
   🧼 3. 集中管理清理規則
----------------------- */
function cleanDom(document) {
  // 移除所有 svg
  document.querySelectorAll('svg').forEach((el) => el.remove());

  // 移除指定 ID 或節點
  ['#_goober'].forEach((sel) =>
    document.querySelectorAll(sel).forEach((el) => el.remove())
  );

  ['.removeSEO'].forEach((sel) =>
    document.querySelectorAll(sel).forEach((el) => el.remove())
  );

  // 移除 data 屬性 (例如 data-rht-toaster)
  document.querySelectorAll('[data-rht-toaster]').forEach((el) => el.remove());

  // 移除自帶 class
  document.documentElement.removeAttribute('class');

  return document;
}

/* ----------------------
   🌐 4. 讀取語系清單
----------------------- */
function getLangKeys() {
  const files = readdirSync(CONFIG.langDir)
    .filter(
      (f) =>
        f.endsWith('.json') && basename(f, '.json') !== CONFIG.excludeLocale
    )
    .map((f) => basename(f, '.json'));

  return ['', ...files]; // '' 是預設語系
}

/* ----------------------
   🚀 5. 啟動伺服器並執行
----------------------- */
async function main() {
  prepareDirs();
  const langKeys = getLangKeys();

  const app = express();
  app.use(express.static(CONFIG.wantDir));

  const server = app.listen(CONFIG.port, async () => {
    console.log(`伺服器啟動: http://localhost:${CONFIG.port}`);

    const browser = await puppeteer.launch();

    for (const langKey of langKeys) {
      try {
        const url = langKey
          ? `http://localhost:${CONFIG.port}/?webLang=${langKey}`
          : `http://localhost:${CONFIG.port}/`;

        console.log(`\n🔹 開始處理語系: ${langKey || 'root'} → ${url}`);

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        await page.waitForFunction(
          (rootId) => {
            const root = document.querySelector(rootId);
            return root && root.innerHTML.trim().length > 0;
          },
          { timeout: CONFIG.waitTimeout },
          CONFIG.rootId
        );

        const fullHtml = await page.evaluate(
          () => document.documentElement.outerHTML
        );
        const objDom = new JSDOM(fullHtml);
        const document = cleanDom(objDom.window.document);

        // HTML 字串處理
        let htmlString = document.documentElement.outerHTML;
        if (langKey) {
          htmlString = htmlString
            .replace(/href="\//g, 'href="../')
            .replace(/src="\//g, 'src="../');
        }

        // 輸出 HTML
        const targetDir = langKey
          ? join(CONFIG.wantDir, langKey)
          : CONFIG.wantDir;
        if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
        writeFileSync(join(targetDir, 'index.html'), htmlString, 'utf-8');
        console.log(`✅ 寫入 ${langKey || 'root'}/index.html`);

        // 截圖
        const shotFile = join(
          CONFIG.viewDir,
          langKey ? `${langKey}.png` : 'root.png'
        );
        await page.screenshot({ path: shotFile, fullPage: true });
        console.log(`📸 截圖完成: ${shotFile}`);

        await page.close();
      } catch (err) {
        console.error(`❌ 處理 ${langKey || 'root'} 失敗:`, err);
      }
    }

    await browser.close();
    server.close();
    console.log('\n🎉 所有語系處理完成！');
  });
}

main().catch((err) => {
  console.error('⛔️ 發生重大錯誤:', err);
  process.exit(1);
});
