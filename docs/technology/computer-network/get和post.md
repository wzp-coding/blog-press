---
title: get和post
---

# 了解一下 get 和 post 的区别

[[toc]]

## 直观区别

1. get 一般用来获取数据

   post 一般用来提交数据

2. get 参数是有长度限制的（浏览器和 Web 服务器的限制了 url 的长度，不同的浏览器和 Web 服务器，限制的最大长度不一样，例如，IE 浏览器对 `URL`的最大限制为 2083 个字符，如果超过这个数字，提交按钮没有任何反应）

   post 无长度限制

3. get 只能进行 url 编码，只能接受 ASCII 字符

   post 没有限制

4. get 的参数是附加在 url 上的，以`?`来分割 url 和传输数据，多个参数的话用`&`连接

   post 请求则是把请求参数放在 body 中

5. get 是明文传输

   post 是通过请求体 body 传输，但开发者可以通过抓包工具看到，也相当于是明文传输的

6. get 请求会被主动保存在浏览器的历史记录中，也可能保存在 Web 服务器的日志中

   post 不会，除非手动设置

7. 同源的时候，get 请求会带有 Origin 字段

   post 不会，这个可能造成安全检查对错误.如果有 nginx 服务器,可以在 nginx 服务器上设置

8. get 请求一般设置 Content-type 为 application/x-www-form-urlencoded

   post 一般设置 Content-type 为 text/plain；chartset=utf-8，对于 post 请求，服务器后台以流的方式接收

9. get 请求在浏览器反复的回退/前进操作是无害的

   post 操作会再次提交表单请求

补充：head 请求与 GET 请求类似，但是不会返回消息体，并且 head 请求可以被缓存。

## post 真的安全吗？

- get 和 post 本质上都是 TCP 连接，但是由于浏览器的请求机制（先发送请求头，再发送请求体），从而使 get 和 post 在应用过程中产生了差异
- 两者有个较大的区别就是：

  - get 在请求时浏览器会发送**一个数据包**，将 header 和 data 发送过去

  - post 会发送**两个数据包**，第一次把 header 发送过去，服务器返回 100，第二次把 data 发送过去，服务器返回 200

    （火狐浏览器的请求机制不同，post 请求只发送一个数据包）

  - 补充：
    - 100 状态码：表示服务器已经收到请求的第一部分数据，正在等待其他数据的到达
    - 200 状态码：服务器已经成功的处理了请求，通常服务器提供了请求的网页

## 缓存方面

**get 一般用于类似查找的过程，用户获取数据，不必每次都跟数据库连接，可以使用缓存**

**post 一般用于修改和删除操作，所以必须与数据库交互，不适合做缓存**

### 安全、幂等、缓存

**safe（安全）**

这里的安全和通常所理解的安全意义不同，就好比如果一个请求的语义本质上就是获取数据（只读），那么这个请求就是安全的。客户端向服务器发起的请求如果没有引起服务器端任何的状态变化，那么他就是安全的而 post 请求来提交数据必然会是服务器发生相应的变化。从这个维度来看，**get 请求相对服务器而言，是安全的，post 则不安全的**。

**ldempotend（幂等）**

幂等通俗的来讲就是指同一个请求执行多次和仅执行一次的效果完全相等。这里来扯出幂等主要是为了处理同一个请求重复发送的情况，假如在请求响应之前失去连接，如果这个请求时幂等的，那么就可以放心的重发一次请求。所以可以得出**get 请求时幂等的**，可以重复发送请求，**post 请求时不幂等的**，重复请求可能会发生无法预知的后果。

**cacheable（可缓存性）**

顾名思义，就是一个请求是否可以被缓存，绝大多数部分，**post 都是不可缓存的**（某些浏览器可能支持 post 缓存），但**get 是可以缓存的**

**勉强理解一下大概就是：**

get 是请求获取指定资源，**get 方法时安全、幂等、可缓存的**，get 方法的报文主体没有任何语义。

post 是根据报文主体来对指定资源做出处理，**post 不安全，不幂等，不可缓存**（大部分情况下）。

## W3C 官网的比较

![image-20211112142245238](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/image-20211112142245238.png)

## 浏览器对 URL 长度限制

1. IE

   IE 浏览器（Microsoft Internet Explorer）对 url 长度限制是 2083（2K+53），超过这个限制，则自动截断（若是 form 提交则按钮不起作用）

2. FireFox

   火狐浏览器（FireFox）对 url 长度限制是 65536 个字符，但实际上有效的 url 最大长度不少于 100 000（十万） 个字符

3. Chrome

   谷歌（Chrome）对 url 长度限制是 8182 个字符，超过则报错

   如下服务器错误：

   Request-URI Too Large The requested URL's length exceeds the capacity limit for this server. Apache/2.2.12 (Ubuntu) Server at 127.0.1.1 Port 80

4. Safari

   Safari 对 url 长度限制至少为 80 000 （八万）个字符

5. Opera

   Opera 浏览器对 url 长度限制是 190 000（一百九十万）个字符，Opera 9 地址栏中输入 190 000 字符时依然能正常编辑

## 浏览器预检请求

在很多情况下，当我们在 JS 里面调用一次 ajax 请求时，在浏览器那边却会查询到两次请求，第一次的 Request Method 参数是 OPTIONS，还有一次就是我们真正的请求，比如 get 或是 post 请求方式

查阅相关资料之后发现，这是浏览器对复杂跨域请求的一种处理方式，在真正发送请求之前，会先进行一次预检请求，就是我们刚刚说的参数为 OPTIONS 的第一次请求，它的作用是用于试探服务器响应是否正确，即是否能接受真正的请求，如果在 OPTIONS 请求之后获取到的响应式拒绝性质的，例如 500 等 http 状态，那么它就会停止第二次的真正请求的访问

大致说明一下，有三种方式会导致这种现象：

1. 请求的方法不是 GET/HEAD/POST

2. POST 请求的 Content-Type 并非 application/x-www-form-urlencoded，multipart/form-data，或 text/plain

3. 请求设置了自定义的 header 字段

   比如我的 Content-Type 设置为“application/json;charset=utf-8”，并且自定义了 header 选项导致了这种情况

## HTTP 请求方法

![image-20201210141846106](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/image-20201210141846106.png)

## 参考

> [get 和 post 的区别？](https://juejin.im/post/6844903824738500615)
>
> [都 2020 年了，还理不清 GET 请求和 POST 请求区别？](https://juejin.cn/post/6844904097091420174#heading-5)
>
> [预检请求 OPTIONS](https://zhuanlan.zhihu.com/p/46405073)
>
> [各个浏览器及 web 服务器对 URL（get）长度的限制](https://my.oschina.net/ZL520/blog/2995860)
>
> [URL 最大长度问题](https://www.cnblogs.com/henryhappier/archive/2010/10/09/1846554.html)
