---
title: JS
category: Handwrite
toc: true
---

## Array

### map

```js
Array.prototype.map = function (callbackFn, thisArg = undefined) {
	const a = this;
	const n = a.length; // length is fixed
	const r = Array(n);
	for (let i = 0; i < n; i++) {
		if (!Object.hasOwn(a, i)) continue; // skip empty slots
		r[i] = callbackFn.call(thisArg, a[i], i, a);
	}
	return r;
};
```

### reduce

```js
Array.prototype.reduce = function (callbackFn, initialValue) {
	const a = this;
	const n = a.length; // length is fixed
	let p = initialValue === undefined ? a[0] : initialValue;
	let i = initialValue === undefined ? 1 : 0;
	for (; i < n; i++) {
		if (!Object.hasOwn(a, i)) continue; // skip empty slots
		p = callbackFn.call(undefined, p, a[i], i, a);
	}
	return p;
};
```

### filter

```js
Array.prototype.filter = function (callbackFn, thisArg = undefined) {
	const a = this;
	const n = a.length; // length is fixed
	const r = [];
	for (let i = 0; i < n; i++) {
		if (!Object.hasOwn(a, i)) continue; // skip empty slots
		if (callbackFn.call(thisArg, a[i], i, a)) {
			r.push(a[i]);
		}
	}
	return r;
};
```

### flat

```js
Array.prototype.flat = function (depth = 1) {
	const a = this;
	const n = a.length; // length is fixed
	const r = [];
	for (let i = 0; i < n; i++) {
		if (!Object.hasOwn(a, i)) continue; // skip empty slots
		if (Array.isArray(a[i]) && depth > 0) {
			r.push(...a[i].flat(depth - 1));
		} else {
			r.push(a[i]);
		}
	}
	return r;
};
```

### some

```js
Array.prototype.some = function (callbackFn, thisArg = undefined) {
	const a = this;
	const n = a.length; // length is fixed
	for (let i = 0; i < n; i++) {
		if (!Object.hasOwn(a, i)) continue; // skip empty slots
		if (callbackFn.call(thisArg, a[i], i, a)) {
			return true;
		}
	}
	return false;
};
```

## Function

### call

- 函数作为方法调用时，this 指向调用对象。

```js
Function.prototype.call = function (thisArg = globalThis, ...argArray) {
	const k = Symbol();
	thisArg[k] = this;
	const r = thisArg[k](...argArray);
	delete thisArg[k];
	return r;
};
```

### apply

```js
Function.prototype.apply = function (thisArg, argArray) {
	return this.call(thisArg, ...argArray);
};
```

### bind

```js
Function.prototype.bind = function (thisArg, ...argArray) {
	return (...restArgArray) => {
		return this.call(thisArg, ...argArray, ...restArgArray);
	};
};
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

```color
@[seagreen]{Primitive}
  | Undefined => "undefined"
  | @[indianred]{Null      => "object"}
  | String    => "string"
  | Symbol    => "symbol"
  | Boolean   => "boolean"
  | Number    => "number"
  | BigInt    => "bigint"
@[seagreen]{Object}
  | @[indianred]{Function  => "function"}
  | Others    => "object"
```

### instanceof

1. 遍历 `o` 的原型链。
2. 检查 `fn.prototype` 是否在其中。

```js
function Instanceof(o, fn) {
	let proto = Object.getPrototypeOf(o)
	while (proto) {
		if (proto === fn.prototype) {
			return true
		}
		proto = Object.getPrototypeOf(proto)
	}
	return false
}
```

### new

1. 创建对象 `r`，其原型为 `fn.prototype`。
2. 调用函数 `fn`，其 this 指向 `r`。

```js
function New(fn, ...argArray) {
	const r = Object.create(fn.prototype)
	fn.call(r, ...argArray)
	return r
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
