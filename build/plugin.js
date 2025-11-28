import { generateSequenceDiagramSvg } from "./sequence-diagram";

export default function plugin(md) {
  const defaultFence =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const rawCode = tokens[idx].content;
    const code = md.utils.escapeHtml(rawCode);
    const lang = tokens[idx].info;

    if (lang === "mermaid") {
      const tmp = `<div class="mermaid">${code}</div>`;
      return `<pre><code class="language-mermaid">${tmp}</code></pre>`;
    } else if (lang === "example") {
      const tmp = code.replace(
        /([^#]+)(#)(.+)/g,
        `<span class="text">$1</span><span class="comment">$3</span>`,
      );
      return `<pre><code class="language-example">${tmp}</code></pre>`;
    } else if (lang === "tree") {
      const tmp = code.replace(/([─└├│])/g, `<span class="comment">$1</span>`);
      return `<pre><code class="language-tree">${tmp}</code></pre>`;
    } else if (lang === "color") {
      const tmp = code.replace(
        /@\[(\w+)\]\{([^}]*)\}/g,
        `<span style="color: $1">$2</span>`,
      );
      return `<pre><code class="language-color">${tmp}</code></pre>`;
    } else if (lang === "seq") {
      return generateSequenceDiagramSvg(rawCode);
    } else if (lang === "pre") {
      return `<div class="html-preview"><template shadowrootmode="open">${rawCode}</template></div>`;
    }
    return defaultFence(tokens, idx, options, env, self);
  };
}
