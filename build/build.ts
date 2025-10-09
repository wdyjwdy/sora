import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";
import Handlebars from "handlebars";
import { parse } from "yaml";
import { highlight } from "./highlight";
import config from "./config";

const templateFile = Bun.file(config.templatePath);
const templateText = await templateFile.text();
const templateFunc = Handlebars.compile(templateText);
const pages: Array<{ url: string; title: string; category: string }> = [];
const contentPaths = await getFilenames(config.contentPath);
for (let path of contentPaths) {
  const url = path.replace(config.contentPath, "/").replace(".md", "");
  const { frontmatter } = await parseContent(path);
  pages.push({ url, ...frontmatter });
}
Handlebars.registerHelper("pages", function () {
  return JSON.stringify(pages);
});
Handlebars.registerHelper("categories", function (options) {
  const categories = [
    ...new Set(pages.map((p) => p.category).filter((x) => x)),
  ];
  return categories.map((i) => options.fn(i)).join("");
});

function addToc(markdown: string, frontmatter: any) {
  if (!frontmatter?.toc) return markdown;

  const match = markdown.match(/(#{2,3}) (.*)/g);
  if (!match) return markdown;

  const toc = [];
  for (let val of match) {
    const [level, heading] = val.split(/(?<=#) /);
    if (level === "###") toc.push("  ");
    const id = heading.replaceAll(" ", "-");
    toc.push(`- [${heading}](#${id})\n`);
  }
  return toc.join("") + markdown;
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
  return micromark(markdown, {
    extensions: [gfmTable()],
    htmlExtensions: [gfmTableHtml()],
  });
}

function addHighlight(html: string) {
  const regex = /<pre><code class="language-(.+?)">(.*?)<\/code><\/pre>/gs;
  return html.replace(regex, (_, lang, code) => {
    return `<pre><code class="language-${lang}">${highlight(code, lang)}</code></pre>`;
  });
}

function addTemplate(html: string, frontmatter: Object) {
  return templateFunc({ content: html, ...frontmatter });
}

function addPrefix(html: string) {
  return html.replace(/(href|src)="\//g, '$1="/sora/');
}

function addId(html: string) {
  return html.replace(/<h([2-3])>(.*?)<\/h\1>/g, (_, level, text) => {
    const id = text.replaceAll(" ", "-");
    return `<h${level} id=${id}>${text}</h${level}>`;
  });
}

function minify(html: string) {
  return minifyHtml.minify(Buffer.from(html), {});
}

async function buildContentFile(path: string) {
  if (path.endsWith("index.html")) {
    const file = Bun.file(path);
    const text = await file.text();
    const html = Handlebars.compile(text)({});
    await Bun.write(config.outputPath + "/index.html", minify(addPrefix(html)));
    return;
  }
  let { frontmatter, markdown } = await parseContent(path);
  markdown = addToc(markdown, frontmatter);
  let html = getHtml(markdown);
  html = addHighlight(html);
  html = addTemplate(html, frontmatter);
  html = addPrefix(html);
  html = addId(html);

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

async function build() {
  const contentPaths = await getFilenames(config.contentPath);
  await Promise.all(contentPaths.map((path) => buildContentFile(path)));

  const staticPaths = await getFilenames(config.staticPath);
  await Promise.all(staticPaths.map((path) => buildStaticFile(path)));
}

async function log() {
  const start = Bun.nanoseconds();
  await build();
  const end = Bun.nanoseconds();
  const time = ((end - start) / 1_000_000).toFixed();
  console.log(`\x1b[34m[sora]\x1b[0m build \x1b[37m${time}ms\x1b[0m`);
}

log();
