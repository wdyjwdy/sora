---
title: Solid
category: Library
toc: true
---

## 状态管理

### createSignal

```jsx
function Counter() {
  const [count, setCount] = createSignal(0); // 初始化

  function handleClick() {
    setCount(count() + 1); // 传递新值
    setCount((c) => c + 1); // 传递更新函数
  }

  return (
    <>
      <p>{count()}</p> {/* 当状态变化时更新 */}
      <button onClick={handleClick}>add</button>
    </>
  );
}
```

## 组件传值

### props

```jsx
function Parent() {
  return <Child name="Eden" />;
}

function Child(props) {
  return <p>{props.name}</p>;
}
```

如何解构 props

```jsx
function Child(props) {
  const { name } = props; // ❌ 会打破响应性
  const name = props.name; // ❌ 会打破响应性
  props.name(); // ✅
  const name = () => props.name; // ✅
}
```

## 条件渲染

### 三元运算符（不推荐）

```jsx
loading() ? <p>loading</p> : <p>done</p>;
```

### Show

```jsx
<Show when={!loading()} fallback={<p>loading</p>}>
  <p>done</p>
</Show>
```

### Switch

```jsx
<Switch fallback={<p>fallback</p>}>
  <Match when={cond1}>
    <p>1</p>
  </Match>
  <Match when={cond2}>
    <p>2</p>
  </Match>
</Switch>
```

### Dynamic

```jsx
const options = {
  cond1: <p>1</p>,
  cond2: <p>2</p>,
};

<Dynamic component={options[selected()]} />;
```

## 列表渲染

### For

用于顺序、长度变化的列表。其中 `index` 是一个 Singal。

```jsx
<For each={data()}>
  {(value, index) => (
    // ...
  )}
</For>
```

### Index

用于顺序、长度不变，内容变化的列表。其中 `value` 是一个 Singal。

```jsx
<Index each={data()}>
  {(value, index) => (
    // ...
  )}
</Index>
```

### map

用于静态列表。

```jsx
data().map((value, index) => {
  // ...
});
```

## 类属性

### class

```jsx
<div class="navbar"></div>
```

### classList

{% raw %}

```jsx
<div classList={{ highlight: true, selected: false }}></div>
// 等价于
<div class="highlight"></div>
```

{% endraw %}

## 生命周期

```jsx
function Counter() {
  const [count, setCount] = createSignal(0);
  console.log(count());

  return <button onClick={() => setCount((p) => p + 1)}>{count()}</button>;
}
```

- created

  初始化逻辑只执行一次（整个 Count 函数，包括 `createSignal`, `console.log`, `return`）。

- updated

  响应式逻辑会在状态更新后执行（比如 `createSignal`）。

- destroyed

## 事件处理

1. 绑定事件（绑定到 document）

   ```jsx
   // 委托事件，事件被绑定到文档。
   <p onClick={handleClick} />

   // 原生事件，事件被绑定到元素。
   <p on:click={handleClick} />
   ```

2. 绑定参数

   ```jsx
   <p onClick={[handleClick, 123]} />
   // 等价于
   <p onClick={(e) => handleClick(123, e)]} />
   ```
