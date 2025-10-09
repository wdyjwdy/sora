---
title: HTML
category: Basic
toc: true
---

## Head

提供页面的元数据。

- title

  ```html
  // 网页标题 <title>MDN</title>
  ```

- meta

  ```html
  // 字符集
  <meta charset="utf-8" />

  // 自定义元数据
  <meta name="description" content="The MDN Web Docs" /> {/* 用于SEO */}
  <meta property="og:image" content="mdn.png" /> {/* 用于 Facebook 分享 */}
  <meta name="twitter:title" content="MDN" /> {/* 用于 Twitter 分享 */}
  ```

- link

  ```html
  // 网页图标
  <link rel="icon" href="favicon.ico" />

  // 加载资源
  <link rel="stylesheet" href="index.css" />
  <script src="index.js" defer></script>
  ```
