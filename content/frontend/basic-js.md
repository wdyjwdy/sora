---
title: JS
category: Basic
toc: true
---

## Array

1. 迭代数组

   |                    | for | for-of | forEach |
   | ------------------ | :-: | :----: | :-----: |
   | continue           | ✅  |   ✅   |   ❌    |
   | break              | ✅  |   ✅   |   ❌    |
   | return             | ✅  |   ✅   |   ❌    |
   | skip array element | ✅  |   ❌   |   ❌    |
   | skip array hole    | ❌  |   ❌   |   ✅    |

2. 拷贝数组

   ```js
   let newArr = arr.slice();
   let newArr = [...arr];
   ```

3. 判断数组

   ```js
   Array.isArray([]); // true
   [] instanceof Array // true
   [].constructor === Array // true
   Object.prototype.toString.call([]).slice(8,-1) === 'Array' // true
   ```

> - **类数组对象**：有 `length`, `非负整数` 属性的对象。
> - **可迭代对象**：实现 `[Symbol.iterator]()` 方法的对象。

## Object

1. 创建对象

   ```js
   let obj = {}; // 原型为 Object.prototype
   let obj = new Object(); // 原型为 Object.prototype
   let obj = new Array(); // 原型为 Array.prototype
   let obj = Object.create(proto); // 原型为 proto
   let obj = Object.create(null); // 原型为 null
   ```

2. 拷贝对象

   ```js
   Object.assign(target, ...sources); // 拷贝对象，覆盖属性
   let obj = { ...source }; // 拷贝对象
   let obj = { ...source, a: 1 }; // 覆盖属性
   ```

3. 检查属性

   ```js
   Object.hasOwn(obj, "prop"); // 检查自有属性
   "prop" in obj; // 检查自有或继承属性
   ```

4. 迭代对象

   ```js
   Object.keys(obj); // 迭代自有可枚举属性
   for (let key in obj) // 迭代可枚举属性
   ```

5. 操作原型

   ```js
   Object.getPrototypeOf(obj); // 查看原型
   Object.setPrototypeOf(obj, { a: 1 }); // 修改原型
   ```

> - **自有属性**：属性存在于对象内，而不是原型链中。
> - **可枚举属性**：enumerable 为 true 的属性。

## Function

### this

| 调用方式 | this          |
| -------- | ------------- |
| 函数     | 全局对象      |
| 方法     | 调用对象      |
| 构造器   | 新建对象      |
| 箭头函数 | 上下文的 this |

> 嵌套函数作为函数调用时，`this` 也为全局对象。

### 闭包

```js
function createTimer() {
  let count = 0;

  return function () {
    // 返回嵌套函数
    return count++; // 捕获变量 count
  };
}

const timer = createTimer(); // 创建一个闭包
timer(); // 0
timer(); // 1
timer(); // 2
```

1. 闭包通常发生在，一个函数返回它内部的嵌套函数时
2. 闭包会捕获作用域内的变量
3. 每次调用函数，创建一个独立的闭包

---

```js
function getInteger() {
  let fns = [];

  for (var i = 0; i < 10; i++) {
    // ❌ 应使用 let
    fns[i] = () => i;
  }
  return fns;
}
getInteger()[3](); // 10
```

1. `var` 声明的变量会被提升，因此所有闭包共享变量 `i`
2. `let` 声明的变量范围是循环体，每次迭代都会生成独立的变量 `i`

## Classes

1. 创建一个类

   ```js
   class Person {
     constructor() {
       // Instance property
       this.age = 18
     }

     // Instance method
     greet() { ... }

     // Static property
     static type = 'human'

     // Static method
     static isPerson() { ... }
   }
   ```

> 1. 类中的语句，隐式的使用了严格模式
> 2. 类声明的变量不会被提升

2. ES6 之前实现一个类

   ```js
   function Person() {
     // Instance property
     this.age = 18
   }

   // Instance method
   Person.prototype.greet = function() { ... }

   // Static property
   Person.type = 'human'

   // Static method
   Person.isPerson = function() { ... }
   ```

## Types

1. typeof

   ```js
   // 基础类型
   typeof number    // 'number'
   typeof string    // 'string'
   typeof boolean   // 'boolean'
   typeof null      // 'object' ‼️
   typeof undefined // 'undefined'

   typeof bigint    // 'bigint'
   typeof symbol    // 'symbol'

   // 对象类型
   typeof function  // 'function' ‼️
   typeof others    // 'object'
   ```

## Iterator

迭代器有三个组成部分：

1. 可迭代对象：有 Symbol.iterator 方法的对象（该方法返回一个迭代器对象）
2. 迭代器对象：有 next 方法的对象（该方法返回一个迭代结果对象）
3. 迭代结果对象：有 value 或 done 属性的对象

```js
class Range {
  // iterable object
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  [Symbol.iterator]() {
    let [start, end] = [this.from, this.to];
    return {
      // iterator object
      [Symbol.iterator]() {
        return this;
      }, // make the iterator itself iterable
      next() {
        return start <= end
          ? { value: start++ } // iterator result object
          : { done: true }; // iterator result object
      },
    };
  }
}
```

