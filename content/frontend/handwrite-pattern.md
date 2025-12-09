---
title: Design Patterns
category: Handwrite
toc: true
---

## JS

### Singleton Pattern

Only one instance exists.

```ts
class Singleton {
  private static instance: Singleton;

  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

// test
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2);
```

### Factory Pattern

Function used to create objects.

```ts
class Person {
  age: number;
  isAdult: boolean;

  constructor(age: number, isAdult: boolean) {
    this.age = age;
    this.isAdult = isAdult;
  }

  static createPerson(age: number): Person {
    return new Person(age, age >= 18);
  }
}

// test
const p = Person.createPerson(25);
console.log(p);
```

### Observer Pattern

- **Publisher**: record subscribers and notify them.
- **Subscriber**: perform actions after receiving the notification.

```ts
class Subscriber {
  update(message: string) {
    console.log(message);
  }
}

class Publisher {
  subscribers: Subscriber[];

  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  notify() {
    this.subscribers.forEach((subscriber) => subscriber.update("notify"));
  }
}

// test
const s = new Subscriber();
const p = new Publisher();
p.subscribe(s);
p.notify();
```

### Pub/Sub Pattern

- **Publisher**: notify an event.
- **Subscriber**: perform actions after receiving the notification.

```ts
class EventEmitter {
  events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  subscribe(eventName: string, callbackFn: Function) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName)!.push(callbackFn);
  }

  notify(eventName: string) {
    const callbackFns = this.events.get(eventName);
    if (callbackFns) {
      callbackFns.forEach((fn) => fn());
    }
  }
}

// test
const emitter = new EventEmitter();
emitter.subscribe("test", () => console.log("test"));
emitter.notify("test");
```

### Strategy Pattern

Enables selecting an algorithm at runtime.

```ts
interface Strategy {
  sort: (nums: number[]) => number[];
}

class StrategyA implements Strategy {
  sort(nums: number[]) {
    return nums.sort((a, b) => a - b);
  }
}

class StrategyB implements Strategy {
  sort(nums: number[]) {
    return nums.reverse();
  }
}

function sort(nums: number[], strategy: Strategy) {
  return strategy.sort(nums);
}

// test
console.log(sort([2, 1, 3], new StrategyA()));
console.log(sort([2, 1, 3], new StrategyB()));
```
