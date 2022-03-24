---
title: Promise基本实现
---

```js
// 设置成常量的目的
// 1.方便阅读
// 2.不容易写错
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class Promise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }

  status = PENDING
  value = null
  reason = null
  fulfilledCallbacks = []
  rejectedCallbacks = []

  resolve(value) {
    // 1.改变状态
    // 2.执行成功回调
    if (this.status == PENDING) {
      this.status = FULFILLED
      this.value = value
      while (this.fulfilledCallbacks.length) {
        this.fulfilledCallbacks.shift()(value)
      }
    }
  }

  reject(reason) {
    // 1.改变状态
    // 2.执行失败回调
    if (this.status == PENDING) {
      this.status = REJECTED
      this.reason = reason
      while (this.rejectedCallbacks.length) {
        this.rejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    // 1.格式化参数
    // 2.返回新的promise
    onFulfilled =
      typeof onFulfilled == 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected == 'function' ? onRejected : (reason) => throw reason

    const promise2 = new Promise((resolve, reject) => {
      // 1.将回调函数封装成微任务 => 为了等待promise2初始化完成
      // 2.根据状态加入对应的回调队列
      const onFulfilledMicrotask = () =>
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      const onRejectedMicrotask = () =>
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })

      if (this.status == FULFILLED) {
        onFulfilledMicrotask()
      } else if (this.status == REJECTED) {
        onRejectedMicrotask()
      } else if (this.status == PENDING) {
        this.fulfilledCallbacks.push(onFulfilledMicrotask)
        this.rejectedCallbacks.push(onRejectedMicrotask)
      }
    })
    return promise2
  }

  static resolve(value) {
    if (value instanceof Promise) {
      return value
    }
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  // 1.不可返回自身promise
  if (promise2 == x) {
    throw reject(new TypeError(x + '未初始化完成'))
  }
  // 2.如果返回其它promise，状态改变后执行promise2的resolve和reject函数
  if (x instanceof Promise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
```

