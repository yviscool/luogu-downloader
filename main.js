// crawler.mjs
import rp from 'request-promise';
import cheerio from 'cheerio';
import fs from 'fs';
import sanitizeFilename from 'sanitize-filename';

const baseUrl = 'https://www.luogu.com.cn/problem/';

const fetchPage = async (problemId) => {
    try {
        const url = `${baseUrl}${problemId}`;
        const html = await rp(url);
        const $ = cheerio.load(html);
        const articleHtml = $('article').html();
        const h1 = $('h1').first().text().trim(); // 获取第一个 <h1> 标签的内容作为文件名

        // 定义正则表达式来匹配不同的 HTML 标签
        const h1Regex = /<h1>(.*?)<\/h1>\s*/g;
        const h2Regex = /<h2>(.*?)<\/h2>\s*/g;
        const h3Regex = /<h3>(.*?)<\/h3>\s*/g;
        const h4Regex = /<h4>(.*?)<\/h4>\s*/g;
        const preCodeRegex = /<pre><code>(.*?)<\/code><\/pre>\s*/gs;
        const codeRegex = /<code>(.*?)<\/code>\s*/g;
        const divRegex = /<div>(.*?)<\/div>\s*/gs;
        const brRegex = /<br>\s*/g;

        // 将匹配到的标签替换为 Markdown 对应的格式
        const markdown = articleHtml
            .replace(h1Regex, '# $1\n')
            .replace(h2Regex, '## $1\n')
            .replace(h3Regex, '### $1\n')
            .replace(h4Regex, '#### $1\n')
            .replace(preCodeRegex, '```\n$1\n```\n')
            .replace(codeRegex, '`$1`\n')
            .replace(divRegex, '$1\n')
            .replace(brRegex, '\n');

        // 使用sanitize-filename模块确保文件名合法
        let sanitizedFilename = sanitizeFilename(h1, { replacement: '_' });

        if (!sanitizedFilename.includes(problemId)) sanitizedFilename = `${problemId}${sanitizedFilename}`
        // 写入 Markdown 文件，使用 h1 标签的内容作为文件名
        const filename = `${sanitizedFilename}.md`;
        fs.writeFileSync(filename, markdown.trim());
        console.log(`Downloaded ${url} to ${filename}`);
    } catch (error) {
        console.error(`Error fetching and converting ${problemId}:`, error);
    }
};

// 问题 ID 列表
const problemIds = [
    'P9094',
    'P1996'
]; 

// 批量下载
problemIds.forEach((problemId) => {
    fetchPage(problemId);
});
