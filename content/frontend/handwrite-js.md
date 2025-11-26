---
title: JS
category: Handwrite
toc: true
---

## Array

### map

```js
function map(callback, thisArg = undefined) {
  const array = this;
  const n = array.length;
  const result = [];

  for (let i = 0; i < n; i++) {
    if (!Object.hasOwn(array, i)) continue; // skip hole

    result[i] = callback.call(thisArg, array[i], i, array);
  }

  return result;
}
```

### reduce

```js
function reduce(callback, initialValue) {
  const array = this;
  const n = array.length;

  if (n === 0 && !initialValue) throw new Error();

  let [prev, i] = initialValue ? [initialValue, 0] : [array[0], 1];

  for (; i < n; i++) {
    if (!Object.hasOwn(array, i)) continue; // skip hole

    prev = callback.call(undefined, prev, array[i], i, array);
  }

  return prev;
}
```

### push

```js
function push(...items) {
  const array = this;
  const n = array.length;
  const k = items.length;

  for (let i = 0; i < k; i++) {
    array[n + i] = items[i];
  }

  return array.length;
}
```

### pop

```js
function pop() {
  const array = this;
  const n = array.length;

  if (n === 0) return undefined;

  const value = array[n - 1];
  delete array[n - 1];
  array.length = n - 1;

  return value;
}
```

### flat

```js
function flat(depth = 1) {
  const array = this;
  const n = array.length;
  let result = [];

  for (let i = 0; i < n; i++) {
    if (!Object.hasOwn(array, i)) continue; // skip hole

    const value = array[i];
    if (Array.isArray(value) && depth > 0) {
      result.push(...flat.call(value, depth - 1));
    } else {
      result.push(value);
    }
  }

  return result;
}
```

## Function

### call

- 原理：将函数作为对象的属性调用，此时函数的 this 指向该对象

```js
function call(thisArg = window, ...args) {
  const key = Symbol("key");
  thisArg[key] = this;
  const val = thisArg[key](...args);
  delete thisArg[key];
  return val;
}
```

### apply

```js
function apply(thisArg, args) {
  return this.call(thisArg, ...args);
}
```

### bind

```js
function bind(thisArg = window, ...args) {
  return (...rest) => {
    return this.call(thisArg, ...args, ...rest);
  };
}
```

## Object

### create

```js
function create(proto) {
  const instance = {};
  Object.setPrototypeOf(instance, proto);
  return instance;
}
```

### assign

```js
function assign(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (Object.hasOwn(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}
```

### keys

