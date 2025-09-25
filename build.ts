import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { micromark } from "micromark";
import { frontmatter, frontmatterHtml } from "micromark-extension-frontmatter";
import { gfmTable, gfmTableHtml } from "micromark-extension-gfm-table";
import { Buffer } from "node:buffer";
import minifyHtml from "@minify-html/node";

const CONTENT = "content";
const TEMPLATE = "template.html";
const STATIC = "static";
const SITE = "site";

async function renderFile(path: string) {
  // read a markdown file
  const contentFile = Bun.file(path);
  const contentText = await contentFile.text();

  // render as html
  const contentHtml = micromark(contentText, {
    extensions: [frontmatter(), gfmTable()],
    htmlExtensions: [frontmatterHtml(), gfmTableHtml()],
  });

  // apply a template
  const templateFile = Bun.file(TEMPLATE);
  const templateText = await templateFile.text();
  const templateHtml = templateText.replace("{{ content }}", contentHtml);

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
  // const contentPaths = await readdir(CONTENT, { recursive: true });
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
