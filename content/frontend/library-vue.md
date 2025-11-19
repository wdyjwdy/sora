---
title: Vue
category: Library
toc: true
---

## 简介

- 响应式数据：通过 Ref (getter, setter) 和 Reactive (proxy) 实现。
- 单向数据流：数据通过 Props 流动，Props 对于子组件只读，只能通过父组件修改。
- 单文件组件：HTML，JS，CSS 合并在一个 Vue 文件中。
- 指令系统：v-for, v-if。

> **emits 和 inject 不违反单向数据流**\
> emits 并非子组件修改数据，而是通知父组件进行修改。\
> inject 不是数据流机制，单项数据流约束的是 props。

## v-if and v-show

- `v-if` 切换状态时，DOM 元素会被销毁和重建。

  ```html
  <h1>hello</h1>
  <!--v-if-->
  ```

- `v-show` 切换状态时，DOM 元素会被保留，并通过 `display` 属性来显示和隐藏元素。

  ```html
  <h1>hello</h1>
  <h1 style="display: none;">hello</h1>
  ```

## v-for and key

- `key` 可以用来标记元素，从而进行复用。

  ```color
  @[seagreen]{不使用 key，头部插入元素时，会新建 1 个元素，更新 2 个元素。}
  b    a (update)
  c -> b (update)
       c (create)

  @[seagreen]{使用 key，头部插入元素时，会新建 1 个元素，复用 2 个元素。}
  b<2>    a<1> (create)
  c<3> -> b<2>
          c<3>

  @[seagreen]{把 index 当作 key，头部插入元素时，会新建 1 个元素，复用 2 个元素。}
  b<0>    a<0> (update)
  c<1> -> b<1> (update)
          c<2> (create)
  ```

- `key` 可以强制替换组件，而不是复用。

  ```vue
  <h1 :key="num">{{ num }}</h1>
  ```

## ☑️ nextTick()

## 组件传值

- props (reactive, readonly)

  ```color
  @[seagreen]{Parent.vue}
  <Child title="hello" />

  @[seagreen]{Child.vue}
  defineProps(["title"]);
  <h1>{{ title }}</h1>
  ```

- slots

  ```color
  @[seagreen]{Parent.vue}
  <Child>hello</Child>

  @[seagreen]{Child.vue}
  <h1><slot /></h1>
  ```

- emits

  ```color
  @[seagreen]{Parent.vue}
  <Child @increment="count++" />

  @[seagreen]{Child.vue}
  defineEmits(["increment"]);
  <button @click="$emit('increment')" />
  ```

- attribute inheritance

  ```color
  @[seagreen]{Parent.vue}
  <Child class="red" @click="onClick" />

  @[seagreen]{Child.vue}
  <h1>hello</h1>
  ```

- provide and inject (reactive, write)

  ```color
  @[seagreen]{Parent.vue}
  provide("num", 100);

  @[seagreen]{Child.vue}
  const num = inject("num");
  ```

## 生命周期

- 单个组件

  ```color
  @[seagreen]{Setup}
    |
    |  onBeforeMount()
    |
  @[seagreen]{Render (create DOM)}
    |
    |  onMounted()
    |
  @[seagreen]{Mounted}
    |
    |  onBeforeUpdate()
    |
  @[seagreen]{Rerender (update DOM)}
    |
    |  onUpdated()
    |
  @[seagreen]{Mounted}
    |
    |  onBeforeUnmount()
    |
  @[seagreen]{Unmounted}
    |
    |  onUnmounted()
  ```

- 多个组件（优先处理子组件）

  ```color
  @[seagreen]{Parent Mount}
  Parent (setup, onBeforeMount)
  Child (setup, onBeforeMount, onMounted)
  Parent (onMounted)

  @[seagreen]{Parent Update}
  Parent (onBeforeUpdate)
  Parent (onUpdated)

  @[seagreen]{Child Mount}
  Parent (onBeforeUpdate)
  Child (setup, onBeforeMount, onMounted)
  Parent (onUpdated)

  @[seagreen]{Child Update}
  Parent (onBeforeUpdate)
  Child (onBeforeUpdate, onUpdated)
  Parent (onUpdated)

  @[seagreen]{Child Unmount}
  Parent (onBeforeUpdate)
  Child (onBeforeUnmount, onUnmounted)
  Parent (onUpdated)
  ```

## 响应性原理

- `ref` 通过 getter, setter 实现

  ```js
  function ref(value) {
    const refObject = {
      get value() {
        track(refObject, "value"); // 收集依赖该值的副作用
        return value;
      },
      set value(newValue) {
        value = newValue;
        trigger(refObject, "value"); // 执行副作用
      },
    };
    return refObject;
  }
  ```

- `reactive` 通过 proxy 实现

  ```js
  function reactive(obj) {
    return new Proxy(obj, {
      get(target, key) {
        track(target, key); // 收集依赖该值的副作用
        return target[key];
      },
      set(target, key, value) {
        target[key] = value;
        trigger(target, key); // 执行副作用
      },
    });
  }
  ```

## diff

- 缓存静态内容：缓存静态节点。跳过 re-render 时的 create。

  ```vue
  <!-- 静态节点 -->
  <div>staic</div>
  <!-- 动态节点 -->
  <div>{{ dynamic }}</div>
  ```

- 更新类型标记：通过节点类型，实现精准更新。跳过遍历所有属性。

  ```vue
  <!-- type 1: class only -->
  <div :class="{ active }"></div>
  <!-- type 2: text only -->
  <div>{{ dynamic }}</div>
  ```

- 树结构展平：将动态节点提取为数组，diff 时仅比较数组。跳过遍历整棵树。
