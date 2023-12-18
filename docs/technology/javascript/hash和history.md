---
title: hash和history
---

# 了解一下两种路由模式

[[toc]]

路由模式有两种，一种是 hash，另一种是 history

hash 的优势就是兼容性更好,在老版 IE 中都有运行,问题在于 url 中一直存在`#`不够美观,而且 hash 路由更像是 Hack 而非标准,相信随着发展更加标准化的 History API 会逐步蚕食掉 hash 路由的市场。

## hash 原理

hash 路由一个明显的标志是带有`#`,我们主要是通过监听 url 中的 hash 变化来进行路由跳转。

hash 值变化的时候，会触发 hashchange 事件，事件对象 event 中有 newURL 和 oldURL

注意：

> hashchange 在页面第一次加载完毕的时候并不会触发，但会触发 load 事件 load 事件对象中没有 newURL 和 oldURL

### 核心实现

我们要实现一个 HashRouter 类，最终目标是可以通过这个类来监听到哈希字符串的变化，类似这样用

```js
const hashRouter = new HashRouter()
hashRouter.on('change', function(newUrl, oldUrl) {
  console.log('newUrl', newUrl)
  console.log('oldUrl', oldUrl)
})
```

```js
class HashRouter {
  constructor() {
    this.handlers = {} // 存放监听回调函数，type=>function
    this.refresh = this.refresh.bind(this) // 防止this丢失
    window.addEventListener('hashchange', this.refresh) // 监听哈希变化hashchange事件
    window.addEventListener('load', this.refresh) // 监听第一次加载load事件
  }
  // 刷新url的显示
  refresh(e) {
    if (e.newURL) {
      // 如果是hashchange事件触发
      this.emit('change', this.getHashUrl(e.newURL), this.getHashUrl(e.oldURL))
    } else {
      // 如果是load事件触发
      this.emit('change', this.getHashUrl(location.hash))
    }
  }
  // 获取哈希符号#后面的url字符串
  getHashUrl(url) {
    const index = url.indexOf('#')
    if (index < 0) {
      return '/'
    }
    return url.slice(index + 1)
  }
  // 监听事件
  on(type, handler) {
    this.handlers[type] = handler
  }
  // 触发事件
  emit(type, ...args) {
    const handler = this.handlers[type]
    if (!handler) {
      return
    }
    handler(...args)
  }
}
```

## history 原理

History 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。

我们先来了解一下 window.history 的方法：

1. forward()：前进
2. back()：后退
3. go()：正数前进，负数后退，0 或者不填，重载页面
4. replaceState(obj,title,url)：按指定的数据，名称和 URL(如果提供该参数)，更新历史栈上最新的入口
5. pushState(obj,title,url)：按指定的名称和 URL（如果提供该参数）将数据 push 进会话历史栈

> 注意：以上五种方法都只是修改 URL，并不会向服务器发送请求，而 location.href 和 location.replace 会向服务器发送请求

应用场景：

1.  前端渲染，例如首页服务端渲染，二级页面前端渲染

2.  添加路由过渡动画

3.  用户刷新的时候，静默的修改 url，实现停留在原页面的效果

4.  当使用 forward,back,go 三个方法改变路由时会触发 popState 事件，而 replaceState 和 pushState 反而不会触发 popState 事件

    解决方法：使用 window.dispatchEvent 派发事件

### 核心实现

同样的，我们要实现一个 HistoryRouter 类，它能够实现下面的功能

```js
const historyRouter = new HistoryRouter()
historyRouter.on('change', function(curUrl) {
  console.log(curUrl)
})
```

```js
class HistoryRouter {
  constructor() {
    this.handlers = {} // 存放监听回调函数，type=>function
    window.history.pushState = this.listener('pushState')
    window.history.replaceState = this.listener('replaceState')
    this.refresh = this.refresh.bind(this)
    window.addEventListener('load', this.refresh, false) // 监听第一次加载load事件
    window.addEventListener('popstate', this.refresh, false) // 监听URL变化popstate事件
    window.addEventListener('pushState', this.refresh, false) // 监听URL变化pushState事件
    window.addEventListener('replaceState', this.refresh, false) // 监听URL变化replaceState事件
  }
  refresh(e) {
    const curUrl = location.pathname
    this.emit('change', curUrl)
  }
  // 封装pushState和replaceState函数
  // 目的是执行这两个函数的时候能够触发pushState和replaceState
  listener(type) {
    const orgin = window.history[type]
    return function() {
      // 执行replaceState或者pushState方法
      const ret = orgin.apply(this, arguments)
      // 向window对象派发事件
      const e = new Event(type)
      e.arguments = arguments
      window.dispatchEvent(e) // 触发pushState和replaceState事件
      return ret
    }
  }
  // 监听事件
  on(type, handler) {
    this.handlers[type] = handler
  }
  // 触发事件
  emit(type, ...args) {
    const handler = this.handlers[type]
    if (!handler) {
      return
    }
    handler(...args)
  }
}
```

## 参考

> [面试官: 你了解前端路由吗?](https://juejin.cn/post/6844903589123457031#heading-0)
>
> [History](https://developer.mozilla.org/zh-CN/docs/Web/API/History)
