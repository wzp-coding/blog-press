---
title: node-eventloop
---

# 深入浅出node

[[toc]]



## 单线程node

Node保持了JavaScript在浏览器中单线程的特点，而且在Node中，JavaScript与其余线程是无法共享任何状态的。

单线程的好处

- 不用像多线程编程那样处处在意状态的同步问题，这里没有死锁的存在
- 没有线程上下文交换所带来的性能上的开销

单线程的弱点

- 无法利用多核CPU
- 错误会引起整个应用退出，应用的健壮性值得考验
- 大量计算占用CPU导致无法继续调用异步I/O
  - 浏览器中使用Web Workers创建工作线程，通过消息传递的机制来传递运行结果
  - Node中使用child_process来创建子进程，通过进程之间的事件消息来传递结果

## I/O密集型和CPU密集型

I/O密集的优势主要在于Node利用事件循环的处理能力，而不是启动每一个线程为每一个请求服务，资源占用极少

CPU密集型应用给Node带来的挑战主要是：由于JavaScript单线程的原因，如果有长时间运行的计算（比如大循环），将会导致CPU时间片不能释放，使得后续I/O无法发起，但是适当调整和分解大型运算任务为多个小任务，使得运算能够适时释放

## 实现一个tls握手



## 关于cookie，session

普通cookie生成流程：用户登录 => 服务端生成cookie字符串,通过Set-Cookie字段传递到客户端 => 客户端浏览器再次发送请求时会携带cookie

> cookie常用字段如下
>
> - NAME=VALUE
>   - 指定cookie的名称和值，名称大小写不敏感，值必须经过URL编码。
> - domain=域名
>   - cookie的有效域名，所有向该域发送的请求中都会包括这个cookie信息，这个值可以包含子域(如：www.baidu.com，那么这个cookie的有效域就是www.baidu.com),也可以不包含子域(如：.baidu.com,那么这个cookie对所有的baidu.com的子域都有效)，如果没有指定这个值，它的默认值为设置cookie的那个域。正是因为这一限制，cookie是不能跨域的（www.qq.com不能访问到www.baidu.com下的cookie）
> - path=路径
>   - 用于指定向域中的哪个路径发送请求时，应该带上这个cookie,如果不指定，默认为当前目录及其子目录有效。例如，你可以指定cookie只有从www.baidu.com/one/中才能访问，那么www.baidu.com的页面就不能发送cookie
> - expires=Date
>   - cookie的有效时间(即：何时应该停止向服务端发送这个cookie)，默认情况下浏览器会话结束就会删除所有的cookie，不过可以自己设置cookie的有效时间。如果将cookie的有效时间设置为一个过去的时间，那么这个cookie会立即被删除
> - Secure
>   - 在HTTPS安全通信时才会发送cookie
> - HttpOnly
>   - 该cookie不能被脚本访问
>
> 例子  Set-Cookie:myCookie=123;domain=www.baidu.com;path=/one/;expires=Mon,22-Jan-07 07:10:24 GMT;Secure;HttpOnly

### 普通cookie的缺点

1. cookie体积过大
2. cookie信息容易被攥改

为了解决上述问题，session出现了，原理是将session数据保存在服务端，并且通过sessionId唯一标识，将sessionId传递给客户端

session-cookie生成流程：用户登录 => 服务端发现cookie中没有sessionId，则生成session数据存储在服务端，生成对应的sessionId，将sessionId放到cookie中通过Set-Cookie传递给客户端 => 客户端浏览器再次发送请求时会携带cookie

### 服务端session存储问题

1. 如果将session直接存储在内存中，用户量一旦增多，内存很容易就达到上限，同时也会引起垃圾回收的频繁扫描，出现性能问题

2. 为了利用多核CPU，通常开启多个进程，用户请求的连接将可能随意分配到各个进程中，node中进程与进程之间是不能直接共享内存，用户的session可能引起错乱

解决以上问题的思路是将session集中化，目前常用的工具有Redis、Memcached等

采用第三方缓存来存储session引起的一个问题是会引起网络访问，涉及到握手，传输以及网络终端自身的磁盘I/O等会比访问内存速度慢

但是采用高速缓存的理由有以下：

- Node与缓存服务保持长连接，而非频繁的短连接，握手导致的延迟只影响初始化
- 高速缓存直接在内存中进行数据存储和访问
- 缓存服务通常与Node进程运行在相同的机器上或者相同的机房里，网络速度收的影响较小

### sessionId被伪造？

sessionId不加密发送给客户端，容易被伪造，如何解决呢？可以在服务端**用私钥加密sessionId得到签名信息**拼接上**原sessionId**发送给客户端，由于服务端**私钥其它人不可能知道**，所以很难伪造**签名信息**，服务端拿到客户端的发送过来的cookie时，只需要用私钥对原sessionId进行加密得到**签名信息**，对比**前后签名信息**是否一致，不一致则说明sessionId被伪造了