- 返回一个数组，包含[自身可枚举](./js/object.md/#object-property)属性的键

```js
function keys() {
  const arr = [];
  for (const key in this) {
    if (!Object.hasOwn(this, key)) continue;
    arr.push(key);
  }
  return arr;
}
```

## Operator

### typeof

- Primitive
  - If val is undefined, return "undefined".
  - **If val is null, return "object".**
  - If val is a String, return "string".
  - If val is a Symbol, return "symbol".
  - If val is a Boolean, return "boolean".
  - If val is a Number, return "number".
  - If val is a BigInt, return "bigint".
- Object
  - **If val has a \[\[Call\]\] internal method, return "function".**
  - Else return "object".

### instanceof

1. 遍历 `instance` 的原型链
2. 检查 `constructor` 的原型是否在其中

```ts
function Instanceof(instance: Object, constructor: Function) {
  let prototype = Object.getPrototypeOf(instance);
  while (prototype !== null) {
    if (prototype === constructor.prototype) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}
```

### new

1. 创建一个原型为 `constructor` 原型的对象。
2. 调用 `constructor`，将其 `this` 指向新对象。

```js
function New(constructor: Function, ...args: unknown[]) {
  const instance = Object.create(constructor.prototype);
  const result = constructor.call(instance, ...args);
  return result ?? instance;
}
```

## Promise

- [x] 处理 state 的单向变化
- [x] 处理 then() 的同步回调
- [x] 处理 then() 的异步回调
- [x] 处理 then() 的链式调用
- [x] 处理 then() 的微任务
- [x] 处理 then() 的传值穿透

```js
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.result = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = () => {};
    const reject = () => {};

    executor(resolve, reject);
  }

  then() {}
  catch() {}
  finally() {}
  static all() {}
  static any() {}
  static allSettled() {}
  static race() {}
  static resolve() {}
  static reject() {}
}
```

### constructor

```js
constructor(executor) {
  this.state = 'pending'
  this.result = undefined
  this.onFulfilledCallbacks = []
  this.onRejectedCallbacks = []

  const resolve = value => {
    queueMicrotask(() => { // 处理微任务
      if (this.state === 'pending') { // 处理状态单次变化
        this.state = 'fulfilled'
        this.result = value
        this.onFulfilledCallbacks.forEach(cb => cb(this.result))
      }
    })
  }

  const reject = value => {
    queueMicrotask(() => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.result = value
        this.onRejectedCallbacks.forEach(cb => cb(this.result))
      }
    })
  }

  try {executor(resolve, reject)}
  catch(e) {reject(e)}
}
```

### then

1. onFulfilled 默认为 `x => x`
2. onRejected 默认为 `x => { throw x }`

```js
then(onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x //　处理传值穿透
  onRejected = typeof onRejected === 'function' ? onRejected : x => { throw x }

  return new MyPromise((resolve, reject) => { // 处理链式调用
    const resolvePromise = result => {
      if (result instanceof MyPromise) {result.then(resolve, reject)}
      else {resolve(result)}
    }

    if (this.state === 'fulfilled') {resolvePromise(onFulfilled(this.result))} // 处理同步回调
    if (this.state === 'rejected') {resolvePromise(onRejected(this.result))}
    if (this.state === 'pending') {
      this.onFulfilledCallbacks.push(value => resolvePromise(onFulfilled(value))) // 处理异步回调
      this.onRejectedCallbacks.push(value => resolvePromise(onRejected(value)))
    }
  })
}
```

### catch

1. onRejected 默认为 `x => { throw x }`

```js
catch(onRejected) {
  return this.then(undefined, onRejected)
}
```

### finally

1. onFinally 默认为 `x => { throw x }`

```js
finally(onFinally) {
  const onFulfilled = value => {
    onFinally()
    return value
  }
  return this.then(onFulfilled, onFulfilled)
}
```

### all

```js {6}
function all(promises) {
  return new Promise((resolve, reject) => {
    let result = [];
    const onFullfiled = (val) => {
      result.push(val);
      if (result.length === promises.length) resolve(result);
    };
    const onRejected = (val) => {
      reject(val);
    };
    for (let promise of promises) {
      if (promise instanceof Promise) {
        promise.then(onFullfiled, onRejected);
      } else {
        onFullfiled(promise);
      }
    }
  });
}

Promise.all = all;
```

### race

```js {5}
function race(promises) {
  return new Promise((resolve, reject) => {
    for (let promise of promises) {
      if (promise instanceof Promise) {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
}

Promise.race = race;
```

### any

```js
static any(promises) {
  return new MyPromise((resolve, reject) => {
    let result = []

    const onFulfilled = value => {resolve(value)}

    const onRejected = value => {
      result.push(value)
      if (result.length === promises.length) {reject(new AggregateError('All promises were rejected'))}
    }

    promises.forEach(promise => {
      if (promise instanceof MyPromise) {promise.then(onFulfilled, onRejected)}
      else {onFulfilled(promise)}
    })
  })
}
```

### allSettled

```js
static allSettled(promises) {
  return new MyPromise((resolve, reject) => {
    let result = []

    const onFulfilled = value => {
      result.push({ state: 'fulfilled', result: value })
      if (result.length === promises.length) {resolve(result)}
    }

    const onRejected = value => {
      result.push({ state: 'rejected', result: value })
      if (result.length === promises.length) {resolve(result)}
    }

    promises.forEach(promise => {
      if (promise instanceof MyPromise) {promise.then(onFulfilled, onRejected)}
      else {onFulfilled(promise)}
    })
  })
}
```

### resolve

```js
static resolve(value) {
  return new MyPromise((resolve, reject) => {
    if (value instanceof MyPromise) {value.then(resolve, reject)}
    else {resolve(value)}
  })
}
```

### reject

```js
static reject(value) {
  return new MyPromise((resolve, reject) => {
    reject(value)
  })
}
```
