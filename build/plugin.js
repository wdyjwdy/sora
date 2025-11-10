export default function plugin(md) {
  const defaultFence =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const code = md.utils.escapeHtml(tokens[idx].content);
    const lang = tokens[idx].info;

    if (lang === "mermaid") {
      const tmp = `<div class="mermaid">${code}</div>`;
      return `<pre><code class="language-mermaid">${tmp}</code></pre>`;
    }

    if (lang === "example") {
      const tmp = code.replace(
        /([^#]+)(#)(.+)/g,
        `<span class="text">$1</span><span class="comment">$3</span>`,
      );
      return `<pre><code class="language-example">${tmp}</code></pre>`;
    }

    if (lang === "tree") {
      const tmp = code.replace(/([─└├│])/g, `<span class="comment">$1</span>`);
      return `<pre><code class="language-tree">${tmp}</code></pre>`;
    }

    return defaultFence(tokens, idx, options, env, self);
  };
}
