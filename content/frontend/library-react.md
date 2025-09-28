---
title: React
category: Library
---

## Basic

### Passing Props

1. Pass props

   ```jsx
   function Parent() {
     return <Child age={18} />;
   }

   function Child({ age }) {
     return <h1>{age}</h1>;
   }
   ```

2. Pass JSX

   ```jsx
   function Parent() {
     return (
       <Child>
         <h1>Hello</h1>
       </Child>
     );
   }

   function Child({ children }) {
     return <section>{children}</section>;
   }
   ```

3. Pass all props

   ```jsx
   function Parent(props) {
     return <Child {...props} />;
   }
   ```

> React component functions accept a single argument, a props object:
>
> ```jsx
> function Child(props) {
>   let { age } = props;
>   let { children } = props;
> }
> ```

### Conditional Rendering

1. if statement

   ```jsx
   function Text({ condition }) {
     let text;
     if (condition) {
       text = <p>A</p>;
     } else {
       text = <p>B</p>;
     }
     return <section>{text}</section>;
   }
   ```

2. ternary operator (if true, render A, otherwise B)

   ```jsx
   function Text({ condition }) {
     return <section>{condition ? <p>A</p> : <p>B</p>}</section>;
   }
   ```

3. AND operator (if true, render A, otherwise nothing)

   ```jsx
   function Text({ condition }) {
     return <section>{condition && <h1>A</h1>}</section>;
   }
   ```

> 1. ternary operator
>
> ```js
> true ? A : B; // return A
> false ? A : B; // return B
> ```
>
> 2. AND operator
>
> ```js
> true && A; // return A
> false && A; // return false
> 0 && A; // return 0
> ```

### Rendering Lists

1. Rendering data from arrays

   ```jsx
   function List() {
     const fruits = [
       { id: 1, name: "Apple" },
       { id: 2, name: "Banana" },
       { id: 3, name: "Cherry" },
     ];
     return (
       <ul>
         {fruits.map(({ id, name }) => (
           <li key={id}>{name}</li>
         ))}
       </ul>
     );
   }
   ```

> **Why does React need keys?**
>
> 当修改列表时，React 需要用 key 来判断列表元素是否发生变化（移动，删除，插入，更新），从而仅更新变化的元素，而不是重新渲染整个列表。
>
> 1. 使用 index 作 key，当删除第一个元素时，后续元素的 index 会改变，导致 React 重新渲染整个列表。
> 2. 使用 id 作 key，当删除第一个元素时，后续元素的 id 不变，React 只更新变化的元素。
>
> 因此，当列表不会发生变化时，使用 index 作 key 是可以的。

### Pure functions

definition:

1. Same inputs, same output
2. No side effects

benefit：

1. Skipping rendering components whose inputs have not changed

### UI Tree

1. Render trees: represent the nested relationship between React components
2. Dependency trees: represent the module dependencies in a React app

### Ohter

1. controlled components: driven by props
2. uncontrolled components: driven by state

## Hooks

### useState

### useReducer

### useContext
