---
title: get和post
---

# 你知道get和post有啥区别吗？

[[toc]]

## 直观区别

1. get一般用来获取数据

   post一般用来提交数据

2. get参数是有长度限制的（浏览器和Web服务器的限制了url的长度，不同的浏览器和Web服务器，限制的最大长度不一样，例如，IE浏览器对 `URL`的最大限制为2083个字符，如果超过这个数字，提交按钮没有任何反应）

   post无长度限制

3. get只能进行url编码，只能接受ASCII字符

   post没有限制

4. get的参数是附加在url上的，以`?`来分割url和传输数据，多个参数的话用`&`连接

   post请求则是把请求参数放在body中

5. get是明文传输

   post是通过请求体body传输，但开发者可以通过抓包工具看到，也相当于是明文传输的

6. get请求会被主动保存在浏览器的历史记录中，也可能保存在Web服务器的日志中

   post不会，除非手动设置

7. 同源的时候，get请求会带有Origin字段

   post不会，这个可能造成安全检查对错误.如果有nginx服务器,可以在nginx服务器上设置

8. get请求一般设置Content-type为application/x-www-form-urlencoded

   post一般设置Content-type为text/plain；chartset=utf-8，对于post请求，服务器后台以流的方式接收

9. get请求在浏览器反复的回退/前进操作是无害的

   post操作会再次提交表单请求

补充：head请求与GET请求类似，但是不会返回消息体，并且head请求可以被缓存。

## post真的安全吗？

- get和post本质上都是TCP连接，但是由于浏览器的请求机制（先发送请求头，再发送请求体），从而使get和post在应用过程中产生了差异
- 两者有个较大的区别就是：
  - get在请求时浏览器会发送**一个数据包**，将header和data发送过去
  
  - post会发送**两个数据包**，第一次把header发送过去，服务器返回100，第二次把data发送过去，服务器返回200
  
    （火狐浏览器的请求机制不同，post请求只发送一个数据包）
  
  - 补充：
    - 100状态码：表示服务器已经收到请求的第一部分数据，正在等待其他数据的到达
    - 200状态码：服务器已经成功的处理了请求，通常服务器提供了请求的网页

## 缓存方面

**get一般用于类似查找的过程，用户获取数据，不必每次都跟数据库连接，可以使用缓存**

**post一般用于修改和删除操作，所以必须与数据库交互，不适合做缓存**

### 安全、幂等、缓存

**safe（安全）**

这里的安全和通常所理解的安全意义不同，就好比如果一个请求的语义本质上就是获取数据（只读），那么这个请求就是安全的。客户端向服务器发起的请求如果没有引起服务器端任何的状态变化，那么他就是安全的而post请求来提交数据必然会是服务器发生相应的变化。从这个维度来看，**get请求相对服务器而言，是安全的，post则不安全的**。

**ldempotend（幂等）**

幂等通俗的来讲就是指同一个请求执行多次和仅执行一次的效果完全相等。这里来扯出幂等主要是为了处理同一个请求重复发送的情况，假如在请求响应之前失去连接，如果这个请求时幂等的，那么就可以放心的重发一次请求。所以可以得出**get请求时幂等的**，可以重复发送请求，**post请求时不幂等的**，重复请求可能会发生无法预知的后果。

**cacheable（可缓存性）**

顾名思义，就是一个请求是否可以被缓存，绝大多数部分，**post都是不可缓存的**（某些浏览器可能支持post缓存），但**get是可以缓存的**

**勉强理解一下大概就是：**

get是请求获取指定资源，**get方法时安全、幂等、可缓存的**，get方法的报文主体没有任何语义。

post是根据报文主体来对指定资源做出处理，**post不安全，不幂等，不可缓存**（大部分情况下）。

## W3C官网的比较

![image-20211112142245238](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142245238.png)

## 浏览器对URL长度限制

1. IE

   IE浏览器（Microsoft Internet Explorer）对url长度限制是2083（2K+53），超过这个限制，则自动截断（若是form提交则按钮不起作用）

2. FireFox

   火狐浏览器（FireFox）对url长度限制是65536个字符，但实际上有效的url最大长度不少于100 000（十万） 个字符

3. Chrome

   谷歌（Chrome）对url长度限制是8182个字符，超过则报错

   如下服务器错误：

   Request-URI Too Large
   The requested URL's length exceeds the capacity limit for this server.
   Apache/2.2.12 (Ubuntu) Server at 127.0.1.1 Port 80

4. Safari

   Safari对url长度限制至少为80 000 （八万）个字符

5. Opera

   Opera浏览器对url长度限制是190 000（一百九十万）个字符，Opera 9 地址栏中输入 190 000 字符时依然能正常编辑

## 浏览器预检请求


在很多情况下，当我们在JS里面调用一次ajax请求时，在浏览器那边却会查询到两次请求，第一次的Request Method参数是OPTIONS，还有一次就是我们真正的请求，比如get或是post请求方式

查阅相关资料之后发现，这是浏览器对复杂跨域请求的一种处理方式，在真正发送请求之前，会先进行一次预检请求，就是我们刚刚说的参数为OPTIONS的第一次请求，它的作用是用于试探服务器响应是否正确，即是否能接受真正的请求，如果在OPTIONS请求之后获取到的响应式拒绝性质的，例如500等http状态，那么它就会停止第二次的真正请求的访问

大致说明一下，有三种方式会导致这种现象：

1. 请求的方法不是GET/HEAD/POST

2. POST请求的Content-Type并非application/x-www-form-urlencoded，multipart/form-data，或text/plain

3. 请求设置了自定义的header字段

   比如我的Content-Type设置为“application/json;charset=utf-8”，并且自定义了header选项导致了这种情况

## HTTP请求方法

![image-20201210141846106](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20201210141846106.png)

## 参考
> [get和post的区别？](https://juejin.im/post/6844903824738500615)
>
> [都2020年了，还理不清GET请求和POST请求区别？](https://juejin.cn/post/6844904097091420174#heading-5)
> 
> [预检请求 OPTIONS](https://zhuanlan.zhihu.com/p/46405073)
> 
> [各个浏览器及web服务器对URL（get）长度的限制](https://my.oschina.net/ZL520/blog/2995860)
>
> [URL最大长度问题](https://www.cnblogs.com/henryhappier/archive/2010/10/09/1846554.html)

