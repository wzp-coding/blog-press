---
title: vue3.x源码
---

# vue3.x 源码摸索

[[toc]]

## vnode 到真实 DOM

整个过程的思维导图（超级详细包含代码）

[在线查看-processon 思维导图](https://www.processon.com/embed/61bafee8e0b34d6b524a594e)

## vue3.x 中的工具函数

### EMPTY_OBJ 空对象

```js
const EMPTY_OBJ = process.env.NODE_ENV !== 'production' ? Object.freeze({}) : {}
```

开发环境需要报错信息，冻结对象

生产环境不需要报错信息，不冻结对象

### EMPTY_ARR 空数组

```js
const EMPTY_ARR = process.env.NODE_ENV !== 'production' ? Object.freeze([]) : []
```

### NOOP 空函数

```js
const NOOP = () => {}
```

1. 方便判断
2. 方便压缩

### NO 永远返回 false 的函数

```js
const NO = () => false
```

方便压缩

### 判断字符串是不是 on 开头，并且 on 后首字母是大写字母

```js
const onRE = /^on[^a-z]/
const isOn = (key) => onRE.test(key)
```

### 判断是否是 isModelListener 监听器

判断是不是'onUpdate:'开头既可

```js
const isModelListener = (key) => key.startsWith('onUpdate:')
```

### extend 继承合并

```js
const extend = Object.assign
```

### remove 移除数组的一项

```js
const remove = (arr, el) => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}
```

splice 其实是一个很耗性能的方法。删除数组中的一项，其他元素都要移动位置。

> 引申：axios InterceptorManager 拦截器源码 中，拦截器用数组存储的。
>
> 但实际移除拦截器时，只是把拦截器置为 null 。而不是用 splice 移除。
>
> 最后执行时为 null 的不执行，同样效果。
>
> axios 拦截器这个场景下，不得不说为性能做到了很好的考虑。

### hasOwn 是不是自己本身所拥有的属性

```js
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (val, key) => hasOwnProperty.call(val, key)
```

### isArray 判断数组

```js
const isArray = Array.isArray
```

### isMap 判断是不是 Map 对象

```js
const isMap = (val) => toTypeString(val) === '[object Map]'
```

### isSet 判断是不是 Set 对象

```js
const isSet = (val) => toTypeString(val) === '[object Set]'
```

### isDate 判断是不是 Date 对象

```js
const isDate = (val) => val instanceof Date
```

### isFunction 判断是不是函数

```js
const isFunction = (val) => typeof val === 'function'
```

### isString 判断是不是字符串

```js
const isString = (val) => typeof val === 'string'
```

### isSymbol 判断是不是 Symbol

```js
const isSymbol = (val) => typeof val === 'symbol'
```

### isObject 判断是不是对象

```js
const isObject = (val) => val !== null && typeof val === 'object'
```

### isPromise 判断是不是 Promise

```js
const isPromise = (val) =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)
```

### objectToString 对象转字符串

```js
const objectToString = Object.prototype.toString
```

### toTypeString 对象转字符串

```js
const toTypeString = (val) => objectToString.call(val)
```

### toRawType 对象转字符串，截取后几位

```js
const toRawType = (val) => toTypeString(val).slice(8, -1)
```

### isPlainObject 判断是不是纯粹的对象

```js
const isPlainObject = (val) => toTypeString(val) === '[object Object]'
```

### isIntegerKey 判断是不是数字型的字符串 key 值

```js
const isIntegerKey = (val) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  key === '' + parseInt(key, 10)
```

### makeMap && isReservedProp

判断一个属性是否为保留属性

```js
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? (val) => !!map[val.toLowerCase()]
    : (val) => !!map[val]
}
```

### cacheStringFunction 缓存

```js
const cacheStringFunction = (fn) => {
  const cache = Object.create(null)
  return (str) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}
```

### 连字符 - 转驼峰 on-click => onClick

```js
const camelizeRE = /-(\w)/g
const camelize = cacheStringFunction((str) =>
  str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
)
```

### 驼峰 转 连字符 - onClick => on-click

```js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = cacheStringFunction((str) =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
)
```

### 首字母转大写

```js
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
)
```

### click => onClick

```js
const toHandleKey = cacheStringFunction((str) =>
  str ? `on${capitalize(str)}` : ''
)
```

### hasChanged 判断是不是有变化

```js
const hasChanged = (val, oldVal) => !Object.is(val, oldVal)
```

### invokeArrayFns 执行数组里的函数

```js
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg)
  }
}
```

### def 定义对象属性

```js
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  })
}
```

数据描述符（其中属性为：enumerable，configurable，value，writable）与存取描述符（其中属性为 enumerable，configurable，set()，get()）之间是有互斥关系的。在定义了 set()和 get()之后，描述符会认为存取操作已被 定义了，其中再定义 value 和 writable 会引起错误。

### toNumber 转数字

```js
const toNumer = (val) => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

### getGlobalThis 全局对象

```js
let _globalThis
const getGlobalThis = () => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : {})
  )
}
```

## 参考

> [初学者也能看懂的 Vue3 源码中那些实用的基础工具函数](https://lxchuan12.gitee.io/vue-next-utils/)
>
> [据说 99% 的人不知道 vue-devtools 还能直接打开对应组件文件？本文原理揭秘](https://juejin.cn/post/6959348263547830280#heading-15)
