---
title: Angular
category: Library
toc: true
---

## 简介

- 响应式：通过 Signal 实现
- 组件化：由 HTML, CSS, TS 组成
- 模版语言：在 HTML 中进行：插值、属性绑定、事件绑定、条件语句
- 控制流：`@if`, `@for`
- 管道： `uppercase`

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

1. `track` 可以用来标记元素，从而进行复用。

```color
@[seagreen]{track index，头部插入元素时，会新建 1 个元素，更新 2 个元素。}
b<0>    a<0> (update)
c<1> -> b<1> (update)
        c<2> (create)

@[seagreen]{track key，头部插入元素时，会新建 1 个元素，复用 2 个元素。}
b<2>    a<1> (create)
c<3> -> b<2>
        c<3>
```

## 组件传值

1. Input

```angular-ts
// child.ts
@Component({
  selector: 'child',
  template: '<h1>{{ text() }}</h1>',
})
export class Child {
  text = input();
}

// parent.ts
@Component({
  selector: 'parent',
  template: '<child text="hello" />',
  imports: [Child],
})
export class Parent {}
```

2. Output, Emit

```angular-ts
// child.ts
@Component({
  selector: 'child',
  template: '<button (click)="increment()">increment</button>',
})
export class Child {
  incrementEvent = output();
  increment() {
    this.incrementEvent.emit();
  }
}

// parent.ts
@Component({
  selector: 'parent',
  template: '<child (incrementEvent)="addCount()" /><h1>{{ count }}</h1>',
  imports: [Child],
})
export class Parent {
  count = 0;
  addCount() {
    this.count++;
  }
}
```

3. Dependency Injection

```angular-ts
// food.service.ts
@Injectable({
  providedIn: 'root',
})
export class FoodService {
  foods = ['apple', 'banana', 'cherry'];
  getFood(id: number) {
    return this.foods[id];
  }
}

// food.ts
@Component({
  selector: 'food',
  template: '<h1>{{ food }}</h1>',
})
export class Food {
  foodService = inject(FoodService);
  food = this.foodService.getFood(0);
}
```

4. Content

```angular-ts
// child.ts
@Component({
  selector: 'child',
  template: '<h1><ng-content /></h1>',
})
export class Child {}

// parent.ts
@Component({
  selector: 'parent',
  template: '<child><span>hello</span></child>',
  imports: [Child],
})
export class Parent {}

```

## 生命周期

1. 组件

```color
@[seagreen]{Mount}
  |  constructor()
  |  ngOnChanges()
  |  ngOnInit()
  |  ngAfterContentInit()
  |  ngAfterViewInit()
  |  @[royalblue]{Render}
  |  afterEveryRender()

@[seagreen]{Update}
  |  ngOnChanges()
  |  @[royalblue]{Render}
  |  afterEveryRender()

@[seagreen]{Unmount}
  |  ngOnDestroy()
```

2. 信号

```color
afterNextRender(fn) @[gray]{// run after the next render is finished}
afterEveryRender(fn) @[gray]{// run after each render is finished}
effect(fn) @[gray]{// run when the signal changes}
effect(onCleanup => onCleanup(fn)) @[gray]{// run when the signal changes}
```

## 响应式原理

## 差异算法
