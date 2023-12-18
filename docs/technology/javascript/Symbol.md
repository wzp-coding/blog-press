---
title: Symbol
---

# 了解一下 Symbol

[[toc]]

## Symbol

Symbol 创建一个唯一值，即便传入的参数一样，两个 symbol 也毫不相干

```js
let wzp = Symbol('wzpp')
let wzp1 = Symbol('wzpp')
console.log('typeof wzp: ', typeof wzp)
let obj = {}
obj[wzp] = 'obj-wzpp'
console.log('wzp1: ', wzp1)
console.log('wzp1 === wzp: ', wzp1 === wzp)
console.log('obj[wzp]: ', obj[wzp])
```

## Symbol.for

Symbol.for 会先在全局 Symbol 注册表寻找是否有重复 key，有的话直接返回，没有新建一个

```js
let uid = Symbol.for('uid')
obj[uid] = '123'

console.log('obj[uid]: ', obj[uid])
console.log('uid: ', uid)

let uid2 = Symbol.for('uid')
console.log('uid === uid2: ', uid === uid2)
console.log('obj[uid2]: ', obj[uid2])
```

## Symbol.keyFor

在全局 Symbol 注册表寻找 Symbol 对应的 key 值 Symbol 可以理解在局部创建 Symbol 值 Symbol.for 可以理解在全局创建 Symbol 值，Symbol.keyFor 只能找到全局 Symbol 注册表的 key

```js
console.log('Symbol.keyFor(uid): ', Symbol.keyFor(uid)) // 'uid'
console.log('Symbol.keyFor(wzpp): ', Symbol.keyFor(wzp)) // undefined
```

## Symbol 不可强制转换

```js
uid + '' // TypeError: Cannot convert a Symbol value to a string
```

## getOwnPropertySymbols 方法

获取对象中 Symbol 类型的 key 值

```js
console.log(
  'Object.getOwnPropertySymbols(obj): ',
  Object.getOwnPropertySymbols(obj)
)
```

## Symbol.hasInstance

每个函数都有这个方法，其实就是 instanceof 做的事情

```js
function F() {}
const f = new F()
console.log('F[Symbol.hasInstance](f): ', F[Symbol.hasInstance](f))
```

内部方法，不支持重写，但我们可以在原型改

```js
F[Symbol.hasInstance] = (v) => Boolean(v) // 重写无效
console.log('1 instanceof F: ', 1 instanceof F) // 有效 true 无效 false 理想值：true 实际值：false
Object.defineProperty(F, Symbol.hasInstance, { value: (v) => Boolean(v) }) //原型修改
console.log('1 instanceof F: ', 1 instanceof F) // 有效 true 无效 false 理想值：true 实际值：true
```

## Symbol.isConcatSpreadable

该属性决定是否支持 concat

```js
let objs = {
  0: 'obj-item1',
  1: 'obj-item2',
  length: 2,
  [Symbol.isConcatSpreadable]: true
} // 类数组
console.log('["arr-item0"].concat(objs): ', ['arr-item0'].concat(objs))
```

## Symbol.toPrimitive

- 标准类型的原型上都存在该方法，比如 对象尝试转为原始值的时候就会调用该方法
- 在进行类型转换的时候，会传入一个参数，规范将该参数叫做 hint
- hint 取值为('number','string','default')
  - number => number
  - string => string
  - default => 默认
- 大多数默认的情况就是数字模式(除了日期，它默认是字符串模式)
- number mode(数字模式)行为情况(优先级从高到低)
  - 首先调用 valueOf,如果是原始值，则返回
  - 如果不是原始值，则调用 toString，如果是原始值，则返回
  - 如果不是原始值，报错
- string mode(字符串模式)行为情况(优先级从高到低)
  - 首先调用 toString,如果是原始值，则返回
  - 如果不是原始值，则调用 valueOf,如果是原始值，则返回
  - 如果不是原始值，报错

```js
let objp = {
  valueOf: function() {
    console.log('valueOf')
  },
  toString: function() {
    console.log('toString')
  }
}
// console.log value is
objp + 2 //valueOf
objp == 2 // valueOf
Number(objp) // valueOf
String(objp) // toString
```

通过上面的输出，可以发现大多数的情况都是首先调用 valueOf. 包括默认的情况，他的默认是调用的数字模式，而且绝大数都是调用的数字模式，可以发现 toString 是调用了 string 的模式。所以你可以认为，基本就是数字模式，除非很显式的指明是字符串模式。

## Symbol.species

这个需要联系 class 的上下文来阐述了，[传送门]()

## Symbol.iterator

我们知道可以通过`for .. in`来获取对象的属性名字，而`for .. of`是获取对应的`value`.

并且`for .. of`是需要`iterable`才可以。

```js
// example1
let arr = ['wzp']
let it = ar[Symbol.iterator]()
it // Array Iterator
it.next() // {value: "wzp", done: false}
it.next() // {value: undefined, done: true}

//example2
let str = 'string'
let it = str[Symbol.iterator]()
it // StringIterator

// example3
let o = { name: 'wzp' }
let obj = o[Symbol.iterator]() //Uncaught TypeError: o[Symbol.iterator] is not a function
```

对象不可用`for..of`来遍历，因为没有`Symbol.iterator`方法,我们给对象手动添加这个方法

```js
let range = {
  from: 1,
  to: 5
}

// 我们想要的效果:
// for(let num of range) ... num=1,2,3,4,5
```

改写：

```js
let range = {
  from: 1,
  to: 5
}

// 1. for..of 默认调用iterator
range[Symbol.iterator] = function() {
  // 2. 返回一个遍历器对象:
  return {
    current: this.from,
    last: this.to,

    // 3.在for..of每次循环会调用next函数
    next() {
      // 4. 返回一个对象形如 {done:.., value :...}
      if (this.current <= this.last) {
        return { done: false, value: this.current++ }
      } else {
        return { done: true }
      }
    }
  }
}

// 现在就可以遍历该对象了
for (let num of range) {
  alert(num) // 1, then 2, 3, 4, 5
}
```

## 参考

> [symbol](https://xiaohesong.gitbook.io/today-i-learn/front-end/es6/understanding-es6/symbol)