> 迭代器是懒惰的，只有在需要时才计算。

生成器是一种定义迭代器的新语法，生成器能够使用 yield 语句来暂停和恢复函数的执行。

```js
// Generator function
function* range(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}

// Generator method
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  }
}
```

## Modules

1. EcmaScript Modules (ESM)

   ```js
   // Export
   const sum = (a, b) => a + b;
   const square = (x) => x ** 2;
   export { sum, square };

   // Import
   import { sum, square } from "./math.js";
   ```

> ES6 Module 中的语句，自动使用严格模式.

2. Common JS (CJS)

   ```js
   // Export
   const sum = (a, b) => a + b;
   const square = (x) => x ** 2;
   module.exports = { sum, square };

   // Import
   const { sum, square } = require("./math.js");
   ```

3. Pre-ES6 Modules

   ```js
   // Export
   const modules = {};
   const require = (name) => modlues[name];

   modules["math.js"] = (function () {
     const sum = (a, b) => a + b;
     const square = (x) => x ** 2;
     return { sum, square };
   })();

   // Import
   const { sum, square } = require("math.js");
   ```

## Async

JS 本身不是异步的，异步由 Browser 和 Node 提供。

### Callback

1. Timer

   ```js
   setTimeout(fn, 1000);
   setInterval(fn, 1000);
   ```

2. UI Event

   ```js
   button.addEventListener("click", fn);
   ```

3. Network Event

   ```js
   request.onload = fn;
   request.onerror = fn;
   ```

4. Node Event

   ```js
   fs.readFile("file", fn);
   ```

> [!Caution]
>
> 基于 [Callback](#callback) 的异步编程有两个缺点：
>
> 1. **回调地狱**：在处理嵌套回调时，代码会难以阅读（Promise 使用链式调用来解决这个问题）
> 2. **异常处理**：异步函数中的异常，无法传回函数调用者（Promise 使用 catch 方法来捕获链式调用中的异常）

### Promise

[Promise](https://262.ecma-international.org/10.0/index.html#sec-promise-objects) 只有三种状态：

1. **Pending**：等待结果中
2. **Fulfilled**：拿到正常结果
3. **Rejected**：拿到异常结果

经常同时出现的两个词：

1. **Settled**：Promise 的状态为 Fulfilled 或 Rejected
2. **Resolved**
   - 当 Promise 的状态为 Settled 时
   - 当 Promise 返回另一个 Promise，状态为 Pending 时（此时 Promise 的状态取决于另一个 Promise）

---

例一

```js
function callback1(response) {
  return response.json(); // promise 4
}

function callback2(json) {
  console.log(json);
}

fetch(theURL) // promise 1
  .then(callback1) // promise 2
  .then(callback2); // promise 3
```

Sync Process

1. start a request, return p1
2. register c1 on p1, return p2
3. register c2 on p2, return p3

Async Process

1. p1 fulfilled
2. c1 invoked and return p4 (c1 resolved)
3. p4, p2 fulfilled
4. c2 invoked
5. p3 fulfilled

---

例二

```js
fetch(theURL) // promise 1
  .then(callback1) // promise 2
  .then(callback2) // promise 3
  .catch(handleError);
```

If the network is down

1. p1 be rejected with a Error
2. p2 be rejected with the same Error
3. handleError be invoked

If the network is ok

1. p1 be fulfilled with a Response
2. c1 be invoked, p2 be fulfilled
3. c2 be invoked, p3 be fulfilled

---

例三

```js
fetch(theURL) // promise 1
  .catch(requestAgain) // promise 2
  .then(callback1) // promise 3
  .then(callback2) // promise 4
  .catch(handleError);
```

If the network is down

1. p1 be rejected with a Error
2. requestAgain be invoked, p2 be fulfilled with a Response
3. c1 be invoked, p3 be fulfilled
4. c2 be invoked, p4 be fulfilled

If the network is ok

1. p1 be fulfilled with a Response
2. c1 be invoked, p3 be fulfilled
3. c2 be invoked, p4 be fulfilled

### Async/await

async 和 await 关键字简化了 Promise 的使用，让异步代码看起来像同步代码

- await 将 Promise 转换为 settled 后的值
- 只能在 async 函数中使用 await（同步函数中仍需用[正常方式](#example-1)处理 Promise）
- async 函数返回一个 Promise
- 可以使用 try/catch 来处理异常

---

例一

```js
async function getJSON(theURL) {
  let response = await fetch(theURL);
  let json = await response.json();
  return json;
}
```

---

例二

同时解析多个 Promise

```js
// ❌
let v1 = await p1;
let v2 = await p2;

// 等价于
p1.then(() => p2).then(() => {});

// ✅
let [v1, v2] = await Promise.all([p1, p2]);
```

---

例三

```js
for await (const val of promises) {
  handle(val);
}

// 等价于
for (const promise of promises) {
  const val = await promise;
  handle(val);
}
```
