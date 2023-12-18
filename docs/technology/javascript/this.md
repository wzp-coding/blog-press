---
title: this到底是什么？
---

# 了解一下 this

[[toc]]

## 提出疑问

先来看一段程序

```js
var value = 1

var foo = {
  value: 2,
  bar: function() {
    return this.value
  }
}

//示例1
console.log(foo.bar())
//示例2
console.log(foo.bar())
//示例3
console.log((foo.bar = foo.bar)())
//示例4
console.log((false || foo.bar)())
//示例5
console.log((foo.bar, foo.bar)())
```

如果你一次就能全部答对，恭喜你，不用看文章了

## 前置知识

### Reference 类型

ECMAScript 的类型分为语言类型和规范类型。

ECMAScript 语言类型是开发者直接使用 ECMAScript 可以操作的。其实就是我们常说的 Undefined, Null, Boolean, String, Number, 和 Object。

而规范类型相当于 meta-values，是用来用算法描述 ECMAScript 语言结构和 ECMAScript 语言类型的。规范类型包括：Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。

### 什么是 Reference？

Reference 类型就是用来解释诸如 delete、typeof 以及赋值等操作行为的。

Reference 的构成，有三个组成部分，分别是：

- base value
- referenced name
- strict reference

可是这些到底是什么呢？

我们简单的理解的话：

base value 就是属性所在的对象或者就是 EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。

referenced name 就是属性的名称。

举个例子：

```js
var foo = 1

// 对应的Reference是：
var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false
}
```

再举个例子：

```js
var foo = {
  bar: function() {
    return this
  }
}

foo.bar() // foo

// bar对应的Reference是：
var BarReference = {
  base: foo,
  propertyName: 'bar',
  strict: false
}
```

而且规范中还提供了获取 Reference 组成部分的方法，比如 GetBase 和 IsPropertyReference。

这两个方法很简单，简单看一看：

1.GetBase

> GetBase(V). Returns the base value component of the reference V.

返回 reference 的 base value。

2.IsPropertyReference

> IsPropertyReference(V). Returns true if either the base value is an object or HasPrimitiveBase(V) is true; otherwise returns false.

简单的理解：如果 base value 是一个对象，就返回 true。

### **重点了解一下 GetValue！！！**

在 8.7.1 章规范中就讲了一个用于从 Reference 类型获取对应值的方法： GetValue。

简单模拟 GetValue 的使用：

```js
var foo = 1

var fooReference = {
  base: EnvironmentRecord,
  name: 'foo',
  strict: false
}

GetValue(fooReference) // 1;
```

GetValue 返回对象属性真正的值，但是要注意：

**！！！调用 GetValue，返回的将是具体的值，而不再是一个 Reference**

## 如何确定 this 的值？

看规范 11.2.3 Function Calls：

这里讲了当函数调用的时候，如何确定 this 的取值。

只看第一步、第六步、第七步：

> 1.Let _ref_ be the result of evaluating MemberExpression.

> 6.If Type(_ref_) is Reference, then

> ```
>   a.If IsPropertyReference(ref) is true, then
> ```

> ```
>       i.Let thisValue be GetBase(ref).
> ```

> ```
>   b.Else, the base of ref is an Environment Record
> ```

> ```
>       i.Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).
> ```
>
> 7.Else, Type(_ref_) is not Reference.

> ```
>   a. Let thisValue be undefined.
> ```

让我们描述一下：

1.计算 MemberExpression 的结果赋值给 ref

2.判断 ref 是不是一个 Reference 类型

- 2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)
- 2.2 如果 ref 是 Reference，并且 base value 值是 Environment Record, 那么 this 的值为 ImplicitThisValue(ref)

- 2.3 如果 ref 不是 Reference，那么 this 的值为 undefined

## 具体分析

让我们一步一步看：

1. 计算 MemberExpression 的结果赋值给 ref

什么是 MemberExpression？看规范 11.2 Left-Hand-Side Expressions：

MemberExpression :

- PrimaryExpression // 原始表达式 可以参见《JavaScript 权威指南第四章》
- FunctionExpression // 函数定义表达式
- MemberExpression [ Expression ] // 属性访问表达式
- MemberExpression . IdentifierName // 属性访问表达式
- new MemberExpression Arguments // 对象创建表达式

