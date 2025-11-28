---
title: CSS
category: Handwrite
toc: true
---

## 三列布局

```pre
<div class="container">
  <div class="left">left</div>
  <div class="center">center</div>
  <div class="right">right</div>
</div>
<style>
.container {
  width: 400px;
  border: 1px solid lightgray;
  border-radius: 20px;
  display: flex;
  gap: 10px;
  padding: 10px;
  max-width: calc(100% - 20px);
}
.left,.center,.right {
  width: 60px;
  height: 60px;
  border: 1px solid lightgray;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
}
.left,.right {
  width: 70px
}
.center {
  flex: 1;
}
</style>
```

- Flex

  ```css
  .container {
    display: flex;
  }
  .left,
  .right {
    width: 100px;
  }
  .center {
    flex: 1;
  }
  ```

- Grid

  ```css
  .container {
    display: grid;
    grid-template-columns: 100px auto 100px;
  }
  ```

## 水平垂直居中

```pre
<div class="container">
  <div class="item">item</div>
</div>
<style>
.container {
  width: 400px;
  border: 1px solid lightgray;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  max-width: calc(100% - 20px);
}
.item {
  width: 60px;
  height: 60px;
  border: 1px solid lightgray;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
}
</style>
```

- Flex

  ```css
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ```

- Grid

  ```css
  .container {
    display: grid;
    place-items: center;
  }
  ```

## 导航栏

```pre
<div class="container">
  <div class="A">A</div>
  <div class="B">B</div>
  <div class="C">C</div>
  <div class="D">D</div>
  <div class="E">E</div>
</div>
<style>
.container {
  width: 400px;
  border: 1px solid lightgray;
  border-radius: 20px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
  padding: 10px;
  max-width: calc(100% - 20px);
}
.A,.B,.C,.D,.E {
  width: 60px;
  height: 60px;
  border: 1px solid lightgray;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: monospace;
}
.D {
margin-left: auto;
}
</style>
```

- Flex

  ```css
  .container {
    display: flex;
  }
  .D {
    margin-left: auto; /* 填充剩余空间 */
  }
  ```

## 明暗主题

- Media Query and CSS Variables

  ```css
  :root {
    --bg: white;
    @media (prefers-color-scheme: dark) {
      --bg: black;
    }
  }

  html {
    background-color: var(--bg);
  }
  ```

- light-dark()

  ```css
  :root {
    color-scheme: light dark;
  }

  html {
    background-color: light-dark(white, black);
  }
  ```
