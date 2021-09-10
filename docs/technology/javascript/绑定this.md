---
title: bind实现
---

# 你知道bind，apply，call原理吗

## 函数调用的四种方式
实现apply之前我们先了解一下函数调用的四种方式，你可能写过这四种方式，但有些人可能说不出来(比如我)
### 作为一个普通的函数进行调用
```js
var name = "wName";

function fn() {
    var name = 'test';
    innerFunction();
    function innerFunction() {
        console.log(this.name);      // wName
    }
}

fn()
```
这样一个最简单的函数，不属于任何一个对象，就是一个函数，这样的情况在 JavaScript 的在浏览器中的非严格模式默认是属于全局对象 window 的，在严格模式，就是 undefined。 
但这是一个全局的函数，很容易产生命名冲突，所以不建议这样使用。

### 函数作为对象方法调用
```js
var name = "wName";
var a = {
    name: "test",
    fn : function () {
        console.log(this.name);      // test
    }
}
a.fn();
```

这里定义一个对象 a，对象 a 有一个属性（name）和一个方法（fn）。

然后对象 a 通过 . 方法调用了其中的 fn 方法。

然后我们一直记住的那句话“this 永远指向最后调用它的那个对象”，所以在 fn 中的 this 就是指向 a 的。

### 使用构造函数调用函数

```js
// 构造函数:
function myFunction(arg1, arg2) {
    this.firstName = arg1;
    this.lastName  = arg2;
}

// This    creates a new object
var a = new myFunction("Li","test");
a.lastName;                             // 返回 "test"
```
如果函数调用前使用了 new 关键字, 则是调用了构造函数。
这看起来就像创建了新的函数，但实际上 JavaScript 函数是重新创建的对象

### 作为函数方法调用
```js
var name = "wName";

function fn() {
    var name = 'test';
    innerFunction();
    function innerFunction() {
        console.log(this.name);      // wName
    }
}

fn.call(null)
```
在 JavaScript 中, 函数是对象。
JavaScript 函数有它的属性和方法。call() 和 apply() 是预定义的函数方法。 两个方法可用于调用函数，两个方法的第一个参数必须是对象本身
在 JavaScript 严格模式(strict mode)下, 在调用函数时第一个参数会成为 this 的值， 即使该参数不是一个对象。在 JavaScript 非严格模式(non-strict mode)下, 如果第一个参数的值是 null 或 undefined, 它将使用全局对象替代。

## 代码实现
### apply
第一步先实现apply，看一看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)上apply的定义
> apply() 方法调用一个函数, 其具有一个指定的this值，以及作为一个数组（或类似数组的对象）提供的参数

```js
// apply原理
Function.prototype.myApply = function (ctx) {
  ctx = ctx || window; //处理null值
  ctx.__fn = this; //拿到函数，放入上下文中的属性
  let args = arguments[1]; //拿到参数
  if (args === void 0) {
    // 无参数
    return ctx.__fn();
  }
  // 拼接参数(这里注意！！参数是用逗号分隔的,并且每个参数都是变量，不能直接join后传字符串)
  let fnStr = "ctx.__fn(";
  for (let i = 0; i < args.length; i++) {
    Object.prototype.toString.call(args[i]) === "[object String]"
      ? (args[i] = `'${args[i]}'`)
      : ""; //如果参数是字符串，需要再包一个引号，因为字符串拼接会自动去除引号
    fnStr += i == args.length - 1 ? args[i] : args[i] + ",";
  }
  fnStr += ")";
  const res = eval(fnStr);
  delete ctx.__fn;
  return res;
};
```
### call
同样是看一看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)上call的定义
> call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。

实现了apply的基础上去实现call就容易多了，因为它们只是参数类型不同

```js
// call原理
Function.prototype.myCall = function () {
  const ctx = [].shift.myApply(arguments);
  const args = Array.from(arguments);
  return this.myApply(ctx, args);
};
```
### bind
接下来重头戏bind，同样是先看一看[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)上bind的定义

> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
// bind原理
Function.prototype.myBind = function () {
  if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }
  let me = this;// 保存函数定义
  const ctx = [].shift.myApply(arguments);// 获取第一个参数
  let args = arguments;// 获取其它参数
  function F() {}// 声明一个构造函数
  let bound = function () {
      // 如果bound作为构造函数调用，则此时的this(与上面的this不同)指向new的实例,ctx应该无效
    let is_new_call = this instanceof F;
    return me.myApply(is_new_call ? this : ctx , [
        ...args,
      ...arguments,
    ]);
  };
  F.prototype = this.prototype;// 将构造函数F的原型对象指向this(函数)的原型对象，使得F构造出来的对象继承原函数的原型方法
  /* 如果new bound()调用，实例的__proto__应该指向原函数的prototype
   如何找到 实例的__proto__ 和 原函数的prototype
   实例的__proto__ === bound.prototype
   原函数的prototype === F.prototype
  */
  bound.prototype.__proto__ = F.prototype;
    /* 问题：为什么要写成.__proto__指向F.prototype呢
    其实这样相当于写成bound.prototype = new F()
    当然也可以直接写bound.prototype = F.prototype
    只是有个小问题，当修改bound.prototype的时候，F.prototype也被修改了
    */ 
  return bound;
};
```
### 代码测试

```js
// 测试
function test(b, c) {
  console.log(this.a);
  console.log(b);
  console.log(c);
}
let obja = { a: "a" };
let objb = { a: "b" };
let objc = { a: "c" };

function Test(a) {
  this.a = a;
  console.log(this.a);
}
console.log('测试new、bind优先级')
const bindTest = Test.myBind(obja);
const t = new bindTest("b");
console.log(t.a); //b

console.log('测试apply，call,bind')
test.myApply(obja, ['b']);
test.myCall(obja, 'b', 'c')
test.myBind(obja, 'b')('c');

console.log('测试多次bind，this指向？')
function fun() {
  console.log(this.a);
}
fun = fun.myBind(obja);
fun = fun.myBind(objb);
fun = fun.myBind(objc);
fun();
```


## 面试点

### new、bind优先级
根据刚刚写源码可知，当出现new调用时，bind无效，也就是说new的优先级比较高

### 多次bind，最终this的指向
由于每次bind都是返回一个新函数，最终调用的时候第一次bind的函数，也就是指向第一个bind的对象




## 参考
> [this、apply、call、bind](https://juejin.cn/post/6844903496253177863#heading-14)
>
> [JavaScript深入之bind的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)