---
title: Web Worker
---

# 你连Web Worker都不知道吗？
[[toc]]
## Web Worker 是什么？

Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，它允许一段 JavaScript 程序运行在主线程之外的另外一个线程中。Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。

在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，可以在独立线程中处理一些计算密集型或高延迟的任务，从而允许主线程（通常是 UI 线程）不会因此被阻塞或拖慢。

![image-20210902202946704](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210902202946704.png)

 ## Web Workers 的限制与能力

通常情况下，你可以在 Worker 线程中运行任意的代码，但注意存在一些例外情况，比如：**「直接在 worker 线程中操纵 DOM 元素，或使用 window 对象中的某些方法和属性。」** 大部分 window 对象的方法和属性是可以使用的，包括 WebSockets，以及诸如 IndexedDB 和 FireFox OS 中独有的 Data Store API 这一类数据存储机制。

下面我们以 Chrome 和 Opera 所使用的 Blink 渲染引擎为例，介绍该渲染引擎下 Web Worker 中所支持的常用 APIs：

- [Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)：Cache 接口为缓存的 Request / Response  对象对提供存储机制，例如，作为ServiceWorker 生命周期的一部分。
- [CustomEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent)：用于创建自定义事件。
- [Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)：Fetch API 提供了一个获取资源的接口（包括跨域请求）。任何使用过 XMLHttpRequest 的人都能轻松上手，而且新的 API 提供了更强大和灵活的功能集。
- [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)：Promise 对象代表了未来将要发生的事件，用来传递异步操作的消息。
- [FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)：FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
- [IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)：IndexedDB 是一种底层 API，用于客户端存储大量结构化数据，包括文件/二进制大型对象（blobs）。
- [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)：WebSocket 对象提供了用于创建和管理 WebSocket 连接，以及可以通过该连接发送和接收数据的 API。
- [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)：XMLHttpRequest（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。

更多信息请参见： [Functions and classes available to workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Functions_and_classes_available_to_workers) 。

## 主线程与 Web Workers 之间的通信

主线程和 Worker 线程相互之间使用 postMessage() 方法来发送信息，并且通过 onmessage 这个事件处理器来接收信息。数据的交互方式为传递副本，而不是直接共享数据。主线程与 Worker 线程的交互方式如下图所示：

![image-20211112142847002](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142847002.png)

除此之外，Worker 还可以通过 XMLHttpRequest 来访问网络，只不过 XMLHttpRequest 对象的 `responseXML` 和 `channel` 这两个属性的值将总是 `null`。

## Web Workers 的分类

