---
title: Angular
category: Library
toc: true
---

## 简介

## 条件渲染

1. `if else`

```angular-ts
@Component({
  selector: 'app-root',
  template: `
    @if (cond) {<comp-a />}
    @else {<comp-b />}
  `,
})
```

## 列表渲染

## 组件传值

1. Input

```angular-ts
@Component({
  selector: 'child',
  template: '<h1>{{ text() }}</h1>',
})
class Child {
  text = input();
}

@Component({
  selector: 'parent',
  template: '<child text="hello" />',
  imports: [Child],
})
class Parent {}
```

2. Output, Emit

```angular-ts
@Component({
  selector: 'child',
  template: '<button (click)="increment()">increment</button>',
})
class Child {
  incrementEvent = output();
  increment() {
    this.incrementEvent.emit();
  }
}

@Component({
  selector: 'parent',
  template: '<child (incrementEvent)="addCount()" /><h1>{{ count }}</h1>',
  imports: [Child],
})
class Parent {
  count = 0;
  addCount() {
    this.count++;
  }
}
```
