---
title: Leetcode
category: Algorithm
toc: true
---

> 参考资料：[算法通关手册](https://algo.itcharge.cn)

## 双指针

### 对撞指针

Examples:
[167](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/description/),
[125](https://leetcode.cn/problems/valid-palindrome/description/),
[11](https://leetcode.cn/problems/container-with-most-water/description/),
[977](https://leetcode.cn/problems/squares-of-a-sorted-array/description/),
[345](https://leetcode.cn/problems/reverse-vowels-of-a-string/description/)

```js
let [a, b] = [0, n - 1];
while (a < b) {
  if (cond_1) a++;
  else if (cond_2) b--;
  else return result;
}
```

### 快慢指针

Examples:
[26](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/),
[80](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/description/),
[27](https://leetcode.cn/problems/remove-element/description/),
[283](https://leetcode.cn/problems/move-zeroes/description/),
[88](https://leetcode.cn/problems/merge-sorted-array/description/)

```js
let [a, b] = [0, 1];
while (b < n) {
  if (cond) a++;
  b++;
}
```

### 分离指针

Examples:
[350](https://leetcode.cn/problems/intersection-of-two-arrays-ii/description/),
[392](https://leetcode.cn/problems/is-subsequence/description/),
[415](https://leetcode.cn/problems/add-strings/description/)

```js
let [a, b] = [0, 0];
while (a < m && b < n) {
  if (cond_1) a++;
  else if (cond_2) b++;
  else {
    a++;
    b++;
  }
}
```

## 滑动窗口

### 定长窗口

Examples:
[1343](https://leetcode.cn/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/description/),
[643](https://leetcode.cn/problems/maximum-average-subarray-i/description/),
[1052](https://leetcode.cn/problems/grumpy-bookstore-owner/description/),
[1423](https://leetcode.cn/problems/maximum-points-you-can-obtain-from-cards/description/),
[567](https://leetcode.cn/problems/permutation-in-string/description/),
[438](https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/)

```js
let [a, b] = [0, 0];
while (b <= n) {
  if (b - a === window_size) a++;
  b++;
}
```

### 动态窗口

Examples:
[3](https://leetcode.cn/problems/longest-substring-without-repeating-characters/description/),
[209](https://leetcode.cn/problems/minimum-size-subarray-sum/description/),
[674](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/description/),
[485](https://leetcode.cn/problems/max-consecutive-ones/description/)

```js
let [a, b] = [0, 0];
while (b <= n) {
  if (cond) a++;
  else b++;
}
```

## 链表

### 遍历

- 基础题：
  [去重](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/),
  [反转](https://leetcode.cn/problems/reverse-linked-list/description/),
  [删除](https://leetcode.cn/problems/remove-linked-list-elements/description/)

- 复合题：
  [82](https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/description/),
  [92](https://leetcode.cn/problems/reverse-linked-list-ii/description/),
  [328](https://leetcode.cn/problems/odd-even-linked-list/description/)

### 双指针

- 基础题：
  [判环](https://leetcode.cn/problems/linked-list-cycle/description/),
  [交点](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/),
  [尾删](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/),
  [中点](https://leetcode.cn/problems/middle-of-the-linked-list/description/),
  [合并](https://leetcode.cn/problems/merge-two-sorted-lists/description/),
  [旋转](https://leetcode.cn/problems/rotate-list/description/)

- 复合题：
  [2](https://leetcode.cn/problems/add-two-numbers/description/),
  [445](https://leetcode.cn/problems/add-two-numbers-ii/description/),

## 栈

- 习题：
  [最小栈](https://leetcode.cn/problems/min-stack/description/),
  [有效括号](https://leetcode.cn/problems/valid-parentheses/description/),
  [中缀表达式](https://leetcode.cn/problems/basic-calculator-ii/description/),
  [后缀表达式](https://leetcode.cn/problems/evaluate-reverse-polish-notation/description/),
  [字符串解码](https://leetcode.cn/problems/decode-string/description/),
