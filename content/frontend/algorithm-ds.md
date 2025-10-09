---
title: Data Structure
category: Algorithm
toc: true
---

## Stack

|         | ArrayStack | LinkedStack |
| ------- | ---------- | ----------- |
| push    | $O(1)$     | $O(1)$      |
| pop     | $O(1)$     | $O(1)$      |
| peek    | $O(1)$     | $O(1)$      |
| size    | $O(1)$     | $O(1)$      |
| isEmpty | $O(1)$     | $O(1)$      |

### ArrayStack

```js
class ArrayStack {
  constructor() {
    this.list = [];
  }

  push(val) {
    this.list.push(val);
  }

  pop() {
    return this.list.pop();
  }

  peek() {
    return this.list.at(-1);
  }

  size() {
    return this.list.length;
  }

  isEmpty() {
    return this.list.length === 0;
  }
}
```

### LinkedStack

```js
class LinkedStack {
  constructor() {
    this.list = new SinglyLinkedList();
  }

  push(val) {
    this.list.unshift(val);
  }

  pop() {
    if (this.list.size) {
      let val = this.list.head.val;
      this.list.shift();
      return val;
    } else {
      return undefined;
    }
  }

  peek() {
    if (this.list.size) {
      return this.list.head.val;
    } else {
      return undefined;
    }
  }

  size() {
    return this.list.size;
  }

  isEmpty() {
    return this.list.size === 0;
  }
}
```

## Queue

|         | ArrayQueue | LinkedQueue |
| ------- | ---------- | ----------- |
| enqueue | $O(1)$     | $O(1)$      |
| dequeue | $O(n)$     | $O(1)$      |
| front   | $O(1)$     | $O(1)$      |
| size    | $O(1)$     | $O(1)$      |
| isEmpty | $O(1)$     | $O(1)$      |

### ArrayQueue

```js
class ArrayQueue {
  constructor() {
    this.list = [];
  }

  enqueue(val) {
    this.list.push(val);
  }

  dequeue() {
    return this.list.shift();
  }

  front() {
    return this.list[0];
  }

  size() {
    return this.list.length;
  }

  isEmpty() {
    return this.list.length === 0;
  }
}
```

### LinkedQueue

```js
class LinkedQueue {
  constructor() {
    this.list = new SinglyLinkedList();
  }

  enqueue(val) {
    this.list.push(val);
  }

  dequeue() {
    if (this.list.size) {
      let val = this.list.head.val;
      this.list.shift();
      return val;
    } else {
      return undefined;
    }
  }

  front() {
    if (this.list.size) {
      return this.list.head.val;
    } else {
      return undefined;
    }
  }

  size() {
    return this.list.size;
  }

  isEmpty() {
    return this.list.size === 0;
  }
}
```

## LinkedList

|         | SinglyLinkedList | DoublyLinkedList |
| ------- | ---------------- | ---------------- |
| unshift | $O(1)$           | $O(1)$           |
| push    | $O(1)$           | $O(1)$           |
| shift   | $O(1)$           | $O(1)$           |
| pop     | $O(n)$           | $O(1)$           |

### SinglyLinkedList

```js
class ListNode {
  constructor(val, next) {
    this.val = val;
    this.next = next;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  unshift(val) {
    let node = new ListNode(val, this.head);
    if (this.size) {
      this.head = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.size++;
  }

  push(val) {
    let node = new ListNode(val, null);
    if (this.size) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.size++;
  }

  shift() {
    if (this.size) {
      this.head = this.head.next;
      this.size--;
    }
  }
}
```

### DoublyLinkedList

```js
class ListNode {
  constructor(val, prev, next) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  unshift(val) {
    let node = new ListNode(val, null, this.head);
    if (this.size) {
      this.head.prev = node;
      this.head = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.size++;
  }

  push(val) {
    let node = new ListNode(val, this.tail, null);
    if (this.size) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.size++;
  }

  shift() {
    if (this.size) {
      this.head = this.head.next;
      this.head.prev = null;
      this.size--;
    }
  }

  pop() {
    if (this.size) {
      this.tail = this.tail.prev;
      this.tail.next = null;
      this.size--;
    }
  }
}
```

## Hash

### HashSet

```ts
class HashSet {
  buckets: number;
  table: number[][];

  constructor() {
    this.buckets = 997;
    this.table = Array.from({ length: this.buckets }, () => []);
  }

  add(key: number): void {
    if (!this.contains(key)) {
      const i = this.hash(key);
      this.table[i].push(key);
    }
  }

  remove(key: number): void {
    const i = this.hash(key);
    this.table[i] = this.table[i].filter((x) => x !== key);
  }

  contains(key: number): boolean {
    const i = this.hash(key);
    return this.table[i].includes(key);
  }

  hash(key: number): number {
    return key % this.buckets;
  }
}
```

### HashMap

```ts
class HashMap {
  buckets: number;
  table: number[][][];

  constructor() {
    this.buckets = 997;
    this.table = Array.from({ length: this.buckets }, () => []);
  }

  put(key: number, value: number): void {
    const i = this.hash(key);
    const v = this.table[i].find((x) => x[0] === key);
    if (v) {
      v[1] = value;
    } else {
      this.table[i].push([key, value]);
    }
  }

  get(key: number): number {
    const i = this.hash(key);
    const v = this.table[i].find((x) => x[0] === key);
    if (v) {
      return v[1];
    } else {
      return -1;
    }
  }

  remove(key: number): void {
    const i = this.hash(key);
    this.table[i] = this.table[i].filter((x) => x[0] !== key);
  }

  hash(key: number): number {
    return key % this.buckets;
  }
}
```