[Web Worker](https://www.w3.org/TR/workers/) 规范中定义了两类工作线程，分别是专用线程 Dedicated Worker 和共享线程 Shared Worker，其中，Dedicated Worker 只能为一个页面所使用，而 Shared Worker 则可以被多个页面所共享。

### Dedicated Worker

一个专用 Worker 仅仅能被生成它的脚本所使用，其浏览器支持情况如下：

![image-20211112142854747](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142854747.png)

（图片来源：[https://caniuse.com/#search=Web%20Workers](https://caniuse.com/#search=Web Workers)）

需要注意的是，由于 Web Worker 有同源限制，所以在进行本地调试或运行以下示例的时候，需要先启动本地服务器，直接使用 `file://` 协议打开页面的时候，会抛出以下异常：

```shell
Uncaught DOMException: Failed to construct 'Worker': 
Script at 'file:///**/*.js' cannot be accessed from origin 'null'.
```

#### 专用线程 Dedicated Worker：Ping/Pong

![image-20211112142902217](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142902217.png)

**「index.html」**

```js
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>专用线程 Dedicated Worker —— Ping/Pong</title>
  </head>
  <body>
    <h3>阿宝哥：专用线程 Dedicated Worker —— Ping/Pong</h3>
    <script>
      if (window.Worker) {
        let worker = new Worker("dw-ping-pong.js");
        worker.onmessage = (e) =>
          console.log(`Main: Received message - ${e.data}`);
        worker.postMessage("PING");
      } else {
        console.log("呜呜呜，不支持 Web Worker");
      }
    </script>
  </body>
</html>
```

**「dw-ping-pong.js」**

```js
onmessage = (e) => {
  console.log(`Worker: Received message - ${e.data}`);
  postMessage("PONG");
}
```

以上代码成功运行后，浏览器控制台会输出以下结果：

```shell
Worker: Received message - PING
Main: Received message - PONG
```

每个 Web Worker 都可以创建自己的子 Worker，这允许我们将任务分散到多个线程。创建子 Worker 也很简单，具体我们来看个例子。

#### 专用线程 Dedicated Sub Worker：Ping/Pong

![image-20211112142908140](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142908140.png)

**「index.html」**

```js
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>专用线程 Dedicated Sub Worker —— Ping/Pong</title>
  </head>
  <body>
    <h3>阿宝哥：专用线程 Dedicated Sub Worker —— Ping/Pong</h3>
    <script>
      if (window.Worker) {
        let worker = new Worker("dw-ping-pong.js");
        worker.onmessage = (e) =>
          console.log(`Main: Received message - ${e.data}`);
        worker.postMessage("PING");
      } else {
        console.log("呜呜呜，不支持 Web Worker");
      }
    </script>
  </body>
</html>=
```

**「dw-ping-pong.js」**

```js
onmessage = (e) => {
  console.log(`Worker: Received message - ${e.data}`);
  setTimeout(() => {
    let worker = new Worker("dw-sub-ping-pong.js");
    worker.onmessage = (e) => console.log(`Worker: Received from sub worker - ${e.data}`);
    worker.postMessage("PING");
  }, 1000);
  postMessage("PONG");
};
```

**「dw-sub-ping-pong.js」**

```js
onmessage = (e) => {
  console.log(`Sub Worker: Received message - ${e.data}`);
  postMessage("PONG");
};
```

以上代码成功运行后，浏览器控制台会输出以下结果：

```shell
Worker: Received message - PING
Main: Received message - PONG
Sub Worker: Received message - PING
Received from sub worker - PONG
```

#### 专用线程 Dedicated Worker：importScripts

其实在 Web Worker 中，我们也可以使用 `importScripts` 方法将一个或多个脚本同步导入到 Web Worker 的作用域中。同样我们来举个例子。

**「index.html」**

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>专用线程 Dedicated Worker —— importScripts</title>
  </head>
  <body>
    <h3>阿宝哥：专用线程 Dedicated Worker —— importScripts</h3>
    <script>
      let worker = new Worker("worker.js");
      worker.onmessage = (e) => console.log(`Main: Received kebab case message - ${e.data}`);
      worker.postMessage(
        "Hello, My name is semlinker."
      );
    </script>
  </body>
</html>
```

**「worker.js」**

```js
importScripts("https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js");

onmessage = ({ data }) => {
  postMessage(_.kebabCase(data));
};
```

以上代码成功运行后，浏览器控制台会输出以下结果：

```shell
Main: Received kebab case message - hello-my-name-is-semlinker
```

#### 专用线程 Dedicated Worker：inline-worker

在前面的例子中，我们都是使用外部的 Worker 脚本来创建 Web Worker 对象。其实你也可以通过 Blob URL 或 Data URL 的形式来创建 Web Worker，这类 Worker 也被称为 Inline Worker。

**「1. 使用 Blob URL 创建 Inline Worker」**

Blob URL/Object URL 是一种伪协议，允许 Blob 和 File 对象用作图像，下载二进制数据链接等的 URL 源。在浏览器中，我们使用 `URL.createObjectURL` 方法来创建 Blob URL，该方法接收一个 `Blob` 对象，并为其创建一个唯一的 URL，其形式为 `blob:<origin>/<uuid>`，对应的示例如下：

```js
blob:https://example.org/40a5fb5a-d56d-4a33-b4e2-0acf6a8e5f641
```

浏览器内部为每个通过 `URL.createObjectURL` 生成的 URL 存储了一个 URL → Blob 映射。因此，此类 URL 较短，但可以访问 `Blob`。生成的 URL 仅在当前文档打开的状态下才有效。它允许引用 `<img>`、`<a>` 中的 `Blob`，但如果你访问的 Blob URL 不再存在，则会从浏览器中收到 404 错误。

```js
const url = URL.createObjectURL(
  new Blob([`postMessage("Dedicated Worker created by Blob")`])
);

let worker = new Worker(url);
worker.onmessage = (e) =>
  console.log(`Main: Received message - ${e.data}`);
```

除了在代码中使用字符串动态创建 Worker 脚本，也可以把 Worker 脚本使用类型为 `javascript/worker` 的 `script` 标签内嵌在页面中，具体如下所示：

```js
<script id="myWorker" type="javascript/worker">
   self['onmessage'] = function(event) {
     postMessage('Hello, ' + event.data.name + '!');
   };
</script>
```

接着就是通过 script 对象的 `textContent` 属性来获取对应的内容，然后使用 Blob API 和 createObjectURL API 来最终创建 Web Worker：

```js
<script>
  let workerScript = document.querySelector('#myWorker').textContent;
  let blob = new Blob(workerScript, {type: "text/javascript"});
  let worker = new Worker(URL.createObjectURL(blob));
</script>
```

**「2. 使用 Data URL 创建 Inline Worker」**

Data URLs 由四个部分组成：前缀（`data:`）、指示数据类型的 MIME 类型、如果非文本则为可选的 `base64` 标记、数据本身：

```js
data:[<mediatype>][;base64],<data>
```

`mediatype` 是个 MIME 类型的字符串，例如 "`image/jpeg`" 表示 JPEG 图像文件。如果被省略，则默认值为 `text/plain;charset=US-ASCII`。如果数据是文本类型，你可以直接将文本嵌入（根据文档类型，使用合适的实体字符或转义字符）。如果是二进制数据，你可以将数据进行 base64 编码之后再进行嵌入。

```js
const url = `data:application/javascript,${encodeURIComponent(
  `postMessage("Dedicated Worker created by Data URL")`
)}`;

let worker = new Worker(url);
worker.onmessage = (e) =>
  console.log(`Main: Received message - ${e.data}`);
```

### Shared Worker

一个共享 Worker 是一种特殊类型的 Worker，可以被多个浏览上下文访问，比如多个 windows，iframes 和 workers，但这些浏览上下文必须同源。相比 dedicated workers，它们拥有不同的作用域。其浏览器支持情况如下：

![image-20211112142916657](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142916657.png)

与常规的 Worker 不同，首先我们需要使用 `onconnect` 方法等待连接，然后我们获得一个端口，该端口是我们与窗口之间的连接。

#### 共享线程 Shared Worker：点赞计数器

**「index.html」**

```js
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>共享线程 Shared Worker</title>
  </head>
  <body>
    <h3>阿宝哥：共享线程 Shared Worker</h3>
    <button id="likeBtn">点赞</button>
    <p>阿宝哥一共收获了<span id="likedCount">0</span>个👍</p>
    <script>
      let likes = 0;
      let likeBtn = document.querySelector("#likeBtn");
      let likedCountEl = document.querySelector("#likedCount");

      let worker = new SharedWorker("shared-worker.js");
      worker.port.start();

      likeBtn.addEventListener("click", function () {
        worker.port.postMessage("like");
      });

      worker.port.onmessage = function (val) {
        likedCountEl.innerHTML = val.data;
      };
    </script>
  </body>
</html>
```

**「shared-worker.js」**

```js
let a = 666;

console.log("shared-worker");
onconnect = function (e) {
  var port = e.ports[0];

  port.onmessage = function () {
    port.postMessage(a++);
  };
};
```

在 Shared Worker 的示例页面上有一个 **「点赞」** 按钮，每次点击时点赞数会加 1。首先你新开一个窗口，然后点击几次。然后新开另一个窗口继续点击，这时你会发现当前页面显示的点赞数是基于前一个页面的点赞数继续累加。

![image-20211112142923359](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142923359.png)

#### 调试 Shared Workers

在实际项目开发过程中，若需要调试 Shared Workers 中的脚本，可以通过 `chrome://inspect` 来进行调试，具体步骤如下图所示：

![image-20211112142934024](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142934024.png)

### Service Workers

Service workers 本质上充当 Web 应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。

![image-20211112142940557](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142940557.png)



Service workers 的浏览器支持情况如下：

![image-20211112142945435](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142945435.png)

由于 Service workers 不是本文的重点，这里阿宝哥就不展开介绍了，感兴趣的小伙伴请自行了解一下。下面我们开始介绍 Web Workers API。

## Web Workers API

Worker() 构造函数创建一个 Worker 对象，该对象执行指定的URL脚本。这个脚本必须遵守同源策略 。如果违反同源策略，则会抛出一个 SECURITY_ERR 类型的 DOMException。

### Worker 构造函数

Worker 构造函数的语法为：

```js
const myWorker = new Worker(aURL, options);
```

相关的参数说明如下：

- aURL：是一个 DOMString 表示 worker 将执行的脚本的 URL。它必须遵守同源策略。
- options（可选）：包含可在创建对象实例时设置的选项属性的对象。可用属性如下：
  - type：用以指定 Worker 类型的  DOMString 值. 该值可以是 classic 或 module。如果未指定，将使用默认值 classic。
  - credentials：用以指定 worker 凭证的 DOMString 值。该值可以是 omit，same-origin 或 include。如果未指定，或者 type 是 classic，将使用默认值 omit (不要求凭证)。
  - name：在 DedicatedWorkerGlobalScope 的情况下，用来表示 Worker 的 scope 的一个 DOMString 值，主要用于调试目的。

需要注意的是，在创建 Web Worker 的时候，可能会出现以下异常：

- 当 document 不被允许启动 worker 的时候，将抛出一个 SecurityError 异常。比如：如果提供的 aURL 有语法错误，或者与同源策略相冲突（跨域访问）。
- 如果 worker 的 MIME 类型不正确，将抛出一个 NetworkError 异常。worker 的 MIME 类型必须是 `text/javascript`。
- 如果 aURL 无法被解析（格式错误），将抛出一个 SyntaxError 异常。

**「示例」**

```js
const worker = new Worker("task.js");
```

当我们调用 Worker 构造函数后会返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法如下：

- Worker.onerror：指定 error 事件的监听函数。
- Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在 `Event.data` 属性中。
- Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据**无法序列化成字符串**时，会触发这个事件。
- Worker.postMessage()：向 Worker 线程发送消息。
- Worker.terminate()：立即终止 Worker 线程。

### Dedicated Worker 示例

下面我们再来举一个 Dedicated Worker 的例子：

**「index.html」**

```js
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dedicated Worker Demo</title>
  </head>
  <body>
    <h3>Dedicated Worker Demo</h3>
    <script>
      const worker = new Worker("task.js");

      worker.postMessage({
        id: 666,
        msg: "Hello Semlinker",
      });

      worker.onmessage = function (message) {
        let data = message.data;
        console.log(`Main: Message from worker ${JSON.stringify(data)}`);
        worker.terminate();
      };

      worker.onerror = function (error) {
        console.log(error.filename, error.lineno, error.message);
      };
    </script>
  </body>
</html>
```

**「task.js」**

而 Dedicated Worker 所执行的代码如下所示：

```js
onmessage = function (message) {
  let data = message.data;
  console.log(`Worker: Message from main thread ${JSON.stringify(data)}`);
  data.msg = "Hi from task.js";
  postMessage(data);
};
```

以上代码成功运行后，控制台会输出以下结果：

```shell
Worker: Message from main thread {"id": 666,"msg": "Hello Semlinker"}
worker-demo.html:20 Main: Message from worker {"id":666, "msg":"Hi from task.js"}
```

为了让大家更好的理解 Web Worker 的工作流程，我们来了解一下 WebKit 加载并执行 Worker 线程的流程：

![image-20211112142952668](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112142952668.png)

### 观察 Dedicated Worker

看到这里相信有些小伙伴会好奇，介绍了那么多 Web Worker 的相关知识，在哪里可以直观地感受到 Web Worker，接下来我们将从以下两个角度来观察它。

#### 开发者工具

这里阿宝哥以 Chrome 浏览器为例，首先打开 Chrome 开发者工具，然后选择 **「Sources -> Page」**：

![image-20211112143001260](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112143001260.png)

#### Chrome 任务管理器 & 活动监视器

![image-20211112143012063](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112143012063.png)

打开 Chrome 任务管理器之后，我们可以找到当前 Tab 页对应的进程 ID，即为 **「5194」**，接着我们打开 macOS 下的活动监视器，然后选中 **「5194」** 进程，然后对该进程进行取样操作：

![image-20211112143021502](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211112143021502.png)

取样完成后，可以看到当前渲染进程中完整的线程信息，红框中标出的就是我们想要找的 **「Dedicated Worker」**。

## 参考
> [你不知道的 Web Workers （上）[7.8K 字 | 多图预警]](https://juejin.cn/post/6844904198639714311#heading-10)

