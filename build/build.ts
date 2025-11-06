import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";
import Handlebars from "handlebars";
import { parse } from "yaml";
import { highlight } from "./highlight";
import config from "./config";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItTOC from "markdown-it-table-of-contents";

const mdit = MarkdownIt({ highlight })
  .use(MarkdownItAnchor)
  .use(MarkdownItTOC, { includeLevel: [2, 3] });

// 初始化搜索
const pages: Array<{
  url: string;
  title: string;
  category: string;
  alias?: string[];
}> = [];
const categories = new Set<string>();
const contentPaths = await getFilenames(config.contentPath);
for (let path of contentPaths) {
  if (!path.endsWith(".md")) continue;
  const url = path.slice(8, -3);
  const { frontmatter } = await parseContent(path);
  const { title, category, alias } = frontmatter;
  pages.push({ url, title, category, alias });
  categories.add(category);
}
pages.sort((a, b) => (a.category < b.category ? 1 : -1));

// 初始化模版
const templateFile = Bun.file(config.templatePath);
const templateText = await templateFile.text();
const templateFunc = Handlebars.compile(templateText);
Handlebars.registerHelper("pages", function () {
  return JSON.stringify(pages);
});
Handlebars.registerHelper("categories", function (options) {
  return [...categories]
    .sort()
    .map((i) => options.fn(i))
    .join("");
});

// 热重载脚本
const liveReloadScriptFile = Bun.file("build/liveload.html");
const liveReloadScriptText = await liveReloadScriptFile.text();

function addReloadScript(html: string) {
  return html + liveReloadScriptText;
}

function addToc(markdown: string) {
  return "[[toc]]\n" + markdown;
}

async function parseContent(path: string) {
  const file = Bun.file(path);
  const text = await file.text();
  const match = text.match(/^---(.*?)---/s);
  return {
    frontmatter: match ? parse(match[1]) : {},
    markdown: match ? text.slice(match[0].length) : text,
  };
}

function getHtml(markdown: string) {
  return mdit.render(markdown);
}

function addTemplate(html: string, frontmatter: Object) {
  return templateFunc({ content: html, ...frontmatter });
}

function addPrefix(html: string) {
  return html.replace(/(?<=img src=")(.+?)(?=")/g, "/sora/static/imgs/$1.svg");
}

function minify(html: string) {
  return minifyHtml.minify(Buffer.from(html), {});
}

async function buildContentFile(path: string, serve: boolean) {
  if (path.endsWith("index.html")) {
    const file = Bun.file(path);
    const text = await file.text();
    const html = Handlebars.compile(text)({});
    await Bun.write(config.outputPath + "/index.html", minify(addPrefix(html)));
    return;
  }
  let { frontmatter, markdown } = await parseContent(path);
  if (frontmatter.toc) markdown = addToc(markdown);
  let html = getHtml(markdown);
  if (serve) html = addReloadScript(html);
  html = addTemplate(html, frontmatter);
  html = addPrefix(html);

  // save the file
  const outputPath = path
    .replace(config.contentPath, config.outputPath)
    .replace(".md", ".html");
  await Bun.write(outputPath, minify(html));
}

async function buildStaticFile(path: string) {
  const file = Bun.file(path);
  const outputPath = join(config.outputPath, path);
  Bun.write(outputPath, file);
}

async function getFilenames(path: string) {
  const paths = await readdir(path, {
    recursive: true,
    withFileTypes: true,
  });
  return paths
    .filter((path) => path.isFile())
    .map((path) => join(path.parentPath, path.name));
}

async function build(serve: boolean = false) {
  const contentPaths = await getFilenames(config.contentPath);
  await Promise.all(contentPaths.map((path) => buildContentFile(path, serve)));

  const staticPaths = await getFilenames(config.staticPath);
  await Promise.all(staticPaths.map((path) => buildStaticFile(path)));
}

async function log(serve: boolean = false) {
  const start = Bun.nanoseconds();
  await build(serve);
  const end = Bun.nanoseconds();
  const time = ((end - start) / 1_000_000).toFixed();
  console.log(`\x1b[34m[sora]\x1b[0m build \x1b[37m${time}ms\x1b[0m`);
}

await log();

export { log, buildContentFile, buildStaticFile };
