import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import sanitizeFilename from 'sanitize-filename';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const baseUrl = 'https://www.luogu.com.cn/problem/';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchPage = async (problemId, difficulty) => {
    // const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch()
    var context = await browser.defaultBrowserContext();
    await context.overridePermissions('https://www.luogu.com.cn', ['clipboard-read']);
    const page = await browser.newPage();

    try {
        if (!problemId.includes('P')) problemId = "P" + problemId;
        if (problemId.includes('B')) {
            problemId = problemId.replace('P', '');
        }
        const url = `${baseUrl}${problemId}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await delay(2 * 1000)

        // 点击复制 Markdown 按钮
        const elements = await page.$$('.color-default');
        if (elements.length >= 5) {
            await elements[5].click(); // 第五个元素的索引为 4，因为索引从 0 开始
        } else {
            console.error('There are not enough elements with class .color-default on the page.');
        }

        // 获取剪贴板内容
        const clipboardContent = await page.evaluate(() => {
            return navigator.clipboard.readText();
        });



        // 获取标题 h1 的文本内容
        const titleText = await page.evaluate(() => {
            const h1Element = document.querySelector('h1.lfe-h1 span');
            return h1Element.textContent.trim();
        });

        // 使用sanitize-filename模块确保文件名合法
        let sanitizedFilename = sanitizeFilename(titleText, { replacement: '_' });
        const folderPath = path.join(__dirname, knowledgeDir, difficulty);

        if (!sanitizedFilename.includes(problemId)) sanitizedFilename = `${problemId}${sanitizedFilename}`
        // 写入 Markdown 文件，使用 h1 标签的内容作为文件名
        const filename = `${sanitizedFilename}.md`;

        const filePath = path.join(folderPath, filename);

        // 创建文件夹（如果不存在）
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // 写入 Markdown 文件
        fs.writeFileSync(filePath, clipboardContent.trim());
        console.log(`Downloaded ${url} to ${filename}`);
    } catch (error) {
        console.error(`Error fetching and converting ${problemId}:`, error);
    } finally {
        await browser.close();
    }
};

const knowledgeDir = '树型结构';

const problemIds = {
    'T1': [],
    'T2': ["1827", "B3642", "1087", "1030",],
    'T3': ["1229", "2171", "2052",],
    'T4': ["8815", "2441", "5018", "7073"]
};

const difficultyLevels = ['T1', 'T2', 'T3', 'T4']; // 难度级别

const main = async () => {
    for (const difficulty of difficultyLevels) {
        const problemList = problemIds[difficulty];
        for (const problemId of problemList) {
            await fetchPage(problemId, difficulty);
        }
    }
};

main();

