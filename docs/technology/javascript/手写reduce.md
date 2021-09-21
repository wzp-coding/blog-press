---
title: reduce
---

# 你知道reduce吗？

[[toc]]

## 作用

`reduce()` 方法对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值。

## 语法

> `arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])`

## 参数

- `callback`

  执行数组中每个值 (如果没有提供 `initialValue则第一个值除外`)的函数，包含四个参数：

  1. **`accumulator`**

     ​	累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或`initialValue`（见于下方）。

  2. `currentValue`

     ​	数组中正在处理的元素。

  3. `index` 可选

     ​	数组中正在处理的当前元素的索引。 如果提供了`initialValue`，则起始索引号为0，否则从索引1起始。

  4. `array`可选

     ​	调用`reduce()`的数组

- `initialValue`可选

  ​	作为第一次调用 `callback`函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

## 返回值

函数累计处理的结果

## 描述

`reduce`为数组中的每一个元素依次执行`callback`函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：

- `accumulator 累计器`
- `currentValue 当前值`
- `currentIndex 当前索引`
- `array 数组`

回调函数第一次执行时，`accumulator` 和`currentValue`的取值有两种情况：

- 如果调用`reduce()`时提供了`initialValue`，`accumulator`取值为`initialValue`，`currentValue`取数组中的第一个值；
- 如果没有提供 `initialValue`，那么`accumulator`取数组中的第一个值，`currentValue`取数组中的第二个值。

**注意：**

- 如果没有提供`initialValue`，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。

- 如果提供`initialValue`，从索引0开始。

- 如果数组为空且没有提供`initialValue`，会抛出[`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且`callback`不会被执行。

## 手写

```js
Array.prototype._reduce = function (callback, initialValue) {
  let first = true;
  let array = this;
  let accumulator, currentValue, index;
  if (array.length === 0 && initialValue === void 0) {
    // 数组为空且没有提供initialValue，会抛出TypeError
    throw new Error("TypeError");
  }
  if (array.length === 1 && initialValue === void 0) {
    // 数组仅有一个元素（无论位置如何）并且没有提供initialValue
    return array[0];
  }
  if (array.length === 0 && initialValue !== void 0) {
    // 有提供initialValue但是数组为空
    return initialValue;
  }
  return (() => {
    for (let i = 0, j = array.length; i < j; i++) {
      if (first) {
        // 第一次执行
        first = false;
        if (initialValue !== void 0) {
          // 如果调用reduce()时提供了initialValue，accumulator取值为initialValue，currentValue取数组中的第一个值
          accumulator = initialValue;
          currentValue = array[0];
          // 如果提供initialValue，从索引0开始。
          // 注意：下一次索引应该是array[1]
          index = 0;
        } else {
          // 如果没有提供 initialValue，那么accumulator取数组中的第一个值，currentValue取数组中的第二个值
          accumulator = array[0];
          currentValue = array[1];
          // 如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引
          // 注意：下一次索引应该是array[2]
          index = 1;
          i += 1;
        }
      } else {
        currentValue = array[i];
        index = i;
      }
      accumulator = callback(accumulator, currentValue, index, array);
    }
    return accumulator;
  })();
};
```

## 参考
> [Reduce](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

## 疑问

可以把无籽西瓜的技术用到石榴上吗？