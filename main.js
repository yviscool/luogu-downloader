// crawler.mjs
import rp from 'request-promise';
import cheerio from 'cheerio';
import fs from 'fs';

const url = 'https://www.luogu.com.cn/problem/P9094';

const fetchPage = async () => {
    try {
        const html = await rp(url);
        const $ = cheerio.load(html);
        const articleHtml = $('article').html();

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
            .replace(divRegex, '$1\n')
            .replace(h1Regex, '# $1\n')
            .replace(h2Regex, '## $1\n')
            .replace(h3Regex, '### $1\n')
            .replace(h4Regex, '#### $1\n')
            .replace(preCodeRegex, '```\n$1\n```\n')
            .replace(codeRegex, '`$1`\n')
            .replace(brRegex, '\n');

        // 去除首尾空白并写入 Markdown 文件
        fs.writeFileSync('output.md', markdown.trim());
    } catch (error) {
        console.error('Error fetching and converting:', error);
    }
};

fetchPage();
