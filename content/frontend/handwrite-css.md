---
title: CSS
category: Handwrite
toc: true
---

## 三列布局

![](handwrite-css-layout)

1. Flex

   ```css
   .container {
     display: flex;
   }
   .left,
   .right {
     width: 100px;
   }
   .center {
     flex: 1;
   }
   ```

2. Grid

   ```css
   .container {
     display: grid;
     grid-template-columns: 100px auto 100px;
   }
   ```

## 水平垂直居中

![](handwrite-css-center)

1. Flex

   ```css
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   ```

2. Grid

   ```css
   .container {
     display: grid;
     place-items: center;
   }
   ```

## 导航栏

![](handwrite-css-navbar)

1. Flex

   ```css
   .container {
     display: flex;
   }
   .D {
     margin-left: auto; /* 填充剩余空间 */
   }
   ```
