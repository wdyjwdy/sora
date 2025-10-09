---
title: TS
category: Handwrite
toc: true
---

## Utility Types

### Awaited

```ts
type Awaited<T> =
  T extends Promise<infer P>
    ? P extends Promise<any>
      ? Awaited<P>
      : P
    : never;
```

### Partial

```ts
type Partial<T> = { [P in keyof T]?: T[P] };
```

### Required

```ts
type Required<T> = { [P in keyof T]-?: T[P] };
```

### Readonly

```ts
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

### Record

```ts
type Record<K extends keyof any, T> = { [P in K]: T };
```

### Pick

```ts
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

### Omit

```ts
type Omit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] };
```

### Exclude

```ts
type Exclude<T, U> = T extends U ? never : T;
```

### Extract

```ts
type Extract<T, U> = T extends U ? T : never;
```

### Parameters

```ts
type Parameters<T> = T extends (...args: infer P) => any ? P : never;
```

### ReturnType

```ts
type ReturnType<T> = T extends (...args: any) => infer R ? R : never;
```