举个例子：

```js
function foo() {
  console.log(this)
}

foo() // MemberExpression 是 foo

function foo() {
  return function() {
    console.log(this)
  }
}

foo()() // MemberExpression 是 foo()

var foo = {
  bar: function() {
    return this
  }
}

foo.bar() // MemberExpression 是 foo.bar
```

所以**简单理解 MemberExpression 其实就是()左边的部分。**

2.判断 ref 是不是一个 Reference 类型。

关键就在于看规范是如何处理各种 MemberExpression，返回的结果是不是一个 Reference 类型。

举最后一个例子：

```js
var value = 1

var foo = {
  value: 2,
  bar: function() {
    return this.value
  }
}

//示例1
console.log(foo.bar())
//示例2
console.log(foo.bar())
//示例3
console.log((foo.bar = foo.bar)())
//示例4
console.log((false || foo.bar)())
//示例5
console.log((foo.bar, foo.bar)())
```

### foo.bar()

在示例 1 中，MemberExpression 计算的结果是 foo.bar，那么 foo.bar 是不是一个 Reference 呢？

查看规范 11.2.1 Property Accessors，这里展示了一个计算的过程，什么都不管了，就看最后一步：

> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.

我们得知该表达式返回了一个 Reference 类型！

根据之前的内容，我们知道该值为：

```
var Reference = {
  base: foo,
  name: 'bar',
  strict: false
};
```

接下来按照 2.1 的判断流程走：

> 2.1 如果 ref 是 Reference，并且 IsPropertyReference(ref) 是 true, 那么 this 的值为 GetBase(ref)

该值是 Reference 类型，那么 IsPropertyReference(ref) 的结果是多少呢？

前面我们已经铺垫了 IsPropertyReference 方法，如果 base value 是一个对象，结果返回 true。

base value 为 foo，是一个对象，所以 IsPropertyReference(ref) 结果为 true。

这个时候我们就可以确定 this 的值了：

```
this = GetBase(ref)，
```

GetBase 也已经铺垫了，获得 base value 值，这个例子中就是 foo，所以 this 的值就是 foo ，示例 1 的结果就是 2！

### (foo.bar)()

看示例 2：

```
console.log((foo.bar)());
```

foo.bar 被 () 包住，查看规范 11.1.6 The Grouping Operator

直接看结果部分：

> Return the result of evaluating Expression. This may be of type Reference.

> NOTE This algorithm does not apply GetValue to the result of evaluating Expression.

实际上 () 并没有对 MemberExpression 进行计算，所以其实跟示例 1 的结果是一样的。

### (foo.bar = foo.bar)()

看示例 3，有赋值操作符，查看规范 11.13.1 Simple Assignment ( = ):

计算的第三步：

> 3.Let rval be GetValue(rref).

因为使用了 GetValue，所以返回的值不是 Reference 类型，

按照之前讲的判断逻辑：

> 2.3 如果 ref 不是 Reference，那么 this 的值为 undefined

this 为 undefined，非严格模式下，this 的值为 undefined 的时候，其值会被隐式转换为全局对象。

### (false || foo.bar)()

看示例 4，逻辑与算法，查看规范 11.11 Binary Logical Operators：

计算第二步：

> 2.Let lval be GetValue(lref).

因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined

### (foo.bar, foo.bar)()

看示例 5，逗号操作符，查看规范 11.14 Comma Operator ( , )

计算第二步：

> 2.Call GetValue(lref).

因为使用了 GetValue，所以返回的不是 Reference 类型，this 为 undefined

## 程序答案

```js
var value = 1

var foo = {
  value: 2,
  bar: function() {
    return this.value
  }
}

//示例1
console.log(foo.bar()) // 2
//示例2
console.log(foo.bar()) // 2
//示例3
console.log((foo.bar = foo.bar)()) // 1
//示例4
console.log((false || foo.bar)()) // 1
//示例5
console.log((foo.bar, foo.bar)()) // 1
```

## 参考

> ECMAScript 5.1 规范地址：
>
> 英文版：http://es5.github.io/#x15.1
>
> 中文版：http://yanhaijing.com/es5/#115
>
> [冴羽的博客](https://github.com/mqyqingfeng/Blog/issues/7)
