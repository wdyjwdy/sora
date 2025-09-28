import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { micromark } from "micromark";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";
import Handlebars from "handlebars";
import { parse } from "yaml";
import { highlight } from "./highlight";

const CONTENT = "content";
const TEMPLATE = "build/template.html";
const STATIC = "static";
const SITE = "site";

async function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---(.*?)---/s);
  return {
    frontmatter: match ? parse(match[1]) : {},
    content: match ? markdown.slice(match[0].length) : markdown,
  };
}

function getHighlight(markdown: string) {
  const regex = /<pre><code class="language-(.+?)">(.*?)<\/code><\/pre>/gs;
  return markdown.replace(regex, (_, lang, code) => {
    return `<pre><code class="language-${lang}">${highlight(code, lang)}</code></pre>`;
  });
}

async function renderFile(path: string) {
  // read a markdown file and parse frontmatter
  const contentFile = Bun.file(path);
  const contentText = await contentFile.text();
  const { frontmatter, content } = await parseFrontmatter(contentText);

  // render as html
  const contentHtml = micromark(content, {
    extensions: [gfmTable()],
    htmlExtensions: [gfmTableHtml()],
  });

  // render syntax highlight
  const highlightHtml = getHighlight(contentHtml);

  // apply a template
  const templateFile = Bun.file(TEMPLATE);
  const templateText = await templateFile.text();
  const templateFunc = Handlebars.compile(templateText);
  const templateHtml = templateFunc({ content: highlightHtml, ...frontmatter });

  // minify
  const minifiedHtml = minifyHtml.minify(Buffer.from(templateHtml), {});

  // save the file
  const suffix = path.endsWith("index.md") ? ".html" : "/index.html";
  const outputPath = path.replace(CONTENT, SITE).replace(".md", suffix);

  await Bun.write(outputPath, minifiedHtml);
}

async function render() {
  // get the path of markdown files
  const contentPaths = await readdir(CONTENT, {
    recursive: true,
    withFileTypes: true,
  });
  const markdownPaths = contentPaths
    .filter((path) => path.isFile())
    .map((path) => join(path.parentPath, path.name));

  // render markdown files
  await Promise.all(markdownPaths.map((path) => renderFile(path)));

  // get the path of static files
  const staticPaths = await readdir(STATIC, {
    recursive: true,
    withFileTypes: true,
  });
  const srcPaths = staticPaths
    .filter((path) => path.isFile())
    .map((path) => join(path.parentPath, path.name));

  // copy static files
  await Promise.all(
    srcPaths.map((path) => {
      const srcFile = Bun.file(path);
      return Bun.write(join(SITE, path), srcFile);
    }),
  );
}

async function renderAndLog() {
  const start = Bun.nanoseconds();
  await render();
  const end = Bun.nanoseconds();
  const time = ((end - start) / 1_000_000).toFixed();
  console.log(`\x1b[34m[sora]\x1b[0m build \x1b[37m${time}ms\x1b[0m`);
}

renderAndLog();

export { render, renderFile };
