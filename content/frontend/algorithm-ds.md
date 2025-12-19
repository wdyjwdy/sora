---
title: Data Structure
category: Algorithm
toc: true
---

## Bag

A bag is a collection where removing items is not supported. The order is immaterial.

|         | ArrayBag | LinkedBag |
| ------- | -------- | --------- |
| add     | $O(1)$   | $O(1)$    |
| size    | $O(1)$   | $O(1)$    |
| isEmpty | $O(1)$   | $O(1)$    |

### ArrayBag

```ts
class ArrayBag<Item> {
  private items: Item[] = [];
  private n: number = 0;

  add(item: Item) {
    this.items[this.n] = item;
    this.n += 1;
  }

  isEmpty() {
    return this.n === 0;
  }

  size() {
    return this.n;
  }
}
```

### LinkedBag

```ts
class LinkedNode<Item> {
  constructor(
    public item: Item,
    public next: LinkedNode<Item> | null,
  ) {}
}

class LinkedBag<Item> {
  private head: LinkedNode<Item> | null = null;
  private n: number = 0;

  add(item: Item) {
    const newHead = new LinkedNode(item, this.head);
    this.head = newHead;
    this.n += 1;
  }

  isEmpty() {
    return this.n === 0;
  }

  size() {
    return this.n;
  }
}
```

## Stack

A stack is a collection that is based on the last-in-first-out (LIFO) policy.

|         | ArrayStack | LinkedStack |
| ------- | ---------- | ----------- |
| push    | $O(1)$     | $O(1)$      |
| pop     | $O(1)$     | $O(1)$      |
| size    | $O(1)$     | $O(1)$      |
| isEmpty | $O(1)$     | $O(1)$      |

### ArrayStack

```ts
class ArrayStack<Item> {
  private items: Item[] = [];
  private n: number = 0;

  push(item: Item) {
    this.items[this.n] = item;
    this.n += 1;
  }

  pop() {
    if (this.n === 0) return;
    this.n -= 1;
    return this.items[this.n];
  }

  isEmpty() {
    return this.n === 0;
  }

  size() {
    return this.n;
  }
}
```

### LinkedStack

```ts
class LinkedNode<Item> {
  constructor(
    public item: Item,
    public next: LinkedNode<Item> | null,
  ) {}
}

class LinkedStack<Item> {
  private head: LinkedNode<Item> | null = null;
  private n: number = 0;

  push(item: Item) {
    const newHead = new LinkedNode(item, this.head);
    this.head = newHead;
    this.n += 1;
  }

  pop() {
    if (this.head === null) return;
    const popItem = this.head.item;
    this.head = this.head.next;
    this.n -= 1;
    return popItem;
  }

  isEmpty() {
    return this.n === 0;
  }

  size() {
    return this.n;
  }
}
```

## Queue

A queue is a collection that is based on the first-in-first-out (FIFO) policy.

|         | ArrayQueue | LinkedQueue |
| ------- | ---------- | ----------- |
| enqueue | $O(1)$     | $O(1)$      |
| dequeue | $O(n)$     | $O(1)$      |
| size    | $O(1)$     | $O(1)$      |
| isEmpty | $O(1)$     | $O(1)$      |

### ArrayQueue

```ts
class ArrayQueue<Item> {
  private items: Item[] = [];
  private n: number = 0;

  enqueue(item: Item) {
    this.items[this.n] = item;
    this.n += 1;
  }

  dequeue() {
    if (this.n === 0) return;
    const dequeueItem = this.items[0];
    this.n -= 1;
    for (let i = 0; i < this.n; i++) {
      this.items[i] = this.items[i + 1]!;
    }
    return dequeueItem;
  }

  isEmpty() {
    return this.n === 0;
  }

  size() {
    return this.n;
  }
}
```

### LinkedQueue

```ts
class LinkedNode<Item> {
  constructor(
    public item: Item,
    public next: LinkedNode<Item> | null,
  ) {}
}

class LinkedQueue<Item> {
  private head: LinkedNode<Item> | null = null;
  private tail: LinkedNode<Item> | null = null;
  private n: number = 0;

  enqueue(item: Item) {
    const newTail = new LinkedNode(item, null);
    if (this.tail === null) {
      this.head = newTail;
      this.tail = newTail;
    } else {
      this.tail.next = newTail;
      this.tail = newTail;
    }
    this.n += 1;
  }

  dequeue() {
    if (this.head === null) return;
    const dequeueItem = this.head.item;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }
    this.n -= 1;
    return dequeueItem;
  }

  isEmpty() {
    return this.n === 0;
  }

  size() {
    return this.n;
  }
}
```

## LinkedList

|             | SinglyLinkedList | DoublyLinkedList |
| ----------- | ---------------- | ---------------- |
| insertFirst | $O(1)$           | $O(1)$           |
| insertLast  | $O(1)$           | $O(1)$           |
| removeFirst | $O(1)$           | $O(1)$           |
| removeLast  | $O(n)$           | $O(1)$           |

### SinglyLinkedList

```ts
class LinkedNode<Item> {
  constructor(
    public item: Item,
    public next: LinkedNode<Item> | null,
  ) {}
}

class SinglyLinkedList<Item> {
  private head: LinkedNode<Item> | null = null;
  private tail: LinkedNode<Item> | null = null;

  insertFirst(item: Item): void {
    const newHead = new LinkedNode(item, this.head);
    if (this.head === null) {
      this.tail = newHead;
      this.head = newHead;
    } else {
      this.head = newHead;
    }
  }

  insertLast(item: Item): void {
    const newLast = new LinkedNode(item, null);
    if (this.tail === null) {
      this.head = newLast;
      this.tail = newLast;
    } else {
      this.tail.next = newLast;
      this.tail = newLast;
    }
  }

  removeFirst(): void {
    if (this.head === null) return;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }
  }

  *[Symbol.iterator]() {
    for (let i = this.head; i !== null; i = i.next) {
      yield i.item;
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
