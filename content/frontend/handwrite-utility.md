---
title: Utility
category: Handwrite
toc: true
---

## Debounce

![](handwrite-utility-debounce)

```js
function debounce(fn, wait) {
	let id
	return function (...args) {
		if (id) {
			clearTimeout(id)
			id = setTimeout(() => { id = null }, wait)
		} else {
			fn.call(this, ...args)
			id = setTimeout(() => { id = null }, wait)
		}
	}
}
```

## Throttle

![](handwrite-utility-throttle)

```js
function throttle(fn, wait) {
	let id
	return function (...args) {
		if (!id) {
			fn.call(this, ...args)
			id = setTimeout(() => { id = null }, wait)
		}
	}
}
```

## Memoize

```js
function memoize(fn) {
	const cache = new Map()
	return function(...args) {
		const key = JSON.stringify(args)
		if (cache.has(key)) {
			return cache.get(key)
		} else {
			const result = fn.call(this, ...args)
			cache.set(key, result)
			return result
		}
	}
}
```

## Curry

```js
function curry(fn) {
	return function curried(...args) {
		if (args.length >= fn.length) {
			return fn.call(this, ...args)
		}
		return function (...rest) {
			return curried.call(this, ...args, ...rest)
		}
	}
}
```

## Clone Shallow

- 仅考虑 Array 和 Object 的拷贝。

```js
function cloneShallow(o) {
	const r = Array.isArray(o) ? [] : {}
	for (let [k, v] of Object.entries(o)) {
		r[k] = v
	}
	return r
}
```

## Clone Deep

- 仅考虑 Array 和 Object 的拷贝。

```js
function cloneDeep(o) {
	const r = Array.isArray(o) ? [] : {}
	for (let [k, v] of Object.entries(o)) {
		if (o instanceof Object) {
			r[k] = cloneDeep(v)
		} else {
			r[k] = v
		}
	}
	return r
}
```

## isPrimitive

```js
function isPrimitive(v) {
	return v === null || (typeof v !== 'function' && typeof v !== 'object')
}
```

## isArray

```js
Array.isArray([]); // true
[] instanceof Array // true
[].constructor === Array // true
Object.prototype.toString.call([]).slice(8,-1) === 'Array' // true
```
