---
title: Typescript
category: Library
toc: true
---

## Types

```ts
// Primitives
type Number = number;
type String = string;
type Boolean = boolean;
type Undefined = undefined;
type Null = null;

// Arrays
type NumberArray = number[];

// Functions
function fn(a: number, b: number): number {
  return a + b;
}

// Objects
type Point = { x: number; y: number };
type Point = { x: number; y?: number }; // optional property

// Union Type
type StringOrNumber = string | number;
type BooleanOrNumber = boolean | number;

// Intersection Type
type Number = StringOrNumber & BooleanOrNumber;

// Literal Types
type Direction = "top" | "right" | "bottom" | "left";

// Any
function fn(x: any) {
  x(); // ✅
  x.a(); // ✅
}

// Unknown
function fn(x: unknown) {
  x(); // ❌
  x.a(); // ❌
}

// Never
function fn(x: number) {
  if (typeof x !== "number") {
    console.log(x); // x: never (empty set)
  }
}
```

## Type Inference

### Variable Assignment

```ts
let A = 100; // number
let B = condition ? 100 : "hi"; // string | number

B = 100;
console.log(B); // number
B = "hi";
console.log(B); // string
```

### Operator

1. equality

```ts
function fn(x: number | null | undefined) {
  if (typeof x === "number") {
  } // x: number

  if (x === null) {
  } // x: null
  if (x == null) {
  } // x: null | undefined
  if (x != null) {
  } // x: number
}

function fn(x: number | string, y: number | boolean) {
  if (x === y) {
  } // x: number
}
```

2. in

```ts
type Dog = { name: string; bark: () => string };
type Cat = { name: string; meow: () => string };

function fn(x: Dog | Cat) {
  if ("name" in x) {
  } // x: Dog | Cat
  if ("bark" in x) {
  } // x: Dog
}
```

3. instanceof

```ts
function fn(x: number[] | number) {
  if (x instanceof Array) {
  } // x: number[]
}
```

### Control Flow

1. if-else

```ts
function fn(x: number | string) {
  if (typeof x === "number") {
    // x: number
  } else {
    // x: string
  }
}
```

2. switch

```ts
function fn(x: number | string) {
  switch (typeof x) {
    case "number":
      break; // x: number
    case "string":
      break; // x: string
  }
}
```
