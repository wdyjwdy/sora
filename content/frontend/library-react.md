---
title: React
category: Library
toc: true
---

## 简介

- 单向数据流：数据通过 Props 流动，Props 对于子组件只读，只能通过 Callback 通知父组件进行修改。（Context 不是数据流机制）
- 函数组件：用 Function 表示 UI，用 Hooks 表示状态。
- 虚拟 DOM：精准更新，避免不必要 DOM 操作。

## 条件渲染

1. `if else`

```jsx
function Comp() {
  if (cond) {
    return <A />;
  } else {
    return <B />;
  }
}
```

2. `cond ? a : b`

```jsx
function Comp() {
  return <div>{cond ? <A /> : <B />}</div>;
}
```

3. `cond && a`

```jsx
function Comp() {
  return <div>{cond && <A />}</div>;
}
```

## 列表渲染

1. `key` 可以用来标记元素，从而进行复用。

```color
@[seagreen]{不使用 key，头部插入元素时，会新建 1 个元素，更新 2 个元素。}
b    a (update)
c -> b (update)
      c (create)

@[seagreen]{使用 key，头部插入元素时，会新建 1 个元素，复用 2 个元素。}
b<2>    a<1> (create)
c<3> -> b<2>
        c<3>

@[seagreen]{把 index 当作 key，头部插入元素时，会新建 1 个元素，更新 2 个元素。}
b<0>    a<0> (update)
c<1> -> b<1> (update)
        c<2> (create)
```

2. `key` 可以强制替换组件，而不是复用。（切换 cond 时，不保留组件状态。）

```jsx
cond ? <Child key="a" /> : <Child key="b" />;
```

## 组件传值

1. Props

```jsx
function Parent() {
  return <Child num={100} />;
}

function Child(props) {
  return <h1>{props.num}</h1>;
}
```

2. Slots

```jsx
function Parent() {
  return (
    <Child>
      <span>100</span>
    </Child>
  );
}

function Child(props) {
  return <h1>{props.children}</h1>;
}
```

3. Context

```jsx
const NumContext = createContext(1);

function Parent() {
  return (
    <NumContext value={100}>
      <Child />
    </NumContext>
  );
}

function Child() {
  const num = useContext(NumContext);
  return <h1>{num}</h1>;
}
```

## 生命周期

1. 类组件

```color
@[seagreen]{Mount}
  |  constructor() @[gray]{// init state }
  |  render() @[gray]{// return jsx }
  |  @[royalblue]{Updates DOM}
  |  componentDidMount() @[gray]{// fetch or DOM Manipulation}

@[seagreen]{Update}
  |  @[royalblue]{Props or state changes}
  |  render()
  |  @[royalblue]{Updates DOM}
  |  componentDidUpdate(prevProps, prevState) @[gray]{// fetch or DOM Manipulation}

@[seagreen]{Unmount}
  |  componentWillUnmount() @[gray]{// perform cleanup}
```

2. 函数组件

```color
useEffect(fn) @[gray]{// run on every render}
useEffect(fn, []) @[gray]{// run when the component mounts (componentDidMount)}
useEffect(fn, [dep]) @[gray]{// run when the dep changes (componentDidUpdate)}
useEffect(() => fn, []) @[gray]{// run when the component unmounts (componentWillUnmount)}
```

## 响应式原理

1. `useState` 通过 setter 触发 re-render

```js
function useState(initialValue) {
  let state = initialValue;
  function setState(update) {
    state = update;
    render(); // 触发重渲染
  }
  return [state, setState];
}
```

## 差异算法

- 同层比较：仅比较同层级节点。（因为 DOM 跨层级操作较少）
- 节点复用：复用 key 和 type 相同的节点。
