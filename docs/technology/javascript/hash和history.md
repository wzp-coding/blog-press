---
title: hash和history
---

# 了解一下两种路由模式

[[toc]]

路由模式有两种，一种是hash，另一种是history

hash的优势就是兼容性更好,在老版IE中都有运行,问题在于url中一直存在`#`不够美观,而且hash路由更像是Hack而非标准,相信随着发展更加标准化的History API会逐步蚕食掉hash路由的市场。

## hash原理
hash路由一个明显的标志是带有`#`,我们主要是通过监听url中的hash变化来进行路由跳转。

hash值变化的时候，会触发hashchange事件，事件对象event中有newURL和oldURL

注意：

> hashchange在页面第一次加载完毕的时候并不会触发，但会触发load事件
> load事件对象中没有newURL和oldURL

### 核心实现
我们要实现一个HashRouter类，最终目标是可以通过这个类来监听到哈希字符串的变化，类似这样用
```js
const hashRouter = new HashRouter();
hashRouter.on("change", function (newUrl, oldUrl) {
  console.log("newUrl", newUrl);
  console.log("oldUrl", oldUrl);
});
```

```js
class HashRouter {
  constructor() {
    this.handlers = {};// 存放监听回调函数，type=>function
    this.refresh = this.refresh.bind(this);// 防止this丢失
    window.addEventListener("hashchange", this.refresh);// 监听哈希变化hashchange事件
    window.addEventListener("load", this.refresh);// 监听第一次加载load事件
  }
  // 刷新url的显示
  refresh(e) {
    if (e.newURL) {
    // 如果是hashchange事件触发
      this.emit("change", this.getHashUrl(e.newURL), this.getHashUrl(e.oldURL));
    } else {
    // 如果是load事件触发
      this.emit("change", this.getHashUrl(location.hash));
    }
  }
  // 获取哈希符号#后面的url字符串
  getHashUrl(url) {
    const index = url.indexOf("#");
    if (index < 0) {
      return "/";
    }
    return url.slice(index + 1);
  }
  // 监听事件
  on(type, handler) {
    this.handlers[type] = handler;
  }
  // 触发事件
  emit(type, ...args) {
    const handler = this.handlers[type];
    if (!handler) {
      return;
    }
    handler(...args);
  }
}
```


## history原理
History 接口允许操作浏览器的曾经在标签页或者框架里访问的会话历史记录。

我们先来了解一下window.history的方法：

1. forward()：前进
2. back()：后退
3. go()：正数前进，负数后退，0或者不填，重载页面
4. replaceState(obj,title,url)：按指定的数据，名称和URL(如果提供该参数)，更新历史栈上最新的入口
5. pushState(obj,title,url)：按指定的名称和URL（如果提供该参数）将数据push进会话历史栈

>  注意：以上五种方法都只是修改URL，并不会向服务器发送请求，而location.href和location.replace会向服务器发送请求

应用场景：

1.  前端渲染，例如首页服务端渲染，二级页面前端渲染

2. 添加路由过渡动画

3. 用户刷新的时候，静默的修改url，实现停留在原页面的效果

4. 当使用forward,back,go三个方法改变路由时会触发popState事件，而replaceState和pushState反而不会触发popState事件

   解决方法：使用window.dispatchEvent派发事件

### 核心实现
同样的，我们要实现一个HistoryRouter类，它能够实现下面的功能
```js
 const historyRouter = new HistoryRouter();
 historyRouter.on("change", function (curUrl) {
    console.log(curUrl);
 });
```

```js
 class HistoryRouter {
    constructor() {
    this.handlers = {};// 存放监听回调函数，type=>function
    window.history.pushState = this.listener("pushState");
    window.history.replaceState = this.listener("replaceState");
    this.refresh = this.refresh.bind(this);
    window.addEventListener("load", this.refresh, false);// 监听第一次加载load事件
    window.addEventListener("popstate", this.refresh, false);// 监听URL变化popstate事件
    window.addEventListener("pushState", this.refresh, false);// 监听URL变化pushState事件
    window.addEventListener("replaceState", this.refresh, false);// 监听URL变化replaceState事件
    }
    refresh(e) {
        const curUrl = location.pathname;
        this.emit("change", curUrl);
    }
    // 封装pushState和replaceState函数
    // 目的是执行这两个函数的时候能够触发pushState和replaceState
    listener(type) {
        const orgin = window.history[type];
        return function () {
          // 执行replaceState或者pushState方法
          const ret = orgin.apply(this, arguments);
          // 向window对象派发事件
          const e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);// 触发pushState和replaceState事件
          return ret;
        };
    }
    // 监听事件
    on(type, handler) {
    	this.handlers[type] = handler;
    }
    // 触发事件
    emit(type, ...args) {
        const handler = this.handlers[type];
        if (!handler) {
          return;
        }
        handler(...args);
    }
 }
```


## 参考
> [面试官: 你了解前端路由吗?](https://juejin.cn/post/6844903589123457031#heading-0)
>
> [History](https://developer.mozilla.org/zh-CN/docs/Web/API/History)

