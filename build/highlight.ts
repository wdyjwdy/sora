const langs: Record<string, Record<string, RegExp>> = {
  css: {
    selector: /(\S+?)(?=[ {,]+)/gs,
    property: /([a-z-]+)(?=:)/g,
    comment: /(\/\*.+\*\/)/g,
  },
  example: {
    comment: /(#.+)/g,
    sharp: /(#)/g,
  },
};

function highlight(html: string, lang: string) {
  if (lang === "mermaid") {
    return `<div class="mermaid">${html}</div>`;
  }
  if (!Object.hasOwn(langs, lang)) {
    return html;
  }

  let result = html;
  for (const [name, regex] of Object.entries(langs[lang])) {
    result = result.replace(regex, `<span class="${name}">$1</span>`);
  }
  return result;
}

export { highlight };
