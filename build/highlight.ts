const langs: Record<string, Record<string, RegExp>> = {
  css: {
    selector: /(\S+)(?= {)/g,
    property: /(?<= )([a-z-]+)(?=:)/g,
    comment: /(\/\*.+\*\/)/g,
  },
  example: {
    comment: /(?<=#)(.+)/g,
    sharp: /(#)/g,
  },
  tree: {
    comment: /([─└├])/g,
  },
  diff: {
    insert: /(^\+ .+)/gm,
    delete: /(^- .+)/gm,
  },
  js: {
    keyword:
      /\b(const|let|function|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|class|extends|new|import|from|export|default|async|await)\b/g,
    comment: /(\/\/.*)/g,
    function: /(\w+)(?=\()/g,
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