仅仅对sessionId签名其实还不够，一旦攻击者通过某种方式获取了一个真实的sessionId和签名，他就能实现身份的伪装

一种解决方案是将客户端的某些独有信息与sessionId作为原值进行签名，这样攻击者一旦不在原始的客户端上进行访问，就会导致签名失败。

> 独有信息包括用户IP和用户代理（User Agent）


## 调用堆栈

调用堆栈是一个 LIFO 队列（后进先出）。

事件循环不断地检查调用堆栈，以查看是否需要运行任何函数。

当执行时，它会将找到的所有函数调用添加到调用堆栈中，并按顺序执行每个函数。

你知道在调试器或浏览器控制台中可能熟悉的错误堆栈跟踪吗？ 浏览器在调用堆栈中查找函数名称，以告知你是哪个函数发起了当前的调用：

![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/exception-call-stack.png)

## 消息队列

当调用 setTimeout() 时，浏览器或 Node.js 会启动定时器。 当定时器到期时，则回调函数会被放入“消息队列”中。

在消息队列中，用户触发的事件（如单击或键盘事件、或获取响应）也会在此排队，然后代码才有机会对其作出反应。 类似 `onLoad` 这样的 DOM 事件也如此。

事件循环会赋予调用堆栈优先级，它首先处理在调用堆栈中找到的所有东西，一旦其中没有任何东西，便开始处理消息队列中的东西。

我们不必等待诸如 `setTimeout`、fetch、或其他的函数来完成它们自身的工作，因为它们是由浏览器提供的，并且位于它们自身的线程中。 例如，如果将 `setTimeout` 的超时设置为 2 秒，但不必等待 2 秒，等待发生在其他地方。

## process.nextTick()

当尝试了解 Node.js 事件循环时，其中一个重要的部分就是 `process.nextTick()`。

每当事件循环进行一次完整的行程时，我们都将其称为一个滴答。

当将一个函数传给 `process.nextTick()` 时，则指示引擎在当前操作结束（在下一个事件循环滴答开始之前）时调用此函数：

```javascript
process.nextTick(() => {
  //做些事情
})
```

事件循环正在忙于处理当前的函数代码。

当该操作结束时，JS 引擎会运行在该操作期间传给 `nextTick` 调用的所有函数。

这是可以告诉 JS 引擎异步地（在当前函数之后）处理函数的方式，但是尽快执行而不是将其排入队列。

调用 `setTimeout(() => {}, 0)` 会在下一个滴答结束时执行该函数，比使用 `nextTick()`（其会优先执行该调用并在下一个滴答开始之前执行该函数）晚得多。

当要确保在下一个事件循环迭代中代码已被执行，则使用 `nextTick()`。


## `setImmediate()` 与 `setTimeout(() => {}, 0)`（传入 0 毫秒的超时）、`process.nextTick()` 有何不同？

传给 `process.nextTick()` 的函数会在事件循环的当前迭代中（当前操作结束之后）被执行。 这意味着它会始终在 `setTimeout` 和 `setImmediate` 之前执行。

延迟 0 毫秒的 `setTimeout()` 回调与 `setImmediate()` 非常相似。 执行顺序取决于各种因素，但是它们都会在事件循环的下一个迭代中运行。


## 递归的 setTimeout

`setInterval` 每 n 毫秒启动一个函数，而无需考虑函数何时完成执行。

如果一个函数总是花费相同的时间，那就没问题了：

[![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/setinterval-ok.png)](http://nodejs.cn/static/fa9e9fec1aea517d98b47b11c5fec296/4d383/setinterval-ok.png)

函数可能需要不同的执行时间，这具体取决于网络条件，例如：

![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/setinterval-varying-duration.png)

也许一个较长时间的执行会与下一次执行重叠：

![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/setinterval-overlapping.png)

为了避免这种情况，可以在回调函数完成时安排要被调用的递归的 setTimeout：

```javascript
const myFunction = () => {
  // 做些事情

  setTimeout(myFunction, 1000)
}

setTimeout(myFunction, 1000)
```

实现此方案：

![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/recursive-settimeout.png)](http://nodejs.cn/static/4bde07363650160e953f899734adc29e/1790f/recursive-settimeout.png)

`setTimeout` 和 `setInterval` 可通过[定时器模块](http://nodejs.cn/api/timers.html)在 Node.js 中使用。

Node.js 还提供 `setImmediate()`（相当于使用 `setTimeout(() => {}, 0)`），通常用于与 Node.js 事件循环配合使用。

## 参考
> [node 事件循环](http://nodejs.cn/learn/the-nodejs-event-loop)
>
> [process.nextTick()](http://nodejs.cn/learn/understanding-process-nexttick)
>
> [setImmediate()](http://nodejs.cn/learn/understanding-setimmediate)
>
> [JS定时器](http://nodejs.cn/learn/discover-javascript-timers)

