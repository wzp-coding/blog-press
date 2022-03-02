---
title: vue3.x源码
---

# vue3.x源码摸索

[[toc]]

## vue-devtools打开editor原理

利用`nodejs`中的`child_process`，执行了类似`code path/to/file`命令，于是对应编辑器就打开了相应的文件，而对应的编辑器则是通过在进程中执行`ps x`（`Window`则用`Get-Process`）命令来查找的，当然也可以自己指定编辑器



## vnode到真实DOM

整个过程的思维导图（超级详细包含代码）

[在线查看-processon思维导图](https://www.processon.com/embed/61bafee8e0b34d6b524a594e)

### 为什么绕一大圈用ensureRenderer() 来生成renderer

用`ensureRenderer()`来延时创建渲染器这样做的好处是当用户只依赖响应式包的时候，就不会创建渲染器，因此可以通过 tree-shaking 的方式移除核心渲染逻辑相关的代码

### 为什么要重写mount方法，而不把相关逻辑放在 app 对象的 mount 方法内部来实现呢？

这是因为 `Vue.js` 不仅仅是为 Web 平台服务，它的目标是支持跨平台渲染，而 `createApp` 函数内部的 `app.mount` 方法是一个标准的可跨平台的组件渲染流程

标准的跨平台渲染流程是先创建 `vnode`，再渲染 `vnode`。此外参数 `rootContainer` 也可以是不同类型的值，比如，在 Web 平台它是一个 DOM 对象，而在其他平台（比如 `Weex` 和小程序）中可以是其他类型的值。所以这里面的代码不应该包含任何特定平台相关的逻辑，也就是说这些代码的执行逻辑都是与平台无关的。因此我们需要在外部重写这个方法，来完善 Web 平台下的渲染逻辑。

###  vnode 有什么优势呢？为什么一定要设计 vnode 这样的数据结构呢？

首先是**抽象**，引入 vnode，可以把渲染过程抽象化，从而使得组件的抽象能力也得到提升。

其次是**跨平台**，因为 `patch vnode` 的过程不同平台可以有自己的实现，基于 `vnode` 再做服务端渲染、`Weex` 平台、小程序平台的渲染都变得容易了很多。

> 不过这里要特别注意，使用 `vnode` 并不意味着不用操作 DOM 了，很多同学会误以为 `vnode` 的性能一定比手动操作原生 DOM 好，这个其实是不一定的。
>
> 因为，首先这种基于 `vnode` 实现的 `MVVM` 框架，在每次 `render to vnode` 的过程中，渲染组件会有一定的 JavaScript 耗时，特别是大组件，比如一个 1000 * 10 的 Table 组件，`render to vnode` 的过程会遍历 1000 * 10 次去创建内部 `cell vnode`，整个耗时就会变得比较长，加上 `patch vnode` 的过程也会有一定的耗时，当我们去更新组件的时候，用户会感觉到明显的卡顿。虽然 `diff` 算法在减少 DOM 操作方面足够优秀，但最终还是免不了操作 DOM，所以说性能并不是 `vnode` 的优势。

### 在 `mountChildren` 的时候递归执行的是 patch 函数，而不是 `mountElement` 函数

因为子节点可能有其他类型的 `vnode`，比如组件 `vnode`。

### 平时开发页面就是把页面拆成一个个组件，那么组件的拆分粒度是越细越好吗？为什么呢？

并不是拆分粒度越小越好。

原因：

1、在我的日常开发中，有两种情况会去拆分组件，第一种是根据页面的布局或功能，将整个页面拆分成不同的模块组件，最后将这些模块组件拼起来形成页面；第二种是在实现第一部拆分出来的这些模块组件的时候，发现其中有一些模块组件具有相同或相似的功能点，将这些相似的功能点抽离出来写成公共组件，然后在各个模块中引用。无论是模块组件还是公共组件，拆分组件的出发点都和组件的大小粒度无关。可维护性和复用性才是拆分组件的出发点。

2、对于组件的渲染，会先通过`renderComponentRoot`去生成组件的子树`vnode`，再递归patch去处理这个子树`vnode`。也就是说，对于同样一个div，如果将其封装成组件的话，会比直接渲染一个div要多执行一次生成组件的子树`vnode`的过程。并且还要设置并运行带副作用的渲染函数。也就是说渲染组件比直接渲染元素要耗费更多的性能。如果组件过多，这些对应的过程就越多。如果按照组件粒度大小去划分组件的话会多出很多没有意义的渲染子树和设置并运行副作用函数的过程。

综上所述，并不是拆分粒度越小越好，只要按照可维护性和复用性去划分组件就好。





## vue3.x中的工具函数


### EMPTY_OBJ 空对象
```js
const EMPTY_OBJ = (process.env.NODE_ENV !== 'production') ? Object.freeze({}) : {};
```
开发环境需要报错信息，冻结对象

生产环境不需要报错信息，不冻结对象

### EMPTY_ARR 空数组
```js
const EMPTY_ARR = (process.env.NODE_ENV !== 'production') ? Object.freeze([]) : [];
```
### NOOP 空函数

```js
const NOOP = () => { };
```

1. 方便判断
2. 方便压缩

### NO 永远返回false的函数

```js
const NO = () => false
```

方便压缩

### 判断字符串是不是on开头，并且on后首字母是大写字母

```js
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
```

### 判断是否是isModelListener监听器

判断是不是'onUpdate:'开头既可

```js
const isModelListener = (key) => key.startsWith('onUpdate:');
```

### extend继承合并

```js
const extend = Object.assign;
```

### remove 移除数组的一项

```js
const remove = (arr, el) => {
    const i = arr.indexOf(el)
    if (i > -1) {
        arr.splice(i, 1);
    }
}
```

splice 其实是一个很耗性能的方法。删除数组中的一项，其他元素都要移动位置。

> 引申：axios InterceptorManager 拦截器源码 中，拦截器用数组存储的。
>
> 但实际移除拦截器时，只是把拦截器置为 null 。而不是用splice移除。
>
> 最后执行时为 null 的不执行，同样效果。
>
> axios 拦截器这个场景下，不得不说为性能做到了很好的考虑。

### hasOwn是不是自己本身所拥有的属性

```js
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (val, key) => hasOwnProperty.call(val, key)
```



### isArray 判断数组

```js
const isArray = Array.isArray
```



### isMap 判断是不是Map对象

```js
const isMap = (val) => toTypeString(val) === '[object Map]'
```



### isSet 判断是不是Set对象

```js
const isSet = (val) => toTypeString(val) === '[object Set]'
```



### isDate 判断是不是Date对象

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



### isSymbol 判断是不是Symbol

```js
const isSymbol = (val) => typeof val === 'symbol'
```



### isObject 判断是不是对象

```js
const isObject = (val) => val !== null && typeof val === 'object'
```



### isPromise 判断是不是Promise

```js
const isPromise = (val) => isObject(val) && isFunction(val.then) && isFunction(val.catch)
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



### isIntegerKey 判断是不是数字型的字符串key值

```js
const isIntegerKey = (val) => isString(key) && key !== 'NaN' && key[0] !== '-' && key === '' + parseInt(key, 10)
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
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
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
const camelize = cacheStringFunction((str) => str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : '')))
```

###  驼峰 转 连字符 -  onClick => on-click

```js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, '-$1').toLowerCase())
```

### 首字母转大写

```js
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1))
```



### click => onClick

```js
const toHandleKey = cacheStringFunction((str) => (str ? `on${capitalize(str)}` : ''))
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

数据描述符（其中属性为：enumerable，configurable，value，writable）与存取描述符（其中属性为enumerable，configurable，set()，get()）之间是有互斥关系的。
在定义了set()和get()之后，描述符会认为存取操作已被 定义了，其中再定义value和writable会引起错误。

### toNumber 转数字

```js
const toNumer = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n
}

```

### getGlobalThis 全局对象

```js
let _globalThis
const getGlobalThis = () => {
    return (_globalThis ||
        (_globalThis =
            typeof globalThis !== 'undefined'
                ? globalThis
                : typeof self !== 'undefined'
                    ? self
                    : typeof window !== 'undefined'
                        ? window
                        : typeof global !== 'undefined'
                            ? global
                            : {}))
}
```


## 参考
> [初学者也能看懂的 Vue3 源码中那些实用的基础工具函数](https://lxchuan12.gitee.io/vue-next-utils/)
>
> [据说 99% 的人不知道 vue-devtools 还能直接打开对应组件文件？本文原理揭秘](https://juejin.cn/post/6959348263547830280#heading-15)

