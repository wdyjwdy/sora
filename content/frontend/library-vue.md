---
title: Vue
category: Library
toc: true
---

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

  ```html
  <h1 :key="num">{{ num }}</h1>
  ```

## nextTick()

## 组件传值

- props

  ```color
  @[seagreen]{Parent.vue}
  <Child title="hello" />

  @[seagreen]{Child.vue}
  defineProps(["title"]);
  <h1>{{ title }}</h1>
  ```

- slot

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
