---
title: Utility
category: Handwrite
toc: true
---

## Debounce

![](handwrite-utility-debounce)

```js
function debounce(fn, wait) {
  let id;
  return function (...args) {
    if (id) {
      clearTimeout(id);
      id = setTimeout(() => {
        id = null;
      }, wait);
    } else {
      fn.call(this, ...args);
      id = setTimeout(() => {
        id = null;
      }, wait);
    }
  };
}
```

## Throttle

![](handwrite-utility-throttle)

```js
function throttle(fn, wait) {
  let id;
  return function (...args) {
    if (!id) {
      fn.call(this, ...args);
      id = setTimeout(() => {
        id = null;
      }, wait);
    }
  };
}
```

## Memoize

```js
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const value = fn.call(this, ...args);
    cache.set(key, value);
    return value;
  };
}
```

## Curry

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length === fn.length) {
      console.log(this);
      return fn.call(this, ...args);
    }
    return function (...rest) {
      return curried.call(this, ...args, ...rest);
    };
  };
}
```

## Clone Shallow

> 仅考虑 Array 和 Object 的拷贝。

```ts
function cloneShallow<T>(val: T): T {
  if (Array.isArray(val)) {
    return val.slice() as T;
  }
  const prototype = Object.getPrototypeOf(val);
  const newObject = Object.create(prototype);
  return Object.assign(newObject, val);
}
```

```js
function cloneShallow(target) {
  const clone = Array.isArray(target) ? [] : {};
  for (let [key, val] of Object.entries(target)) {
    clone[key] = val;
  }
  return clone;
}
```

## Clone Deep

> 仅考虑 Array 和 Object 的拷贝。

```js
function cloneDeep(target) {
  const clone = Array.isArray(target) ? [] : {};
  for (let [key, val] of Object.entries(target)) {
    if (val instanceof Object) {
      clone[key] = cloneDeep(val);
    } else {
      clone[key] = val;
    }
  }
  return clone;
}
```

## isPrimitive

```ts
function isPrimitive(val: unknown): boolean {
  return val === null || (typeof val !== "function" && typeof val !== "object");
}
```

## isArray

```js
Array.isArray([]); // true
[] instanceof Array // true
[].constructor === Array // true
Object.prototype.toString.call([]).slice(8,-1) === 'Array' // true
```
