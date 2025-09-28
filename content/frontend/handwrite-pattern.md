---
title: Design Patterns
category: Handwrite
---

## JS

### 发布订阅模式

- 订阅：将 callback 放入列表
- 发布：执行列表中所有 callback

```js
class EventCenter {
  constructor() {
    this.events = new Map(); // Map<string, Array<Function>>
  }

  subscribe(event, callback) {
    let list = this.events.get(event) ?? [];
    list.push(callback);
    this.events.set(event, list);
  }

  publish(event) {
    let list = this.events.get(event) ?? [];
    for (let callback of list) {
      callback();
    }
  }
}
```
