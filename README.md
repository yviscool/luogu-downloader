# Luogu Problem Downloader

这个项目提供了一个简单的 Node.js 脚本，用于从洛谷（Luogu）网站下载题目并生成 Markdown 格式的文件。

## 功能

- 从洛谷网站下载指定题目的 HTML 内容。
- 将 HTML 内容转换为 Markdown 格式，并保存到本地文件中。

## 使用方法

1. 安装 Node.js（如果尚未安装）。
2. 克隆或下载此项目到本地。
3. 在命令行中进入项目目录。
4. 运行以下命令安装项目依赖：

```bash
npm install
```

5. 在 `luogu_md_downloader.js` 文件中修改 `url` 变量为你想要下载的洛谷题目的网址。
6. 运行脚本：

```bash
node luogu_md_downloader.js
```

7. 在项目根目录下会生成一个名为 `output.md` 的 Markdown 文件，其中包含了从洛谷网站下载的题目内容。

## 注意事项

- 请确保你的网络连接正常，能够访问洛谷网站。
- 如果脚本运行出错，请检查网络连接和输入的网址是否正确。

## 示例

下面是一个从洛谷网站下载的题目的 Markdown 文件示例：

```markdown
# [CSP-J2019] 公交换乘

## 题目描述

著名旅游城市 B 市为了鼓励大家采用公共交通方式出行，推出了一种地铁换乘公交车的优惠方案：
...
```

## 作者

本项目由 [Y.V] 开发。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。详细信息请参阅 [LICENSE 文件](LICENSE)。

---

你可以根据实际情况修改和补充各个部分，以适应你的项目和需求。
