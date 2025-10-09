---
title: Leetcode
category: Algorithm
toc: true
---

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
