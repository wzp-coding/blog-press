---
title: webpack优化
---

# 了解一下 webpack 的优化措施

[[toc]]

## 如何减少打包时间

Webpack 启动后会从配置的 Entry 出发，解析出文件中的导入语句，再递归的解析。 在遇到导入语句时 Webpack 会做两件事情：

1. 根据导入语句去寻找对应的要导入的文件。例如 `require('react')` 导入语句对应的文件是 `./node_modules/react/react.js`，`require('./util')` 对应的文件是 `./util.js`。
2. 根据找到的要导入文件的后缀，使用配置中的 Loader 去处理文件。例如使用 ES6 开发的 JavaScript 文件需要使用 babel-loader 去处理。

### 缩小文件搜索范围

对于 loader 来说，影响最大是 Babel，因为 Babel 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率也就越低，但是，我们可以优化。

#### 优化 loader 的文件搜索范围

为了尽可能少的让文件被 Loader 处理，可以通过 `include` 去命中只有哪些文件需要被处理。

```js
module.exports = {
  module: {
    rules: [
      {
        // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
        use: ['babel-loader?cacheDirectory'],
        // 只对项目根目录下的 src 目录中的文件采用 babel-loader
        include: path.resolve(__dirname, 'src'),
        // 不查找node_modules目录
        exclude: /node_modules/
      }
    ]
  }
}
```

#### 优化 resolve.modules 配置

`resolve.modules` 用于配置 Webpack 去哪些目录下寻找第三方模块。

```js
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
  }
}
```

#### 优化 resolve.mainFields 配置

`resolve.mainFields` 用于配置第三方模块使用哪个入口文件。由于大多数第三方模块都采用 `main` 字段去描述入口文件的位置，可以这样配置 Webpack：

```js
module.exports = {
  resolve: {
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['main']
  }
}
```

> 使用本方法优化时，你需要考虑到所有运行时依赖的第三方模块的入口文件描述字段，就算有一个模块搞错了都可能会造成构建出的代码无法正常运行。

#### 优化 resolve.alias 配置

`resolve.alias` 配置项通过别名来把原导入路径映射成一个新的导入路径。以 React 库为例，安装到 `node_modules` 目录下的 React 库的目录结构如下：

```markdown
├── dist │ ├── react.js │ └── react.min.js ├── lib │ ... 还有几十个文件被忽略 │ ├── LinkedStateMixin.js │ ├── createClass.js │ └── React.js ├── package.json └── react.js
```

默认情况下 Webpack 会从入口文件 `./node_modules/react/react.js` 开始递归的解析和处理依赖的几十个文件，这会时一个耗时的操作。 通过配置 `resolve.alias` 可以让 Webpack 在处理 React 库时，直接使用单独完整的 `react.min.js` 文件，从而跳过耗时的递归解析操作。

相关 Webpack 配置如下：

```js
module.exports = {
  resolve: {
    // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.min.js 文件，
    // 减少耗时的递归解析操作
    alias: {
      react: path.resolve(__dirname, './node_modules/react/dist/react.min.js') // react15
      // 'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'), // react16
    }
  }
}
```

> 除了 React 库外，大多数库发布到 Npm 仓库中时都会包含打包好的完整文件，对于这些库你也可以对它们配置 alias。
>
> 但是对于有些库使用本优化方法后会影响到后面要讲的[使用 Tree-Shaking 去除无效代码](https://webpack.wuhaolin.cn/4优化/4-10使用TreeShaking.html)的优化，因为打包好的完整文件中有部分代码你的项目可能永远用不上。 一般对整体性比较强的库采用本方法优化，因为完整文件中的代码是一个整体，每一行都是不可或缺的。 但是对于一些工具类的库，例如 [lodash](https://github.com/lodash/lodash)，你的项目可能只用到了其中几个工具函数，你就不能使用本方法去优化，因为这会导致你的输出代码中包含很多永远不会执行的代码。

#### 优化 resolve.extensions 配置

在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试询问文件是否存在。 `resolve.extensions` 用于配置在尝试过程中用到的后缀列表，默认是：

```js
extensions: ['.js', '.json']
```

相关 Webpack 配置如下：

```js
module.exports = {
  resolve: {
    // 尽可能的减少后缀尝试的可能性
    extensions: ['js']
  }
}
```

#### 优化 module.noParse 配置

`module.noParse` 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析处理，这样做的好处是能提高构建性能。 原因是一些库，例如 jQuery 、ChartJS， 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

```js
const path = require('path')

module.exports = {
  module: {
    // 独完整的 `react.min.js` 文件就没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/]
  }
}
```

> 注意被忽略掉的文件里不应该包含 `import` 、 `require` 、 `define` 等模块化语句，不然会导致构建出的代码中包含无法在浏览器环境下执行的模块化语句。

### 多进程打包 HappyPack

由于有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，特别是当文件数量变多后，Webpack 构建慢的问题会显得严重。 运行在 Node.js 之上的 Webpack 是单线程模型的，也就是说 Webpack 需要处理的任务需要一件件挨着做，不能多个事情一起做。

文件读写和计算操作是无法避免的，那能不能让 Webpack 同一时刻处理多个任务，发挥多核 CPU 电脑的威力，以提升构建速度呢？

[HappyPack](https://github.com/amireh/happypack) 就能让 Webpack 做到这点，它把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。

> 由于 JavaScript 是单线程模型，要想发挥多核 CPU 的能力，只能通过多进程去实现，而无法通过多线程实现。

#### 使用 HappyPack

分解任务和管理线程的事情 HappyPack 都会帮你做好，你所需要做的只是接入 HappyPack。 接入 HappyPack 的相关代码如下：

```js
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        use: ['happypack/loader?id=babel'],
        // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        // 把对 .css 文件的处理转交给 id 为 css 的 HappyPack 实例
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['happypack/loader?id=css']
        })
      }
    ]
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory']
      // ... 其它配置项
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: ['css-loader']
    }),
    new ExtractTextPlugin({
      filename: `[name].css`
    })
  ]
}
```

以上代码有两点重要的修改：

- 在 Loader 配置中，所有文件的处理都交给了 `happypack/loader` 去处理，使用紧跟其后的 querystring `?id=babel` 去告诉 `happypack/loader` 去选择哪个 HappyPack 实例去处理文件。
- 在 Plugin 配置中，新增了两个 HappyPack 实例分别用于告诉 `happypack/loader` 去如何处理 .js 和 .css 文件。选项中的 `id` 属性的值和上面 querystring 中的 `?id=babel` 相对应，选项中的 `loaders` 属性和 Loader 配置中一样。

在实例化 HappyPack 插件的时候，除了可以传入 `id` 和 `loaders` 两个参数外，HappyPack 还支持如下参数：

- `threads` 代表开启几个子进程去处理这一类型的文件，默认是 3 个，类型必须是整数。
- `verbose` 是否允许 HappyPack 输出日志，默认是 `true`。
- `threadPool` 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多，相关代码如下：

```js
const HappyPack = require('happypack')
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 })

module.exports = {
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: ['css-loader'],
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool
    }),
    new ExtractTextPlugin({
      filename: `[name].css`
    })
  ]
}
```

接入 HappyPack 后，你需要给项目安装新的依赖：

```bash
npm i -D happypack
```

安装成功后重新执行构建你就会看到以下由 HappyPack 输出的日志：

```
Happy[babel]: Version: 4.0.0-beta.5. Threads: 3
Happy[babel]: All set; signaling webpack to proceed.
Happy[css]: Version: 4.0.0-beta.5. Threads: 3
Happy[css]: All set; signaling webpack to proceed.
```

说明你的 HappyPack 配置生效了，并且可以得知 HappyPack 分别启动了 3 个子进程去并行的处理任务。

#### HappyPack 原理

在整个 Webpack 构建流程中，最耗时的流程可能就是 Loader 对文件的转换操作了，因为要转换的文件数据巨多，而且这些转换操作都只能一个个挨着处理。 HappyPack 的核心原理就是把这部分任务分解到多个进程去并行处理，从而减少了总的构建时间。

从前面的使用中可以看出所有需要通过 Loader 处理的文件都先交给了 `happypack/loader` 去处理，收集到了这些文件的处理权后 HappyPack 就好统一分配了。

每通过 `new HappyPack()` 实例化一个 HappyPack 其实就是告诉 HappyPack 核心调度器如何通过一系列 Loader 去转换一类文件，并且可以指定如何给这类转换操作分配子进程。

核心调度器的逻辑代码在主进程中，也就是运行着 Webpack 的进程中，核心调度器会把一个个任务分配给当前空闲的子进程，子进程处理完毕后把结果发送给核心调度器，它们之间的数据交换是通过进程间通信 API 实现的。

核心调度器收到来自子进程处理完毕的结果后会通知 Webpack 该文件处理完毕。

### 动态链接库 DLLPlugin

Windows 系统中我们经常看到以 `.dll` 为后缀的文件，这些文件称为**动态链接库**，在一个动态链接库中可以包含给其他模块调用的函数和数据。

要给 Web 项目构建接入动态链接库的思想，需要完成以下事情：

- 把网页依赖的基础模块抽离出来，打包到一个个单独的动态链接库中去。一个动态链接库中可以包含多个模块。
- 当需要导入的模块存在于某个动态链接库中时，这个模块不能被再次被打包，而是去动态链接库中获取。
- 页面依赖的所有动态链接库需要被加载。

为什么给 Web 项目构建接入动态链接库的思想后，会大大提升构建速度呢？

原因在于包含大量复用模块的动态链接库只需要编译一次，在之后的构建过程中被动态链接库包含的模块将不会再重新编译，而是直接使用动态链接库中的代码。 由于动态链接库中大多数包含的是常用的第三方模块，例如 react、react-dom，只要不升级这些模块的版本，动态链接库就不用重新编译。

Webpack 已经内置了对动态链接库的支持，需要通过 2 个内置的插件接入，它们分别是：

- DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
- DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。

下面以基本的 React 项目为例，为其接入 DllPlugin，在开始前先来看下最终构建出的目录结构：

```
├── main.js
├── polyfill.dll.js
├── polyfill.manifest.json
├── react.dll.js
└── react.manifest.json
```

其中包含两个动态链接库文件，分别是：

- `polyfill.dll.js` 里面包含项目所有依赖的 polyfill，例如 Promise、fetch 等 API。
- `react.dll.js` 里面包含 React 的基础运行环境，也就是 react 和 react-dom 模块。

以 `react.dll.js` 文件为例，其文件内容大致如下：

```js
var _dll_react = (function(modules) {
  // ... 此处省略 webpackBootstrap 函数代码
})([
  function(module, exports, __webpack_require__) {
    // 模块 ID 为 0 的模块对应的代码
  },
  function(module, exports, __webpack_require__) {
    // 模块 ID 为 1 的模块对应的代码
  }
  // ... 此处省略剩下的模块对应的代码
])
```

可见一个动态链接库文件中包含了大量模块的代码，这些模块存放在一个数组里，用数组的索引号作为 ID。 并且还通过 `_dll_react` 变量把自己暴露在了全局中，也就是可以通过 `window._dll_react` 可以访问到它里面包含的模块。

其中 `polyfill.manifest.json` 和 `react.manifest.json` 文件也是由 DllPlugin 生成出，用于描述动态链接库文件中包含哪些模块， 以 `react.manifest.json` 文件为例，其文件内容大致如下：

```json
{
  // 描述该动态链接库文件暴露在全局的变量名称
  "name": "_dll_react",
  "content": {
    "./node_modules/process/browser.js": {
      "id": 0,
      "meta": {}
    },
    // ... 此处省略部分模块
    "./node_modules/react-dom/lib/ReactBrowserEventEmitter.js": {
      "id": 42,
      "meta": {}
    },
    "./node_modules/react/lib/lowPriorityWarning.js": {
      "id": 47,
      "meta": {}
    },
    // ... 此处省略部分模块
    "./node_modules/react-dom/lib/SyntheticTouchEvent.js": {
      "id": 210,
      "meta": {}
    },
    "./node_modules/react-dom/lib/SyntheticTransitionEvent.js": {
      "id": 211,
      "meta": {}
    }
  }
}
```

可见 `manifest.json` 文件清楚地描述了与其对应的 `dll.js` 文件中包含了哪些模块，以及每个模块的路径和 ID。

`main.js` 文件是编译出来的执行入口文件，当遇到其依赖的模块在 `dll.js` 文件中时，会直接通过 `dll.js` 文件暴露出的全局变量去获取打包在 `dll.js` 文件的模块。 所以在 `index.html` 文件中需要把依赖的两个 `dll.js` 文件给加载进去，`index.html` 内容如下：

```html
<html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app"></div>
    <!--导入依赖的动态链接库文件-->
    <script src="./dist/polyfill.dll.js"></script>
    <script src="./dist/react.dll.js"></script>
    <!--导入执行入口文件-->
    <script src="./dist/main.js"></script>
  </body>
</html>
```

以上就是所有接入 DllPlugin 后最终编译出来的代码，接下来教你如何实现。

#### 构建出动态链接库文件

构建输出的以下这四个文件

```
├── polyfill.dll.js
├── polyfill.manifest.json
├── react.dll.js
└── react.manifest.json
```

和以下这一个文件

```
├── main.js
```

是由两份不同的构建分别输出的。

动态链接库文件相关的文件需要由一份独立的构建输出，用于给主构建使用。新建一个 Webpack 配置文件 `webpack_dll.config.js` 专门用于构建它们，文件内容如下：

```js
// webpack_dll.config.js
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')

module.exports = {
  // JS 执行入口文件
  entry: {
    // 把 React 相关模块的放到一个单独的动态链接库
    react: ['react', 'react-dom'],
    // 把项目需要所有的 polyfill 放到一个单独的动态链接库
    polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch']
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    // 也就是 entry 中配置的 react 和 polyfill
    filename: '[name].dll.js',
    // 输出的文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist'),
    // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
    // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
    library: '_dll_[name]'
  },
  plugins: [
    // 接入 DllPlugin
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json')
    })
  ]
}
```

#### 使用动态链接库文件

构建出的动态链接库文件用于给其它地方使用，在这里也就是给执行入口使用。

用于输出 `main.js` 的主 Webpack 配置文件内容如下：

```js
const path = require('path')
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')

module.exports = {
  entry: {
    // 定义入口 Chunk
    main: './main.js'
  },
  output: {
    // 输出文件的名称
    filename: '[name].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        // 项目源码使用了 ES6 和 JSX 语法，需要使用 babel-loader 转换
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules')
      }
    ]
  },
  plugins: [
    // 告诉 Webpack 使用了哪些动态链接库
    new DllReferencePlugin({
      // 描述 react 动态链接库的文件内容
      manifest: require('./dist/react.manifest.json')
    }),
    new DllReferencePlugin({
      // 描述 polyfill 动态链接库的文件内容
      manifest: require('./dist/polyfill.manifest.json')
    })
  ],
  devtool: 'source-map'
}
```

> 注意：在 `webpack_dll.config.js` 文件中，DllPlugin 中的 name 参数必须和 output.library 中保持一致。 原因在于 DllPlugin 中的 name 参数会影响输出的 manifest.json 文件中 name 字段的值， 而在 `webpack.config.js` 文件中 DllReferencePlugin 会去 manifest.json 文件读取 name 字段的值， 把值的内容作为在从全局变量中获取动态链接库中内容时的全局变量名。

#### 执行构建

在修改好以上两个 Webpack 配置文件后，需要重新执行构建。 重新执行构建时要注意的是需要先把动态链接库相关的文件编译出来，因为主 Webpack 配置文件中定义的 DllReferencePlugin 依赖这些文件。

执行构建时流程如下：

1. 如果动态链接库相关的文件还没有编译出来，就需要先把它们编译出来。方法是执行 `webpack --config webpack_dll.config.js` 命令。
2. 在确保动态链接库存在时，才能正常的编译出入口执行文件。方法是执行 `webpack` 命令。这时你会发现构建速度有了非常大的提升。

### 多进程代码压缩 ParallelUglifyPlugin

在使用 Webpack 构建出用于发布到线上的代码时，都会有压缩代码这一流程。 最常见的 JavaScript 代码压缩工具是 [UglifyJS](https://github.com/mishoo/UglifyJS2)，并且 Webpack 也内置了它。

用过 UglifyJS 的你一定会发现在构建用于开发环境的代码时很快就能完成，但在构建用于线上的代码时构建一直卡在一个时间点迟迟没有反应，其实卡住的这个时候就是在进行代码压缩。

由于压缩 JavaScript 代码需要先把代码解析成用 Object 抽象表示的 AST 语法树，再去应用各种规则分析和处理 AST，导致这个过程计算量巨大，耗时非常多。

为什么不把在[4-3 使用 HappyPack](https://webpack.wuhaolin.cn/4优化/4-3使用HappyPack.html)中介绍过的多进程并行处理的思想也引入到代码压缩中呢？

[ParallelUglifyPlugin](https://github.com/gdborton/webpack-parallel-uglify-plugin) 就做了这个事情。 当 Webpack 有多个 JavaScript 文件需要输出和压缩时，原本会使用 UglifyJS 去一个个挨着压缩再输出， 但是 ParallelUglifyPlugin 则会开启多个子进程，把对多个文件的压缩工作分配给多个子进程去完成，每个子进程其实还是通过 UglifyJS 去压缩代码，但是变成了并行执行。 所以 ParallelUglifyPlugin 能更快的完成对多个文件的压缩工作。

使用 ParallelUglifyPlugin 也非常简单，把原来 Webpack 配置文件中内置的 UglifyJsPlugin 去掉后，再替换成 ParallelUglifyPlugin，相关代码如下：

```js
const path = require('path')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      }
    })
  ]
}
```

在通过 `new ParallelUglifyPlugin()` 实例化时，支持以下参数：

- `test`：使用正则去匹配哪些文件需要被 ParallelUglifyPlugin 压缩，默认是 `/.js$/`，也就是默认压缩所有的 .js 文件。
- `include`：使用正则去命中需要被 ParallelUglifyPlugin 压缩的文件。默认为 `[]`。
- `exclude`：使用正则去命中不需要被 ParallelUglifyPlugin 压缩的文件。默认为 `[]`。
- `cacheDir`：缓存压缩后的结果，下次遇到一样的输入时直接从缓存中获取压缩后的结果并返回。cacheDir 用于配置缓存存放的目录路径。默认不会缓存，想开启缓存请设置一个目录路径。
- `workerCount`：开启几个子进程去并发的执行压缩。默认是当前运行电脑的 CPU 核数减去 1。
- `sourceMap`：是否输出 Source Map，这会导致压缩过程变慢。
- `uglifyJS`：用于压缩 ES5 代码时的配置，Object 类型，直接透传给 UglifyJS 的参数。
- `uglifyES`：用于压缩 ES6 代码时的配置，Object 类型，直接透传给 UglifyES 的参数。

其中的 `test`、`include`、`exclude` 与配置 Loader 时的思想和用法一样。

> [UglifyES](https://github.com/mishoo/UglifyJS2/tree/harmony) 是 UglifyJS 的变种，专门用于压缩 ES6 代码，它们两都出自于同一个项目，并且它们两不能同时使用。
>
> UglifyES 一般用于给比较新的 JavaScript 运行环境压缩代码，例如用于 ReactNative 的代码运行在兼容性较好的 JavaScriptCore 引擎中，为了得到更好的性能和尺寸，采用 UglifyES 压缩效果会更好。
>
> ParallelUglifyPlugin 同时内置了 UglifyJS 和 UglifyES，也就是说 ParallelUglifyPlugin 支持并行压缩 ES6 代码。

接入 ParallelUglifyPlugin 后，项目需要安装新的依赖：

```bash
npm i -D webpack-parallel-uglify-plugin
```

安装成功后，重新执行构建你会发现速度变快了许多。如果设置 `cacheDir` 开启了缓存，在之后的构建中会变的更快。

- 在 Webpack3 中，我们是使用 UglifyJS 来压缩代码，但是这个是单线程运行的，为了提高效率，使用 webpack-parallel-uglify-plugin 来并行运行 UglifyJS，从而提高效率。
- 在 Webpack4 中，我们直接将 mode 设置为 production 就可以默认开启上述功能

## 如何减少打包体积

### 开启 Scope Hoisting

Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快， 它又译作 "作用域提升"，是在 Webpack3 中新推出的功能。 单从名字上看不出 Scope Hoisting 到底做了什么，下面来详细介绍它。

#### 认识 Scope Hoisting

让我们先来看看在没有 Scope Hoisting 之前 Webpack 的打包方式。

假如现在有两个文件分别是 `util.js`:

```js
export default 'Hello,Webpack'
```

和入口文件 `main.js`:

```js
import str from './util.js'
console.log(str)
```

以上源码用 Webpack 打包后输出中的部分代码如下：

```js
;[
  function(module, __webpack_exports__, __webpack_require__) {
    var __WEBPACK_IMPORTED_MODULE_0__util_js__ = __webpack_require__(1)
    console.log(__WEBPACK_IMPORTED_MODULE_0__util_js__['a'])
  },
  function(module, __webpack_exports__, __webpack_require__) {
    __webpack_exports__['a'] = 'Hello,Webpack'
  }
]
```

在开启 Scope Hoisting 后，同样的源码输出的部分代码如下：

```js
;[
  function(module, __webpack_exports__, __webpack_require__) {
    var util = 'Hello,Webpack'
    console.log(util)
  }
]
```

从中可以看出开启 Scope Hoisting 后，函数声明由两个变成了一个，`util.js` 中定义的内容被直接注入到了 `main.js` 对应的模块中。 这样做的好处是：

- 代码体积更小，因为函数申明语句会产生大量代码；
- 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小。

Scope Hoisting 的实现原理其实很简单：分析出模块之间的依赖关系，尽可能的把打散的模块合并到一个函数中去，但前提是不能造成代码冗余。 因此只有那些被引用了一次的模块才能被合并。

由于 Scope Hoisting 需要分析出模块之间的依赖关系，因此源码必须采用 ES6 模块化语句，不然它将无法生效。 原因和[4-10 使用 TreeShaking](https://webpack.wuhaolin.cn/4优化/4-10使用TreeShaking.html) 中介绍的类似。

#### 使用 Scope Hoisting

要在 Webpack 中使用 Scope Hoisting 非常简单，因为这是 Webpack 内置的功能，只需要配置一个插件，相关代码如下：

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')

module.exports = {
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin()
  ]
}
```

同时，考虑到 Scope Hoisting 依赖源码需采用 ES6 模块化语法，还需要配置 `mainFields`。 原因在 [4-10 使用 TreeShaking](https://webpack.wuhaolin.cn/4优化/4-10使用TreeShaking.html) 中提到过：因为大部分 Npm 中的第三方库采用了 CommonJS 语法，但部分库会同时提供 ES6 模块化的代码，为了充分发挥 Scope Hoisting 的作用，需要增加以下配置：

```js
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  }
}
```

对于采用了非 ES6 模块化语法的代码，Webpack 会降级处理不使用 Scope Hoisting 优化，为了知道 Webpack 对哪些代码做了降级处理， 你可以在启动 Webpack 时带上 `--display-optimization-bailout` 参数，这样在输出日志中就会包含类似如下的日志：

```
[0] ./main.js + 1 modules 80 bytes {0} [built]
    ModuleConcatenation bailout: Module is not an ECMAScript module
```

其中的 `ModuleConcatenation bailout` 告诉了你哪个文件因为什么原因导致了降级处理。

也就是说要开启 Scope Hoisting 并发挥最大作用的配置如下：

```js
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')

module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin()
  ]
}
```

### 使用 Tree Shaking

#### 认识 Tree Shaking

Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码。它依赖静态的 ES6 模块化语法，例如通过 `import` 和 `export` 导入导出。 Tree Shaking 最先在 Rollup 中出现，Webpack 在 2.0 版本中将其引入。

为了更直观的理解它，来看一个具体的例子。假如有一个文件 `util.js` 里存放了很多工具函数和常量，在 `main.js` 中会导入和使用 `util.js`，代码如下：

`util.js` 源码：

```js
export function funcA() {}

export function funB() {}

export const a = 'a'
```

`main.js` 源码：

```js
import { funcA } from './util.js'
funcA()
```

Tree Shaking 后的 `util.js`：

```js
export function funcA() {}
```

由于只用到了 `util.js` 中的 `funcA`，所以剩下的都被 Tree Shaking 当作死代码给剔除了。

需要注意的是要让 Tree Shaking 正常工作的前提是交给 Webpack 的 JavaScript 代码必须是采用 ES6 模块化语法的， 因为 ES6 模块化语法是静态的（导入导出语句中的路径必须是静态的字符串，而且不能放入其它代码块中），这让 Webpack 可以简单的分析出哪些 `export` 的被 `import` 过了。 如果你采用 ES5 中的模块化，例如 `module.export={...}`、`require(x+y)`、`if(x){require('./util')}`，Webpack 无法分析出哪些代码可以剔除。

> 目前的 Tree Shaking 还有些的局限性，经实验发现：
>
> 1. 不会对 entry 入口文件做 Tree Shaking。
> 2. 不会对[异步分割](https://webpack.wuhaolin.cn/4优化/4-12按需加载.html)出去的代码做 Tree Shaking。

#### 接入 Tree Shaking

上面讲了 Tree Shaking 是做什么的，接下来一步步教你如何配置 Webpack 让 Tree Shaking 生效。

首先，为了把采用 ES6 模块化的代码交给 Webpack，需要配置 Babel 让其保留 ES6 模块化语句，修改 `.babelrc` 文件为如下：

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false
      }
    ]
  ]
}
```

其中 `"modules": false` 的含义是关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法。

配置好 Babel 后，重新运行 Webpack，在启动 Webpack 时带上 `--display-used-exports` 参数，以方便追踪 Tree Shaking 的工作， 这时你会发现在控制台中输出了如下的日志：

```shell
> webpack --display-used-exports
bundle.js  3.5 kB       0  [emitted]  main
   [0] ./main.js 41 bytes {0} [built]
   [1] ./util.js 511 bytes {0} [built]
       [only some exports used: funcA]
```

其中 `[only some exports used: funcA]` 提示了 `util.js` 只导出了用到的 `funcA`，说明 Webpack 确实正确的分析出了如何剔除死代码。

但当你打开 Webpack 输出的 `bundle.js` 文件看下时，你会发现用不上的代码还在里面，如下：

```js
/* harmony export (immutable) */
__webpack_exports__['a'] = funcA

/* unused harmony export funB */

function funcA() {
  console.log('funcA')
}

function funB() {
  console.log('funcB')
}
```

Webpack 只是指出了哪些函数用上了哪些没用上，要剔除用不上的代码还得经过 UglifyJS 去处理一遍。 要接入 UglifyJS 也很简单，不仅可以通过[4-8 压缩代码](https://webpack.wuhaolin.cn/4优化/4-8压缩代码.html)中介绍的加入 UglifyJSPlugin 去实现， 也可以简单的通过在启动 Webpack 时带上 `--optimize-minimize` 参数，为了快速验证 Tree Shaking 我们采用较简单的后者来实验下。

通过 `webpack --display-used-exports --optimize-minimize` 重启 Webpack 后，打开新输出的 `bundle.js`，内容如下：

```js
function r() {
  console.log('funcA')
}

t.a = r
```

可以看出 Tree Shaking 确实做到了，用不上的代码都被剔除了。

当你的项目使用了大量第三方库时，你会发现 Tree Shaking 似乎不生效了，原因是大部分 Npm 中的代码都是采用的 CommonJS 语法， 这导致 Tree Shaking 无法正常工作而降级处理。 但幸运的时有些库考虑到了这点，这些库在发布到 Npm 上时会同时提供两份代码，一份采用 CommonJS 模块化语法，一份采用 ES6 模块化语法。 并且在 `package.json` 文件中分别指出这两份代码的入口。

以 `redux` 库为例，其发布到 Npm 上的目录结构为：

```markdown
node_modules/redux |-- es | |-- index.js # 采用 ES6 模块化语法 |-- lib | |-- index.js # 采用 ES5 模块化语法 |-- package.json
```

`package.json` 文件中有两个字段：

```json
{
  "main": "lib/index.js", // 指明采用 CommonJS 模块化的代码入口
  "jsnext:main": "es/index.js" // 指明采用 ES6 模块化的代码入口
}
```

在[2-4Resolve mainFields](https://webpack.wuhaolin.cn/2配置/2-4Resolve.html#mainFields) 中曾介绍过 `mainFields` 用于配置采用哪个字段作为模块的入口描述。 为了让 Tree Shaking 对 `redux` 生效，需要配置 Webpack 的文件寻找规则为如下：

```js
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  }
}
```

以上配置的含义是优先使用 `jsnext:main` 作为入口，如果不存在 `jsnext:main` 就采用 `browser` 或者 `main` 作为入口。 虽然并不是每个 Npm 中的第三方模块都会提供 ES6 模块化语法的代码，但对于提供了的不能放过，能优化的就优化。

目前越来越多的 Npm 中的第三方模块考虑到了 Tree Shaking，并对其提供了支持。 采用 `jsnext:main` 作为 ES6 模块化代码的入口是社区的一个约定，假如将来你要发布一个库到 Npm 时，希望你能支持 Tree Shaking， 以让 Tree Shaking 发挥更大的优化效果，让更多

- 在 webpack4 中将 mode 设置为 production 就自动启用这个功能。

### 使用 Prepack

#### 认识 Prepack

在前面的优化方法中提到了代码压缩和分块，这些都是在网络加载层面的优化，除此之外还可以优化代码在运行时的效率，[Prepack](https://prepack.io/) 就是为此而生。

Prepack 由 Facebook 开源，它采用较为激进的方法：在保持运行结果一致的情况下，改变源代码的运行逻辑，输出性能更高的 JavaScript 代码。 实际上 Prepack 就是一个部分求值器，编译代码时提前将计算结果放到编译后的代码中，而不是在代码运行时才去求值。

以如下源码为例：

```js
import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

function hello(name) {
  return 'hello ' + name
}

class Button extends Component {
  render() {
    return hello(this.props.name)
  }
}

console.log(renderToString(<Button name="webpack" />))
```

被 Prepack 转化后竟然直接输出如下：

```js
console.log('hello webpack')
```

可以看出 Prepack 通过在编译阶段预先执行了源码得到执行结果，再直接把运行结果输出来以提升性能。

Prepack 的工作原理和流程大致如下：

1. 通过 Babel 把 JavaScript 源码解析成抽象语法树（AST），以方便更细粒度地分析源码；
2. Prepack 实现了一个 JavaScript 解释器，用于执行源码。借助这个解释器 Prepack 才能掌握源码具体是如何执行的，并把执行过程中的结果返回到输出中。

从表面上看去这似乎非常美好，但实际上 Prepack 还不够成熟与完善。Prepack 目前还处于初期的开发阶段，局限性也很大，例如：

- 不能识别 DOM API 和 部分 Node.js API，如果源码中有调用依赖运行环境的 API 就会导致 Prepack 报错；
- 存在优化后的代码性能反而更低的情况；
- 存在优化后的代码文件尺寸大大增加的情况。

总之，现在把 Prepack 用于线上环境还为时过早。

#### 接入 Webpack

Prepack 需要在 Webpack 输出最终的代码之前，对这些代码进行优化，就像 UglifyJS 那样。 因此需要通过新接入一个插件来为 Webpack 接入 Prepack，幸运的是社区中已经有人做好了这个插件：[prepack-webpack-plugin](https://github.com/gajus/prepack-webpack-plugin)。

接入该插件非常简单，相关配置代码如下：

```js
const PrepackWebpackPlugin = require('prepack-webpack-plugin').default

module.exports = {
  plugins: [new PrepackWebpackPlugin()]
}
```

重新执行构建你就会看到输出的被 Prepack 优化后的代码。

## 按需加载

### 为什么需要按需加载

随着互联网的发展，一个网页需要承载的功能越来越多。 对于采用单页应用作为前端架构的网站来说，会面临着一个网页需要加载的代码量很大的问题，因为许多功能都集中的做到了一个 HTML 里。 这会导致网页加载缓慢、交互卡顿，用户体验将非常糟糕。

导致这个问题的根本原因在于一次性的加载所有功能对应的代码，但其实用户每一阶段只可能使用其中一部分功能。 所以解决以上问题的方法就是用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载。

### 如何使用按需加载

在给单页应用做按需加载优化时，一般采用以下原则：

- 把整个网站划分成一个个小功能，再按照每个功能的相关程度把它们分成几类。
- 把每一类合并为一个 Chunk，按需加载对应的 Chunk。
- 对于用户首次打开你的网站时需要看到的画面所对应的功能，不要对它们做按需加载，而是放到执行入口所在的 Chunk 中，以降低用户能感知的网页加载时间。
- 对于个别依赖大量代码的功能点，例如依赖 Chart.js 去画图表、依赖 flv.js 去播放视频的功能点，可再对其进行按需加载。

被分割出去的代码的加载需要一定的时机去触发，也就是当用户操作到了或者即将操作到对应的功能时再去加载对应的代码。 被分割出去的代码的加载时机需要开发者自己去根据网页的需求去衡量和确定。

由于被分割出去进行按需加载的代码在加载的过程中也需要耗时，你可以预言用户接下来可能会进行的操作，并提前加载好对应的代码，从而让用户感知不到网络加载时间。

### 用 Webpack 实现按需加载

Webpack 内置了强大的分割代码的功能去实现按需加载，实现起来非常简单。

举个例子，现在需要做这样一个进行了按需加载优化的网页：

- 网页首次加载时只加载 `main.js` 文件，网页会展示一个按钮，`main.js` 文件中只包含监听按钮事件和加载按需加载的代码。
- 当按钮被点击时才去加载被分割出去的 `show.js` 文件，加载成功后再执行 `show.js` 里的函数。

其中 `main.js` 文件内容如下：

```js
window.document.getElementById('btn').addEventListener('click', function() {
  // 当按钮被点击后才去加载 show.js 文件，文件加载成功后执行文件导出的函数
  import(/* webpackChunkName: "show" */ './show').then((show) => {
    show('Webpack')
  })
})
```

`show.js` 文件内容如下：

```js
module.exports = function(content) {
  window.alert('Hello ' + content)
}
```

代码中最关键的一句是 `import(/* webpackChunkName: "show" */ './show')`，Webpack 内置了对 `import(*)` 语句的支持，当 Webpack 遇到了类似的语句时会这样处理：

- 以 `./show.js` 为入口新生成一个 Chunk；
- 当代码执行到 `import` 所在语句时才会去加载由 Chunk 对应生成的文件。
- `import` 返回一个 Promise，当文件加载成功时可以在 Promise 的 `then` 方法中获取到 `show.js` 导出的内容。

> 在使用 `import()` 分割代码后，你的浏览器要支持 [Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 才能让代码正常运行， 因为 `import()` 返回一个 Promise，它依赖 Promise。对于不原生支持 Promise 的浏览器，你可以注入 Promise polyfill。
>
> `/* webpackChunkName: "show" */` 的含义是为动态生成的 Chunk 赋予一个名称，以方便我们追踪和调试代码。 如果不指定动态生成的 Chunk 的名称，默认名称将会是 `[id].js`。 `/* webpackChunkName: "show" */` 是在 Webpack3 中引入的新特性，在 Webpack3 之前是无法为动态生成的 Chunk 赋予名称的。

为了正确的输出在 `/* webpackChunkName: "show" */` 中配置的 ChunkName，还需要配置下 Webpack，配置如下：

```js
module.exports = {
  // JS 执行入口文件
  entry: {
    main: './main.js'
  },
  output: {
    // 为从 entry 中配置生成的 Chunk 配置输出文件的名称
    filename: '[name].js',
    // 为动态加载的 Chunk 配置输出文件的名称
    chunkFilename: '[name].js'
  }
}
```

其中最关键的一行是 `chunkFilename: '[name].js',`，它专门指定动态生成的 Chunk 在输出时的文件名称。 如果没有这行，分割出的代码的文件名称将会是 `[id].js`。 chunkFilename 具体含义见[2-2 配置-Output](https://webpack.wuhaolin.cn/2配置/2-2Output.html#chunkFilename)。

### 按需加载与 ReactRouter

在实战中，不可能会有上面那么简单的场景，接下来举一个实战中的例子：对采用了 [ReactRouter](https://reacttraining.com/react-router/web) 的应用进行按需加载优化。 这个例子由一个单页应用构成，这个单页应用由两个子页面构成，通过 ReactRouter 在两个子页面之间切换和管理路由。

这个单页应用的入口文件 `main.js` 如下：

```jsx
import React, { PureComponent, createElement } from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Link } from 'react-router-dom'
import PageHome from './pages/home'

/**
 * 异步加载组件
 * @param load 组件加载函数，load 函数会返回一个 Promise，在文件加载完成时 resolve
 * @returns {AsyncComponent} 返回一个高阶组件用于封装需要异步加载的组件
 */
function getAsyncComponent(load) {
  return class AsyncComponent extends PureComponent {
    componentDidMount() {
      // 在高阶组件 DidMount 时才去执行网络加载步骤
      load().then(({ default: component }) => {
        // 代码加载成功，获取到了代码导出的值，调用 setState 通知高阶组件重新渲染子组件
        this.setState({
          component
        })
      })
    }

    render() {
      const { component } = this.state || {}
      // component 是 React.Component 类型，需要通过 React.createElement 生产一个组件实例
      return component ? createElement(component) : null
    }
  }
}

// 根组件
function App() {
  return (
    <HashRouter>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
          <Link to="/login">Login</Link>
        </nav>
        <hr />
        <Route exact path="/" component={PageHome} />
        <Route
          path="/about"
          component={getAsyncComponent(
            // 异步加载函数，异步地加载 PageAbout 组件
            () => import(/* webpackChunkName: 'page-about' */ './pages/about')
          )}
        />
        <Route
          path="/login"
          component={getAsyncComponent(
            // 异步加载函数，异步地加载 PageAbout 组件
            () => import(/* webpackChunkName: 'page-login' */ './pages/login')
          )}
        />
      </div>
    </HashRouter>
  )
}

// 渲染根组件
render(<App />, window.document.getElementById('app'))
```

以上代码中最关键的部分是 `getAsyncComponent` 函数，它的作用是配合 ReactRouter 去按需加载组件，具体含义请看代码中的注释。

由于以上源码需要通过 Babel 去转换后才能在浏览器中正常运行，需要在 Webpack 中配置好对应的 babel-loader，源码先交给 babel-loader 处理后再交给 Webpack 去处理其中的 `import(*)` 语句。 但这样做后你很快会发现一个问题：Babel 报出错误说不认识 `import(*)` 语法。 导致这个问题的原因是 `import(*)` 语法还没有被加入到在 [3-1 使用 ES6 语言](https://webpack.wuhaolin.cn/3实战/3-1使用ES6语言.html#Presets)中提到的 ECMAScript 标准中去， 为此我们需要安装一个 Babel 插件 `babel-plugin-syntax-dynamic-import`，并且将其加入到 `.babelrc` 中去：

```json
{
  "presets": ["env", "react"],
  "plugins": ["syntax-dynamic-import"]
}
```

执行 Webpack 构建后，你会发现输出了三个文件：

- `main.js`：执行入口所在的代码块，同时还包括 PageHome 所需的代码，因为用户首次打开网页时就需要看到 PageHome 的内容，所以不对其进行按需加载，以降低用户能感知到的加载时间；
- `page-about.js`：当用户访问 `/about` 时才会加载的代码块；
- `page-login.js`：当用户访问 `/login` 时才会加载的代码块。

同时你还会发现 `page-about.js` 和 `page-login.js` 这两个文件在首页是不会加载的，而是会当你切换到了对应的子页面后文件才会开始加载。

## 压缩代码

浏览器从服务器访问网页时获取的 JavaScript、CSS 资源都是文本形式的，文件越大网页加载时间越长。 为了提升网页加速速度和减少网络传输流量，可以对这些资源进行压缩。 压缩的方法除了可以通过 GZIP 算法对文件压缩外，还可以对文本本身进行压缩。

对文本本身进行压缩的作用除了有提升网页加载速度的优势外，还具有混淆源码的作用。 由于压缩后的代码可读性非常差，就算别人下载到了网页的代码，也大大增加了代码分析和改造的难度。

下面来一一介绍如何在 Webpack 中压缩代码。

### 压缩 JavaScript

目前最成熟的 JavaScript 代码压缩工具是 [UglifyJS](https://github.com/mishoo/UglifyJS2) ， 它会分析 JavaScript 代码语法树，理解代码含义，从而能做到诸如去掉无效代码、去掉日志输出代码、缩短变量名等优化。

要在 Webpack 中接入 UglifyJS 需要通过插件的形式，目前有两个成熟的插件，分别是：

- UglifyJsPlugin：通过封装 UglifyJS 实现压缩。
- ParallelUglifyPlugin：多进程并行处理压缩，[4-4 使用 ParallelUglifyPlugin](https://webpack.wuhaolin.cn/4优化/4-4使用ParallelUglifyPlugin.html) 中有详细介绍。

由于 ParallelUglifyPlugin 在 [4-4 使用 ParallelUglifyPlugin](https://webpack.wuhaolin.cn/4优化/4-4使用ParallelUglifyPlugin.html) 中介绍过就不再复述， 这里重点介绍如何配置 UglifyJS 以达到最优的压缩效果。

UglifyJS 提供了非常多的选择用于配置在压缩过程中采用哪些规则，所有的选项说明可以在 [其官方文档](https://github.com/mishoo/UglifyJS2#minify-options) 上看到。 由于选项非常多，就挑出一些常用的拿出来详细讲解其应用方式：

- `sourceMap`：是否为压缩后的代码生成对应的 Source Map，默认为不生成，开启后耗时会大大增加。一般不会把压缩后的代码的 Source Map 发送给网站用户的浏览器，而是用于内部开发人员调试线上代码时使用。
- `beautify`： 是否输出可读性较强的代码，即会保留空格和制表符，默认为是，为了达到更好的压缩效果，可以设置为 `false`。
- `comments`：是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为 `false`。
- `compress.warnings`：是否在 UglifyJs 删除没有用到的代码时输出警告信息，默认为输出，可以设置为 `false` 以关闭这些作用不大的警告。
- `drop_console`：是否剔除代码中所有的 `console` 语句，默认为不剔除。开启后不仅可以提升代码压缩效果，也可以兼容不支持 `console` 语句 IE 浏览器。
- `collapse_vars`：是否内嵌定义了但是只用到一次的变量，例如把 `var x = 5; y = x` 转换成 `y = 5`，默认为不转换。为了达到更好的压缩效果，可以设置为 `true`。
- `reduce_vars`： 是否提取出出现多次但是没有定义成变量去引用的静态值，例如把 `x = 'Hello'; y = 'Hello'` 转换成 `var a = 'Hello'; x = a; y = b`，默认为不转换。为了达到更好的压缩效果，可以设置为 `true`。

也就是说，在不影响代码正确执行的前提下，最优化的代码压缩配置为如下：

```js
const UglifyJSPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

module.exports = {
  plugins: [
    // 压缩输出的 JS 代码
    new UglifyJSPlugin({
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      },
      output: {
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false
      }
    })
  ]
}
```

从以上配置中可以看出 Webpack 内置了 UglifyJsPlugin，需要指出的是 UglifyJsPlugin 当前采用的是 [UglifyJS2](https://github.com/mishoo/UglifyJS2) 而不是老的 [UglifyJS1](https://github.com/mishoo/UglifyJS)， 这两个版本的 UglifyJS 在配置上有所区别，看文档时注意版本。

除此之外 Webpack 还提供了一个更简便的方法来接入 UglifyJSPlugin，直接在启动 Webpack 时带上 `--optimize-minimize` 参数，即 `webpack --optimize-minimize`， 这样 Webpack 会自动为你注入一个带有默认配置的 UglifyJSPlugin。

### 压缩 ES6

虽然当前大多数 JavaScript 引擎还不完全支持 ES6 中的新特性，但在一些特定的运行环境下已经可以直接执行 ES6 代码了，例如最新版的 Chrome、ReactNative 的引擎 JavaScriptCore。

运行 ES6 的代码相比于转换后的 ES5 代码有如下优点：

- 一样的逻辑用 ES6 实现的代码量比 ES5 更少。
- JavaScript 引擎对 ES6 中的语法做了性能优化，例如针对 `const` 申明的变量有更快的读取速度。

所以在运行环境允许的情况下，我们要尽可能的使用原生的 ES6 代码去运行，而不是转换后的 ES5 代码。

在你用上面所讲的压缩方法去压缩 ES6 代码时，你会发现 UglifyJS 会报错退出，原因是 UglifyJS 只认识 ES5 语法的代码。 为了压缩 ES6 代码，需要使用专门针对 ES6 代码的 [UglifyES](https://github.com/mishoo/UglifyJS2/tree/harmony)。

UglifyES 和 UglifyJS 来自同一个项目的不同分支，它们的配置项基本相同，只是接入 Webpack 时有所区别。 在给 Webpack 接入 UglifyES 时，不能使用内置的 UglifyJsPlugin，而是需要单独安装和使用最新版本的 [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)。 安装方法如下：

```bash
npm i -D uglifyjs-webpack-plugin@beta
```

Webpack 相关配置代码如下：

```js
const UglifyESPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyESPlugin({
      // 多嵌套了一层
      uglifyOptions: {
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        },
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false
        }
      }
    })
  ]
}
```

同时，为了不让 babel-loader 输出 ES5 语法的代码，需要去掉 `.babelrc` 配置文件中的 `babel-preset-env`，但是其它的 Babel 插件，比如 `babel-preset-react` 还是要保留， 因为正是 `babel-preset-env` 负责把 ES6 代码转换为 ES5 代码。

### 压缩 CSS

CSS 代码也可以像 JavaScript 那样被压缩，以达到提升加载速度和代码混淆的作用。 目前比较成熟可靠的 CSS 压缩工具是 [cssnano](http://cssnano.co/)，基于 PostCSS。

cssnano 能理解 CSS 代码的含义，而不仅仅是删掉空格，例如：

- `margin: 10px 20px 10px 20px` 被压缩成 `margin: 10px 20px`
- `color: #ff0000` 被压缩成 `color:red`

还有很多压缩规则可以去其官网查看，通常压缩率能达到 60%。

把 cssnano 接入到 Webpack 中也非常简单，因为 css-loader 已经将其内置了，要开启 cssnano 去压缩代码只需要开启 css-loader 的 minimize 选项。 相关 Webpack 配置如下：

```js
const path = require('path')
const { WebPlugin } = require('web-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // 增加对 CSS 文件的支持
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 通过 minimize 选项压缩 CSS 代码
          use: ['css-loader?minimize']
        })
      }
    ]
  },
  plugins: [
    // 用 WebPlugin 生成对应的 HTML 文件
    new WebPlugin({
      template: './template.html', // HTML 模版文件所在的文件路径
      filename: 'index.html' // 输出的 HTML 的文件名称
    }),
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css` // 给输出的 CSS 文件名称加上 Hash 值
    })
  ]
}
```

## CDN 加速

### 什么是 CDN

虽然前面通过了压缩代码的手段来减小网络传输大小，但实际上最影响用户体验的还是网页首次打开时的加载等待。 导致这个问题的根本是网络传输过程耗时大，CDN 的作用就是加速网络传输。

CDN 又叫内容分发网络，通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。 CDN 其实是通过优化物理链路层传输过程中的网速有限、丢包等问题来提升网速的，其大致原理可以如下：

![图4-9-1 CDN 原理](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-9cdn-arch.png)

在本节中你不必理解 CDN 的具体运行流程和实现原理，你可以简单的把 CDN 服务看作成速度更快的 HTTP 服务。 并且目前很多大公司都会建立自己的 CDN 服务，就算你自己没有资源去搭建一套 CDN 服务，各大云服务提供商都提供了按量收费的 CDN 服务。

### 接入 CDN

要给网站接入 CDN，需要把网页的静态资源上传到 CDN 服务上去，在服务这些静态资源的时候需要通过 CDN 服务提供的 URL 地址去访问。

举个详细的例子，有一个单页应用，构建出的代码结构如下：

```
dist
|-- app_9d89c964.js
|-- app_a6976b6d.css
|-- arch_ae805d49.png
`-- index.html
```

其中 `index.html` 内容如下：

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="app_a6976b6d.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="app_9d89c964.js"></script>
  </body>
</html>
```

`app_a6976b6d.css`内容如下：

```css
body {
  background: url(arch_ae805d49.png) repeat;
}
h1 {
  color: red;
}
```

可以看出到导入资源时都是通过相对路径去访问的，当把这些资源都放到同一个 CDN 服务上去时，网页是能正常使用的。 但需要注意的是由于 CDN 服务一般都会给资源开启很长时间的缓存，例如用户从 CDN 上获取到了 `index.html` 这个文件后， 即使之后的发布操作把 `index.html` 文件给重新覆盖了，但是用户在很长一段时间内还是运行的之前的版本，这会导致新的发布不能立即生效。

要避免以上问题，业界比较成熟的做法是这样的：

- 针对 HTML 文件：不开启缓存，把 HTML 放到自己的服务器上，而不是 CDN 服务上，同时关闭自己服务器上的缓存。自己的服务器只提供 HTML 文件和数据接口。
- 针对静态的 JavaScript、CSS、图片等文件：开启 CDN 和缓存，上传到 CDN 服务上去，同时给每个文件名带上由文件内容算出的 Hash 值， 例如上面的 `app_a6976b6d.css` 文件。 带上 Hash 值的原因是文件名会随着文件内容而变化，只要文件发生变化其对应的 URL 就会变化，它就会被重新下载，无论缓存时间有多长。

采用以上方案后，在 HTML 文件中的资源引入地址也需要换成 CDN 服务提供的地址，例如以上的 `index.html` 变为如下：

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="//cdn.com/id/app_a6976b6d.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="//cdn.com/id/app_9d89c964.js"></script>
  </body>
</html>
```

并且 `app_a6976b6d.css` 的内容也应该变为如下：

```css
body {
  background: url(//cdn.com/id/arch_ae805d49.png) repeat;
}
h1 {
  color: red;
}
```

也就是说，之前的相对路径，都变成了绝对的指向 CDN 服务的 URL 地址。

> 如果你对形如 `//cdn.com/id/app_a6976b6d.css` 这样的 URL 感到陌生，你需要知道这种 URL 省掉了前面的 `http:` 或者 `https:` 前缀， 这样做的好处时在访问这些资源的时候会自动的根据当前 HTML 的 URL 是采用什么模式去决定是采用 HTTP 还是 HTTPS 模式。

除此之外，如果你还知道浏览器有一个规则是同一时刻针对同一个域名的资源并行请求是有限制的话（具体数字大概 4 个左右，不同浏览器可能不同）， 你会发现上面的做法有个很大的问题。由于所有静态资源都放到了同一个 CDN 服务的域名下，也就是上面的 `cdn.com`。 如果网页的资源很多，例如有很多图片，就会导致资源的加载被阻塞，因为同时只能加载几个，必须等其它资源加载完才能继续加载。 要解决这个问题，可以把这些静态资源分散到不同的 CDN 服务上去， 例如把 JavaScript 文件放到 `js.cdn.com` 域名下、把 CSS 文件放到 `css.cdn.com` 域名下、图片文件放到 `img.cdn.com` 域名下， 这样做之后 `index.html` 需要变成这样：

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="//css.cdn.com/id/app_a6976b6d.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="//js.cdn.com/id/app_9d89c964.js"></script>
  </body>
</html>
```

> 使用了多个域名后又会带来一个新问题：增加域名解析时间。是否采用多域名分散资源需要根据自己的需求去衡量得失。 当然你可以通过在 HTML HEAD 标签中 加入 `<link rel="dns-prefetch" href="//js.cdn.com">` 去预解析域名，以降低域名解析带来的延迟。

### 用 Webpack 实现 CDN 的接入

总结上面所说的，构建需要实现以下几点：

- 静态资源的导入 URL 需要变成指向 CDN 服务的绝对路径的 URL 而不是相对于 HTML 文件的 URL。
- 静态资源的文件名称需要带上有文件内容算出来的 Hash 值，以防止被缓存。
- 不同类型的资源放到不同域名的 CDN 服务上去，以防止资源的并行加载被阻塞。

先来看下要实现以上要求的最终 Webpack 配置：

```js
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { WebPlugin } = require('web-webpack-plugin')

module.exports = {
  // 省略 entry 配置...
  output: {
    // 给输出的 JavaScript 文件名称加上 Hash 值
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist'),
    // 指定存放 JavaScript 文件的 CDN 目录 URL
    publicPath: '//js.cdn.com/id/'
  },
  module: {
    rules: [
      {
        // 增加对 CSS 文件的支持
        test: /\.css$/,
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          // 压缩 CSS 代码
          use: ['css-loader?minimize'],
          // 指定存放 CSS 中导入的资源（例如图片）的 CDN 目录 URL
          publicPath: '//img.cdn.com/id/'
        })
      },
      {
        // 增加对 PNG 文件的支持
        test: /\.png$/,
        // 给输出的 PNG 文件名称加上 Hash 值
        use: ['file-loader?name=[name]_[hash:8].[ext]']
      }
      // 省略其它 Loader 配置...
    ]
  },
  plugins: [
    // 使用 WebPlugin 自动生成 HTML
    new WebPlugin({
      // HTML 模版文件所在的文件路径
      template: './template.html',
      // 输出的 HTML 的文件名称
      filename: 'index.html',
      // 指定存放 CSS 文件的 CDN 目录 URL
      stylePublicPath: '//css.cdn.com/id/'
    }),
    new ExtractTextPlugin({
      // 给输出的 CSS 文件名称加上 Hash 值
      filename: `[name]_[contenthash:8].css`
    })
    // 省略代码压缩插件配置...
  ]
}
```

以上代码中最核心的部分是通过 `publicPath` 参数设置存放静态资源的 CDN 目录 URL， 为了让不同类型的资源输出到不同的 CDN，需要分别在：

- `output.publicPath` 中设置 JavaScript 的地址。
- `css-loader.publicPath` 中设置被 CSS 导入的资源的的地址。
- `WebPlugin.stylePublicPath` 中设置 CSS 文件的地址。

设置好 `publicPath` 后，`WebPlugin` 在生成 HTML 文件和 `css-loader` 转换 CSS 代码时，会考虑到配置中的 `publicPath`，用对应的线上地址替换原来的相对地址。

## 提取公共代码

### 为什么需要提取公共代码

大型网站通常会由多个页面组成，每个页面都是一个独立的单页应用。 但由于所有页面都采用同样的技术栈，以及使用同一套样式代码，这导致这些页面之间有很多相同的代码。

如果每个页面的代码都把这些公共的部分包含进去，会造成以下问题：

- 相同的资源被重复的加载，浪费用户的流量和服务器的成本；
- 每个页面需要加载的资源太大，导致网页首屏加载缓慢，影响用户体验。

如果把多个页面公共的代码抽离成单独的文件，就能优化以上问题。 原因是假如用户访问了网站的其中一个网页，那么访问这个网站下的其它网页的概率将非常大。 在用户第一次访问后，这些页面公共代码的文件已经被浏览器缓存起来，在用户切换到其它页面时，存放公共代码的文件就不会再重新加载，而是直接从缓存中获取。 这样做后有如下好处：

- 减少网络传输流量，降低服务器成本；
- 虽然用户第一次打开网站的速度得不到优化，但之后访问其它页面的速度将大大提升。

### 如何提取公共代码

你已经知道了提取公共代码会有什么好处，但是在实战中具体要怎么做，以达到效果最优呢？ 通常你可以采用以下原则去为你的网站提取公共代码：

- 根据你网站所使用的技术栈，找出网站所有页面都需要用到的基础库，以采用 React 技术栈的网站为例，所有页面都会依赖 react、react-dom 等库，把它们提取到一个单独的文件。 一般把这个文件叫做 `base.js`，因为它包含所有网页的基础运行环境；
- 在剔除了各个页面中被 `base.js` 包含的部分代码外，再找出所有页面都依赖的公共部分的代码提取出来放到 `common.js` 中去。
- 再为每个网页都生成一个单独的文件，这个文件中不再包含 `base.js` 和 `common.js` 中包含的部分，而只包含各个页面单独需要的部分代码。

文件之间的结构图如下：

![图4-11 提取公共代码文件结构图](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-11%E6%8F%90%E5%8F%96%E5%85%AC%E5%85%B1%E4%BB%A3%E7%A0%81.png)

读到这里你可以会有疑问：既然能找出所有页面都依赖的公共代码，并提取出来放到 `common.js` 中去，为什么还需要再把网站所有页面都需要用到的基础库提取到 `base.js` 去呢？ 原因是为了长期的缓存 `base.js` 这个文件。

发布到线上的文件都会采用在[4-9CDN 加速](https://webpack.wuhaolin.cn/4优化/4-9CDN加速.html)中介绍过的方法，对静态文件的文件名都附加根据文件内容计算出 Hash 值，也就是最终 `base.js` 的文件名会变成 `base_3b1682ac.js`，以长期缓存文件。 网站通常会不断的更新发布，每次发布都会导致 `common.js` 和各个网页的 JavaScript 文件都会因为文件内容发生变化而导致其 Hash 值被更新，也就是缓存被更新。

把所有页面都需要用到的基础库提取到 `base.js` 的好处在于只要不升级基础库的版本，`base.js` 的文件内容就不会变化，Hash 值不会被更新，缓存就不会被更新。 每次发布浏览器都会使用被缓存的 `base.js` 文件，而不用去重新下载 `base.js` 文件。 由于 `base.js` 通常会很大，这对提升网页加速速度能起到很大的效果。

### 如何通过 Webpack 提取公共代码

你已经知道如何提取公共代码，接下来教你如何用 Webpack 实现。

Webpack 内置了专门用于提取多个 Chunk 中公共部分的插件 CommonsChunkPlugin，CommonsChunkPlugin 大致使用方法如下：

```js
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')

new CommonsChunkPlugin({
  // 从哪些 Chunk 中提取
  chunks: ['a', 'b'],
  // 提取出的公共部分形成一个新的 Chunk，这个新 Chunk 的名称
  name: 'common'
})
```

以上配置就能从网页 A 和网页 B 中抽离出公共部分，放到 common 中。

每个 CommonsChunkPlugin 实例都会生成一个新的 Chunk，这个新 Chunk 中包含了被提取出的代码，在使用过程中必须指定 `name` 属性，以告诉插件新生成的 Chunk 的名称。 其中 `chunks` 属性指明从哪些已有的 Chunk 中提取，如果不填该属性，则默认会从所有已知的 Chunk 中提取。

> Chunk 是一系列文件的集合，一个 Chunk 中会包含这个 Chunk 的入口文件和入口文件依赖的文件。

通过以上配置输出的 common Chunk 中会包含所有页面都依赖的基础运行库 react、react-dom，为了把基础运行库从 common 中抽离到 base 中去，还需要做一些处理。

首先需要先配置一个 Chunk，这个 Chunk 中只依赖所有页面都依赖的基础库以及所有页面都使用的样式，为此需要在项目中写一个文件 `base.js` 来描述 base Chunk 所依赖的模块，文件内容如下：

```js
// 所有页面都依赖的基础库
import 'react'
import 'react-dom'
// 所有页面都使用的样式
import './base.css'
```

接着再修改 Webpack 配置，在 entry 中加入 base，相关修改如下：

```js
module.exports = {
  entry: {
    base: './base.js'
  }
}
```

以上就完成了对新 Chunk base 的配置。

为了从 common 中提取出 base 也包含的部分，还需要配置一个 CommonsChunkPlugin，相关代码如下：

```js
new CommonsChunkPlugin({
  // 从 common 和 base 两个现成的 Chunk 中提取公共的部分
  chunks: ['common', 'base'],
  // 把公共的部分放到 base 中
  name: 'base'
})
```

由于 common 和 base 公共的部分就是 base 目前已经包含的部分，所以这样配置后 common 将会变小，而 base 将保持不变。

以上都配置好后重新执行构建，你将会得到四个文件，它们分别是：

- `base.js`：所有网页都依赖的基础库组成的代码；
- `common.js`：网页 A、B 都需要的，但又不在 `base.js` 文件中出现过的代码；
- `a.js`：网页 A 单独需要的代码；
- `b.js`：网页 B 单独需要的代码。

为了让网页正常运行，以网页 A 为例，你需要在其 HTML 中按照以下顺序引入以下文件才能让网页正常运行：

```html
<script src="base.js"></script>
<script src="common.js"></script>
<script src="a.js"></script>
```

以上就完成了提取公共代码需要的所有步骤。

针对 CSS 资源，以上理论和方法同样有效，也就是说你也可以对 CSS 文件做同样的优化。

以上方法可能会出现 `common.js` 中没有代码的情况，原因是去掉基础运行库外很难再找到所有页面都会用上的模块。 在出现这种情况时，你可以采取以下做法之一：

- CommonsChunkPlugin 提供一个选项 `minChunks`，表示文件要被提取出来时需要在指定的 Chunks 中最小出现最小次数。 假如 `minChunks=2`、`chunks=['a','b','c','d']`，任何一个文件只要在 `['a','b','c','d']` 中任意两个以上的 Chunk 中都出现过，这个文件就会被提取出来。 你可以根据自己的需求去调整 minChunks 的值，minChunks 越小越多的文件会被提取到 `common.js` 中去，但这也会导致部分页面加载的不相关的资源越多； minChunks 越大越少的文件会被提取到 `common.js` 中去，但这会导致 `common.js` 变小、效果变弱。
- 根据各个页面之间的相关性选取其中的部分页面用 CommonsChunkPlugin 去提取这部分被选出的页面的公共部分，而不是提取所有页面的公共部分，而且这样的操作可以叠加多次。 这样做的效果会很好，但缺点是配置复杂，你需要根据页面之间的关系去思考如何配置，该方法不通用。

## 输出分析

前面虽然介绍了非常多的优化方法，但这些方法也无法涵盖所有的场景，为此你需要对输出结果做分析，以决定下一步的优化方向。

最直接的分析方法就是去阅读 Webpack 输出的代码，但由于 Webpack 输出的代码可读性非常差而且文件非常大，这会让你非常头疼。 为了更简单直观的分析输出结果，社区中出现了许多可视化的分析工具。这些工具以图形的方式把结果更加直观的展示出来，让你快速看到问题所在。 接下来教你如何使用这些工具。

在启动 Webpack 时，支持两个参数，分别是：

- `--profile`：记录下构建过程中的耗时信息；
- `--json`：以 JSON 的格式输出构建结果，最后只输出一个 `.json` 文件，这个文件中包括所有构建相关的信息。

在启动 Webpack 时带上以上两个参数，启动命令如下 `webpack --profile --json > stats.json`，你会发现项目中多出了一个 `stats.json` 文件。 这个 `stats.json` 文件是给后面介绍的可视化分析工具使用的。

> `webpack --profile --json` 会输出字符串形式的 JSON，`> stats.json` 是 UNIX/Linux 系统中的管道命令、含义是把 `webpack --profile --json` 输出的内容通过管道输出到 `stats.json` 文件中。

### 官方的可视化分析工具

Webpack 官方提供了一个可视化分析工具 [Webpack Analyse](http://webpack.github.io/analyse/)，它是一个在线 Web 应用。

打开 Webpack Analyse 链接的网页后，你就会看到一个弹窗提示你上传 JSON 文件，也就是需要上传上面讲到的 `stats.json` 文件，如图：

![图 4-15-1 Webpack Analyse 上传文件弹窗](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-analyse-dialog.png)

Webpack Analyse 不会把你选择的 `stats.json` 文件发达到服务器，而是在浏览器本地解析，你不用担心自己的代码为此而泄露。 选择文件后，你马上就能如下的效果图：

![图 4-15-1 Webpack Analyse 主页](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-analyse-home.png)

它分为了六大板块，分别是：

- **Modules**：展示所有的模块，每个模块对应一个文件。并且还包含所有模块之间的依赖关系图、模块路径、模块 ID、模块所属 Chunk、模块大小；
- **Chunks**：展示所有的代码块，一个代码块中包含多个模块。并且还包含代码块的 ID、名称、大小、每个代码块包含的模块数量，以及代码块之间的依赖关系图；
- **Assets**：展示所有输出的文件资源，包括 `.js`、`.css`、图片等。并且还包括文件名称、大小、该文件来自哪个代码块；
- **Warnings**：展示构建过程中出现的所有警告信息；
- **Errors**：展示构建过程中出现的所有错误信息；
- **Hints**：展示处理每个模块的过程中的耗时。

下面以在 [3-10 管理多个单页应用](https://webpack.wuhaolin.cn/3实战/3-10管理多个单页应用.html) 中使用的项目为例，来分析其 `stats.json` 文件。

点击 **Modules**，查看模块信息，效果图如下：

![图 4-15-1 Webpack Analyse Modules](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-analyse-modules.png)

> 由于依赖了大量第三方模块，文件数量大，导致模块之间的依赖关系图太密集而无法看清，但你可以进一步放大查看。

点击 **Chunks**，查看代码块信息，效果图如下：

![图 4-15-2 Webpack Analyse Chunks](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-analyse-chunks.png)

> 由代码块之间的依赖关系图可以看出两个页面级的代码块 `login` 和 `index` 依赖提取出来的公共代码块 `common`。

点击 **Assets**，查看输出的文件资源，效果图如下：

![图 4-15-3 Webpack Analyse Assets](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-analyse-assets.png)

点击 **Hints**，查看输出过程中的耗时分布，效果图如下：

![图 4-15-3 Webpack Analyse Hints](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-analyse-hints.png)

> 从 Hints 可以看出每个文件在处理过程的开始时间和结束时间，从而可以找出是哪个文件导致构建缓慢。

### webpack-bundle-analyzer

[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) 是另一个可视化分析工具， 它虽然没有官方那样有那么多功能，但比官方的要更加直观。

先来看下它的效果图：

![图 4-15-4 Webpack Analyse Assets](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-15webpack-bundle-analyzer.png)

它能方便的让你知道：

- 打包出的文件中都包含了什么；
- 每个文件的尺寸在总体中的占比，一眼看出哪些文件尺寸大；
- 模块之间的包含关系；
- 每个文件的 Gzip 后的大小。

接入 webpack-bundle-analyzer 的方法很简单，步骤如下：

1. 安装 webpack-bundle-analyzer 到全局，执行命令 `npm i -g webpack-bundle-analyzer`；
2. 按照上面提到的方法生成 `stats.json` 文件；
3. 在项目根目录中执行 `webpack-bundle-analyzer` 后，浏览器会打开对应网页看到以上效果。

## 使用自动刷新

在开发阶段，修改源码是不可避免的操作。 对于开发网页来说，要想看到修改后的效果，需要刷新浏览器让其重新运行最新的代码才行。 虽然这相比于开发原生 iOS 和 Android 应用来说要方便很多，因为那需要重新编译这个项目再运行，但我们可以把这个体验优化的更好。 借助自动化的手段，可以把这些重复的操作交给代码去帮我们完成，在监听到本地源码文件发生变化时，自动重新构建出可运行的代码后再控制浏览器刷新。

Webpack 把这些功能都内置了，并且还提供多种方案可选。

### 文件监听

文件监听是在发现源码文件发生变化时，自动重新构建出新的输出文件。

Webpack 官方提供了两大模块，一个是核心的 [webpack](https://www.npmjs.com/package/webpack)，一个是在[1-6 使用 DevServer](https://webpack.wuhaolin.cn/1入门/1-6使用DevServer.html) 中提到的 [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server) 扩展模块。 而文件监听功能是 webpack 模块提供的。

在[2-7 其它配置项](https://webpack.wuhaolin.cn/2配置/2-7其它配置项.html) 中曾介绍过 Webpack 支持文件监听相关的配置项如下：

```js
module.export = {
  // 只有在开启监听模式时，watchOptions 才有意义
  // 默认为 false，也就是不开启
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  }
}
```

要让 Webpack 开启监听模式，有两种方式：

- 在配置文件 `webpack.config.js` 中设置 `watch: true`。
- 在执行启动 Webpack 命令时，带上 `--watch` 参数，完整命令是 `webpack --watch`。

#### 文件监听工作原理

在 Webpack 中监听一个文件发生变化的原理是定时的去获取这个文件的最后编辑时间，每次都存下最新的最后编辑时间，如果发现当前获取的和最后一次保存的最后编辑时间不一致，就认为该文件发生了变化。 配置项中的 `watchOptions.poll` 就是用于控制定时检查的周期，具体含义是每隔多少毫秒检查一次。

当发现某个文件发生了变化时，并不会立刻告诉监听者，而是先缓存起来，收集一段时间的变化后，再一次性告诉监听者。 配置项中的 `watchOptions.aggregateTimeout` 就是用于配置这个等待时间。 这样做的目的是因为我们在编辑代码的过程中可能会高频的输入文字导致文件变化的事件高频的发生，如果每次都重新执行构建就会让构建卡死。

对于多个文件来说，原理相似，只不过会对列表中的每一个文件都定时的执行检查。 但是这个需要监听的文件列表是怎么确定的呢？ 默认情况下 Webpack 会从配置的 Entry 文件出发，递归解析出 Entry 文件所依赖的文件，把这些依赖的文件都加入到监听列表中去。 可见 Webpack 这一点还是做的很智能的，不是粗暴的直接监听项目目录下的所有文件。

由于保存文件的路径和最后编辑时间需要占用内存，定时检查周期检查需要占用 CPU 以及文件 I/O，所以最好减少需要监听的文件数量和降低检查频率。

#### 优化文件监听性能

在明白文件监听工作原理后，就好分析如何优化文件监听性能了。

开启监听模式时，默认情况下会监听配置的 Entry 文件和所有其递归依赖的文件。 在这些文件中会有很多存在于 `node_modules` 下，因为如今的 Web 项目会依赖大量的第三方模块。 在大多数情况下我们都不可能去编辑 `node_modules` 下的文件，而是编辑自己建立的源码文件。 所以一个很大的优化点就是忽略掉 `node_modules` 下的文件，不监听它们。相关配置如下：

```js
module.export = {
  watchOptions: {
    // 不监听的 node_modules 目录下的文件
    ignored: /node_modules/
  }
}
```

采用这种方法优化后，你的 Webpack 消耗的内存和 CPU 将会大大降低。

> 有时你可能会觉得 node_modules 目录下的第三方模块有 bug，想修改第三方模块的文件，然后在自己的项目中试试。 在这种情况下如果使用了以上优化方法，我们需要重启构建以看到最新效果。 但这种情况毕竟是非常少见的。

除了忽略掉部分文件的优化外，还有如下两种方法：

- `watchOptions.aggregateTimeout` 值越大性能越好，因为这能降低重新构建的频率。
- `watchOptions.poll` 值越大越好，因为这能降低检查的频率。

但两种优化方法的后果是会让你感觉到监听模式的反应和灵敏度降低了。

### 自动刷新浏览器

监听到文件更新后的下一步是去刷新浏览器，webpack 模块负责监听文件，webpack-dev-server 模块则负责刷新浏览器。 在使用 webpack-dev-server 模块去启动 webpack 模块时，webpack 模块的监听模式默认会被开启。 webpack 模块会在文件发生变化时告诉 webpack-dev-server 模块。

#### 自动刷新的原理

控制浏览器刷新有三种方法：

1. 借助浏览器扩展去通过浏览器提供的接口刷新，WebStorm IDE 的 LiveEdit 功能就是这样实现的。
2. 往要开发的网页中注入代理客户端代码，通过代理客户端去刷新整个页面。
3. 把要开发的网页装进一个 iframe 中，通过刷新 iframe 去看到最新效果。

DevServer 支持第 2、3 种方法，第 2 种是 DevServer 默认采用的刷新方法。

通过 DevServer 启动构建后，你会看到如下日志：

```shell
> webpack-dev-server

Project is running at http://localhost:8080/
webpack output is served from /
Hash: e4e2f9508ac286037e71
Version: webpack 3.5.5
Time: 1566ms
        Asset     Size  Chunks                    Chunk Names
    bundle.js  1.07 MB       0  [emitted]  [big]  main
bundle.js.map  1.27 MB       0  [emitted]         main
 [115] multi (webpack)-dev-server/client?http://localhost:8080 ./main.js 40 bytes {0} [built]
 [116] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [117] ./node_modules/url/url.js 23.3 kB {0} [built]
 [120] ./node_modules/querystring-es3/index.js 127 bytes {0} [built]
 [123] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [125] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
 [126] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [158] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
 [159] ./node_modules/ansi-html/index.js 4.26 kB {0} [built]
 [163] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
 [165] (webpack)/hot/emitter.js 77 bytes {0} [built]
 [167] ./main.js 2.28 kB {0} [built]
    + 255 hidden modules
```

细心的你会观察到输出的 `bundle.js` 中包含了以下七个模块：

```shell
 [116] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [117] ./node_modules/url/url.js 23.3 kB {0} [built]
 [120] ./node_modules/querystring-es3/index.js 127 bytes {0} [built]
 [123] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [125] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
 [126] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [158] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
```

这七个模块就是代理客户端的代码，它们被打包进了要开发的网页代码中。

在浏览器中打开网址 `http://localhost:8080/` 后， 在浏览器的开发者工具中你会发现由代理客户端向 DevServer 发起的 WebSocket 连接：

![图4.5.1 代理客户端发起 WebSocket 连接](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-5inline-client-websocket.png)

#### 优化自动刷新的性能

在[2-6 DevServer](https://webpack.wuhaolin.cn/2配置/2-6DevServer.html)中曾介绍过 `devServer.inline` 配置项，它就是用来控制是否往 Chunk 中注入代理客户端的，**默认会注入**。 事实上，在开启 inline 时，DevServer 会为每个输出的 Chunk 中注入代理客户端的代码，当你的项目需要输出的 Chunk 有很多个时，这会导致你的构建缓慢。 其实要完成自动刷新，一个页面只需要一个代理客户端就行了，DevServer 之所以粗暴的为每个 Chunk 都注入，是因为它不知道某个网页依赖哪几个 Chunk，索性就全部都注入一个代理客户端。 网页只要依赖了其中任何一个 Chunk，代理客户端就被注入到网页中去。

这里优化的思路是关闭还不够优雅的 inline 模式，只注入一个代理客户端。 为了关闭 inline 模式，在启动 DevServer 时，可通过执行命令 `webpack-dev-server --inline false`（也可以在配置文件中设置），这时输出的日志如下：

```
> webpack-dev-server --inline false

Project is running at http://localhost:8080/webpack-dev-server/
webpack output is served from /
Hash: 5a43fc44b5e85f4c2cf1
Version: webpack 3.5.5
Time: 1130ms
        Asset    Size  Chunks                    Chunk Names
    bundle.js  750 kB       0  [emitted]  [big]  main
bundle.js.map  897 kB       0  [emitted]         main
  [81] ./main.js 2.29 kB {0} [built]
    + 169 hidden modules
```

和前面的不同在于

- 入口网址变成了 `http://localhost:8080/webpack-dev-server/`
- `bundle.js` 中不再包含代理客户端的代码了

在浏览器中打开网址 `http://localhost:8080/webpack-dev-server/` 后，你会看到如下效果：

![图4.5.2 通过 iframe 自动刷新](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-5iframe-reload.png)

要开发的网页被放进了一个 iframe 中，编辑源码后，iframe 会被自动刷新。 同时你会发现构建时间从 1566ms 减少到了 1130ms，说明优化生效了。构建性能提升的效果在要输出的 Chunk 数量越多时会显得越突出。

> 在你关闭了 inline 后，DevServer 会自动地提示你通过新网址 `http://localhost:8080/webpack-dev-server/` 去访问，这点是做的很人性化的。

如果你不想通过 iframe 的方式去访问，但同时又想让网页保持自动刷新功能，你需要手动往网页中注入代理客户端脚本，往 `index.html` 中插入以下标签：

```html
<!--注入 DevServer 提供的代理客户端脚本，这个服务是 DevServer 内置的-->
<script src="http://localhost:8080/webpack-dev-server.js"></script>
```

给网页注入以上脚本后，独立打开的网页就能自动刷新了。但是要注意在发布到线上时记得删除掉这段用于开发环境的代码。

## 开启模块热替换

要做到实时预览，除了在[4-5 使用自动刷新](https://webpack.wuhaolin.cn/4优化/4-5使用自动刷新.html)中介绍的刷新整个网页外，DevServer 还支持一种叫做模块热替换(Hot Module Replacement)的技术可在不刷新整个网页的情况下做到超灵敏的实时预览。 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块。

模块热替换技术的优势有：

- 实时预览反应更快，等待时间更短。
- 不刷新浏览器能保留当前网页的运行状态，例如在使用 Redux 来管理数据的应用中搭配模块热替换能做到代码更新时 Redux 中的数据还保持不变。

总的来说模块热替换技术很大程度上的提高了开发效率和体验。

### 模块热替换的原理

模块热替换的原理和自动刷新原理类似，都需要往要开发的网页中注入一个代理客户端用于连接 DevServer 和网页， 不同在于模块热替换独特的模块替换机制。

DevServer 默认不会开启模块热替换模式，要开启该模式，只需在启动时带上参数 `--hot`，完整命令是 `webpack-dev-server --hot`。

> 除了通过在启动时带上 `--hot` 参数，还可以通过接入 Plugin 实现，相关代码如下：
>
> ```js
> const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
>
> module.exports = {
>   entry: {
>     // 为每个入口都注入代理客户端
>     main: [
>       'webpack-dev-server/client?http://localhost:8080/',
>       'webpack/hot/dev-server',
>       './src/main.js'
>     ]
>   },
>   plugins: [
>     // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
>     new HotModuleReplacementPlugin()
>   ],
>   devServer: {
>     // 告诉 DevServer 要开启模块热替换模式
>     hot: true
>   }
> }
> ```
>
> 在启动 Webpack 时带上参数 `--hot` 其实就是自动为你完成以上配置。

启动后日志如下：

```
> webpack-dev-server --hot

Project is running at http://localhost:8080/
webpack output is served from /
webpack: wait until bundle finished: /
webpack: wait until bundle finished: /bundle.js
Hash: fe62ac6b753c1d98961b
Version: webpack 3.5.5
Time: 3563ms
        Asset     Size  Chunks                    Chunk Names
    bundle.js  1.11 MB       0  [emitted]  [big]  main
bundle.js.map  1.33 MB       0  [emitted]         main
  [50] (webpack)/hot/log.js 1.04 kB {0} [built]
 [118] multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./main.js 52 bytes {0} [built]
 [119] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [120] ./node_modules/url/url.js 23.3 kB {0} [built]
 [126] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [128] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
 [129] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [161] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
 [166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
 [168] (webpack)/hot/dev-server.js 1.61 kB {0} [built]
 [169] (webpack)/hot/log-apply-result.js 1.31 kB {0} [built]
 [170] ./main.js 2.35 kB {0} [built]
    + 262 hidden modules
```

可以看出 `bundle.js` 代理客户端相关的代码包含九个文件：

```
 [119] (webpack)-dev-server/client?http://localhost:8080 5.83 kB {0} [built]
 [120] ./node_modules/url/url.js 23.3 kB {0} [built]
 [126] ./node_modules/strip-ansi/index.js 161 bytes {0} [built]
 [128] ./node_modules/loglevel/lib/loglevel.js 6.74 kB {0} [built]
 [129] (webpack)-dev-server/client/socket.js 856 bytes {0} [built]
 [161] (webpack)-dev-server/client/overlay.js 3.6 kB {0} [built]
 [166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
 [168] (webpack)/hot/dev-server.js 1.61 kB {0} [built]
 [169] (webpack)/hot/log-apply-result.js 1.31 kB {0} [built]
```

相比于自动刷新的代理客户端，多出了后三个用于模块热替换的文件，也就是说代理客户端更大了。

修改源码 `main.css` 文件后，新输出了如下日志：

```
webpack: Compiling...
Hash: 18f81c959118f6230623
Version: webpack 3.5.5
Time: 551ms
                                   Asset       Size  Chunks                    Chunk Names
                               bundle.js    1.11 MB       0  [emitted]  [big]  main
    0.ea11a51f97f2b52bca7d.hot-update.js  353 bytes       0  [emitted]         main
    ea11a51f97f2b52bca7d.hot-update.json   43 bytes          [emitted]
                           bundle.js.map    1.33 MB       0  [emitted]         main
0.ea11a51f97f2b52bca7d.hot-update.js.map  577 bytes       0  [emitted]         main
  [68] ./node_modules/css-loader!./main.css 217 bytes {0} [built]
 [166] (webpack)/hot nonrecursive ^\.\/log$ 170 bytes {0} [built]
    + 275 hidden modules
webpack: Compiled successfully.
```

DevServer 新生成了一个用于替换老模块的补丁文件 `0.ea11a51f97f2b52bca7d.hot-update.js`，同时在浏览器开发工具中也能看到请求这个补丁的抓包：

![图4.5.3 模块热替换模式下的补丁](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-6hot-patch.png)

可见补丁中包含了 `main.css` 文件新编译出来 CSS 代码，网页中的样式也立刻变成了源码中描述的那样。

但当你修改 `main.js` 文件时，会发现模块热替换没有生效，而是整个页面被刷新了，为什么修改 `main.js` 文件时会这样呢？

Webpack 为了让使用者在使用了模块热替换功能时能灵活地控制老模块被替换时的逻辑，可以在源码中定义一些代码去做相应的处理。

把的 `main.js` 文件改为如下：

```js
import React from 'react'
import { render } from 'react-dom'
import { AppComponent } from './AppComponent'
import './main.css'

render(<AppComponent />, window.document.getElementById('app'))

// 只有当开启了模块热替换时 module.hot 才存在
if (module.hot) {
  // accept 函数的第一个参数指出当前文件接受哪些子模块的替换，这里表示只接受 ./AppComponent 这个子模块
  // 第2个参数用于在新的子模块加载完毕后需要执行的逻辑
  module.hot.accept(['./AppComponent'], () => {
    // 新的 AppComponent 加载成功后重新执行下组建渲染逻辑
    render(<AppComponent />, window.document.getElementById('app'))
  })
}
```

其中的 `module.hot` 是当开启模块热替换后注入到全局的 API，用于控制模块热替换的逻辑。

现在修改 `AppComponent.js` 文件，把 `Hello,Webpack` 改成 `Hello,World`，你会发现模块热替换生效了。 但是当你编辑 `main.js` 时，你会发现整个网页被刷新了。为什么修改这两个文件会有不一样的表现呢？

当子模块发生更新时，更新事件会一层层往上传递，也就是从 `AppComponent.js` 文件传递到 `main.js` 文件， 直到有某层的文件接受了当前变化的模块，也就是 `main.js` 文件中定义的 `module.hot.accept(['./AppComponent'], callback)`， 这时就会调用 `callback` 函数去执行自定义逻辑。如果事件一直往上抛到最外层都没有文件接受它，就会直接刷新网页。

那为什么没有地方接受过 `.css` 文件，但是修改所有的 `.css` 文件都会触发模块热替换呢？

原因在于 `style-loader` 会注入用于接受 CSS 的代码。

> 请不要把模块热替换技术用于线上环境，它是专门为提升开发效率生的。

### 优化模块热替换

在发生模块热替换时，你会在浏览器的控制台中看到类似这样的日志：

![图4.5.4 模块热替换浏览器日志](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-6hmr-log.png)

其中的 `Updated modules: 68` 是指 ID 为 68 的模块被替换了，这对开发者来说很不友好，因为开发者不知道 ID 和模块之间的对应关系，最好是把替换了的模块的名称输出出来。 Webpack 内置的 NamedModulesPlugin 插件可以解决该问题，修改 Webpack 配置文件接入该插件：

```js
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin')

module.exports = {
  plugins: [
    // 显示出被替换模块的名称
    new NamedModulesPlugin()
  ]
}
```

重启构建后你会发现浏览器中的日志更加友好了：

![图4.5.4 现实出被替换模块的浏览器日志](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/4-6hmr-log-named.png)

除此之外，模块热替换还面临着和自动刷新一样的性能问题，因为它们都需要监听文件变化和注入客户端。 要优化模块热替换的构建性能，思路和在[4-5 使用自动刷新](https://webpack.wuhaolin.cn/4优化/4-5使用自动刷新.html)中提到的很类似：监听更少的文件，忽略掉 `node_modules` 目录下的文件。 但是其中提到的关闭默认的 inline 模式手动注入代理客户端的优化方法不能用于在使用模块热替换的情况下， 原因在于模块热替换的运行依赖在每个 Chunk 中都包含代理客户端的代码。

## 区分环境

### 为什么需要区分环境

在开发网页的时候，一般都会有多套运行环境，例如：

1. 在开发过程中方便开发调试的环境。
2. 发布到线上给用户使用的运行环境。

这两套不同的环境虽然都是由同一套源代码编译而来，但是代码内容却不一样，差异包括：

- 线上代码被通过 [4-8 压缩代码](https://webpack.wuhaolin.cn/4优化/4-8压缩代码.html) 中提到的方法压缩过。
- 开发用的代码包含一些用于提示开发者的提示日志，这些日志普通用户不可能去看它。
- 开发用的代码所连接的后端数据接口地址也可能和线上环境不同，因为要避免开发过程中造成对线上数据的影响。

为了尽可能的复用代码，在构建的过程中需要根据目标代码要运行的环境而输出不同的代码，我们需要一套机制在源码中去区分环境。 幸运的是 Webpack 已经为我们实现了这点。

### 如何区分环境

具体区分方法很简单，在源码中通过如下方式：

```js
if ((process.env.NODE_ENV = 'production')) {
  console.log('你正在线上环境')
} else {
  console.log('你正在使用开发环境')
}
```

其大概原理是借助于环境变量的值去判断执行哪个分支。

当你的代码中出现了使用 [process](https://nodejs.org/api/process.html) 模块的语句时，Webpack 就自动打包进 process 模块的代码以支持非 Node.js 的运行环境。 当你的代码中没有使用 process 时就不会打包进 process 模块的代码。这个注入的 process 模块作用是为了模拟 Node.js 中的 process，以支持上面使用的 `process.env.NODE_ENV = 'production'` 语句。

在构建线上环境代码时，需要给当前运行环境设置环境变量 `NODE_ENV = 'production'`，Webpack 相关配置如下：

```js
const DefinePlugin = require('webpack/lib/DefinePlugin')

module.exports = {
  plugins: [
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
}
```

> 注意在定义环境变量的值时用 `JSON.stringify` 包裹字符串的原因是环境变量的值需要是一个由双引号包裹的字符串，而 `JSON.stringify('production')`的值正好等于`'"production"'`。

执行构建后，你会在输出的文件中发现如下代码：

```js
if (true) {
  console.log('你正在使用线上环境')
} else {
  console.log('你正在使用开发环境')
}
```

定义的环境变量的值被代入到了源码中，`process.env.NODE_ENV = 'production'` 被直接替换成了 `true`。 并且由于此时访问 process 的语句被替换了而没有了，Webpack 也不会打包进 process 模块了。

DefinePlugin 定义的环境变量只对 Webpack 需要处理的代码有效，而不会影响 Node.js 运行时的环境变量的值。

通过 Shell 脚本的方式去定义的环境变量，例如 `NODE_ENV=production webpack`，Webpack 是不认识的，对 Webpack 需要处理的代码中的环境区分语句是没有作用的。

也就是说只需要通过 DefinePlugin 定义环境变量就能使上面介绍的环境区分语句正常工作，没必要又通过 Shell 脚本的方式去定义一遍。

如果你想让 Webpack 使用通过 Shell 脚本的方式去定义的环境变量，你可以使用 EnvironmentPlugin，代码如下：

```js
new webpack.EnvironmentPlugin(['NODE_ENV'])
```

以上这句代码实际上等价于：

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
})
```

### 结合 UglifyJS

其实以上输出的代码还可以进一步优化，因为 `if(true)` 语句永远只会执行前一个分支中的代码，也就是说最佳的输出其实应该直接是：

```js
console.log('你正在线上环境')
```

Webpack 没有实现去除死代码功能，但是 UglifyJS 可以做这个事情，如何使用请阅读 [4-8 压缩代码](https://webpack.wuhaolin.cn/4优化/4-8压缩代码.html) 中的压缩 JavaScript。

### 第三方库中的环境区分

除了在自己写的源码中可以有环境区分的代码外，很多第三方库也做了环境区分的优化。 以 React 为例，它做了两套环境区分，分别是：

1. 开发环境：包含类型检查、HTML 元素检查等等针对开发者的警告日志代码。
2. 线上环境：去掉了所有针对开发者的代码，只保留让 React 能正常运行的部分，以优化大小和性能。

例如 React 源码中有大量类似下面这样的代码：

```js
if (process.env.NODE_ENV ! 'production') {
  warning(false, '%s(...): Can only update a mounted or mounting component.... ')
}
```

如果你不定义 `NODE_ENV=production` 那么这些警告日志就会被包含到输出的代码中，输出的文件将会非常大。

`process.env.NODE_ENV ! 'production'` 中的 `NODE_ENV` 和 `'production'` 两个值是社区的约定，通常使用这条判断语句在区分开发环境和线上环境。

## 优化总结

本章从开发体验和输出质量两个角度讲解了如何优化项目中的 Webpack 配置，这些优化的方法都是来自项目实战中的经验积累。 虽然每一小节都是一个个独立的优化方法，但是有些优化方法并不冲突可以相互组合，以达到最佳的效果。

以下将给出是结合了本章所有优化方法的实例项目，由于构建速度和输出质量不能兼得，按照开发环境和线上环境为该项目配置了两份文件，分别如下：

#### 侧重优化开发体验的配置文件 `webpack.config.js`：

```js
const path = require('path')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const { AutoWebPlugin } = require('web-webpack-plugin')
const HappyPack = require('happypack')

// 自动寻找 pages 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin('./src/pages', {
  // HTML 模版文件所在的文件路径
  template: './template.html',
  // 提取出所有页面公共的代码
  commonsChunk: {
    // 提取出公共代码 Chunk 的名称
    name: 'common'
  }
})

module.exports = {
  // AutoWebPlugin 会找为寻找到的所有单页应用，生成对应的入口配置，
  // autoWebPlugin.entry 方法可以获取到生成入口配置
  entry: autoWebPlugin.entry({
    // 这里可以加入你额外需要的 Chunk 入口
    base: './src/base.js'
  }),
  output: {
    filename: '[name].js'
  },
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')],
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件，使用 Tree Shaking 优化
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['jsnext:main', 'main']
  },
  module: {
    rules: [
      {
        // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // 使用 HappyPack 加速构建
        use: ['happypack/loader?id=babel'],
        // 只对项目根目录下的 src 目录中的文件采用 babel-loader
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.js$/,
        use: ['happypack/loader?id=ui-component'],
        include: path.resolve(__dirname, 'src')
      },
      {
        // 增加对 CSS 文件的支持
        test: /\.css$/,
        use: ['happypack/loader?id=css']
      }
    ]
  },
  plugins: [
    autoWebPlugin,
    // 使用 HappyPack 加速构建
    new HappyPack({
      id: 'babel',
      // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
      loaders: ['babel-loader?cacheDirectory']
    }),
    new HappyPack({
      // UI 组件加载拆分
      id: 'ui-component',
      loaders: [
        {
          loader: 'ui-component-loader',
          options: {
            lib: 'antd',
            style: 'style/index.css',
            camel2: '-'
          }
        }
      ]
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      loaders: ['style-loader', 'css-loader']
    }),
    // 4-11提取公共代码
    new CommonsChunkPlugin({
      // 从 common 和 base 两个现成的 Chunk 中提取公共的部分
      chunks: ['common', 'base'],
      // 把公共的部分放到 base 中
      name: 'base'
    })
  ],
  watchOptions: {
    // 4-5使用自动刷新：不监听的 node_modules 目录下的文件
    ignored: /node_modules/
  }
}
```

#### 侧重优化输出质量的配置文件 `webpack-dist.config.js`：

```js
const path = require('path')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { AutoWebPlugin } = require('web-webpack-plugin')
const HappyPack = require('happypack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

// 自动寻找 pages 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin('./src/pages', {
  // HTML 模版文件所在的文件路径
  template: './template.html',
  // 提取出所有页面公共的代码
  commonsChunk: {
    // 提取出公共代码 Chunk 的名称
    name: 'common'
  },
  // 指定存放 CSS 文件的 CDN 目录 URL
  stylePublicPath: '//css.cdn.com/id/'
})

module.exports = {
  // AutoWebPlugin 会找为寻找到的所有单页应用，生成对应的入口配置，
  // autoWebPlugin.entry 方法可以获取到生成入口配置
  entry: autoWebPlugin.entry({
    // 这里可以加入你额外需要的 Chunk 入口
    base: './src/base.js'
  }),
  output: {
    // 给输出的文件名称加上 Hash 值
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, './dist'),
    // 指定存放 JavaScript 文件的 CDN 目录 URL
    publicPath: '//js.cdn.com/id/'
  },
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // 其中 __dirname 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')],
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ['jsnext:main', 'main']
  },
  module: {
    rules: [
      {
        // 如果项目源码中只有 js 文件就不要写成 /\.jsx?$/，提升正则表达式性能
        test: /\.js$/,
        // 使用 HappyPack 加速构建
        use: ['happypack/loader?id=babel'],
        // 只对项目根目录下的 src 目录中的文件采用 babel-loader
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.js$/,
        use: ['happypack/loader?id=ui-component'],
        include: path.resolve(__dirname, 'src')
      },
      {
        // 增加对 CSS 文件的支持
        test: /\.css$/,
        // 提取出 Chunk 中的 CSS 代码到单独的文件中
        use: ExtractTextPlugin.extract({
          use: ['happypack/loader?id=css'],
          // 指定存放 CSS 中导入的资源（例如图片）的 CDN 目录 URL
          publicPath: '//img.cdn.com/id/'
        })
      }
    ]
  },
  plugins: [
    autoWebPlugin,
    // 4-14开启ScopeHoisting
    new ModuleConcatenationPlugin(),
    // 4-3使用HappyPack
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // babel-loader 支持缓存转换出的结果，通过 cacheDirectory 选项开启
      loaders: ['babel-loader?cacheDirectory']
    }),
    new HappyPack({
      // UI 组件加载拆分
      id: 'ui-component',
      loaders: [
        {
          loader: 'ui-component-loader',
          options: {
            lib: 'antd',
            style: 'style/index.css',
            camel2: '-'
          }
        }
      ]
    }),
    new HappyPack({
      id: 'css',
      // 如何处理 .css 文件，用法和 Loader 配置中一样
      // 通过 minimize 选项压缩 CSS 代码
      loaders: ['css-loader?minimize']
    }),
    new ExtractTextPlugin({
      // 给输出的 CSS 文件名称加上 Hash 值
      filename: `[name]_[contenthash:8].css`
    }),
    // 4-11提取公共代码
    new CommonsChunkPlugin({
      // 从 common 和 base 两个现成的 Chunk 中提取公共的部分
      chunks: ['common', 'base'],
      // 把公共的部分放到 base 中
      name: 'base'
    }),
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production 去除 react 代码中的开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      }
    })
  ]
}
```

本章介绍的优化方法虽然难以涵盖 Webpack 的方方面面，但足以解决实战中常见的场景。 对于本书没有介绍到的场景，你需要根据自己的需求按照以下思路去优化：

1. 找出问题的原因；
2. 找出解决问题的方法；
3. 寻找解决问题方法对应的 Webpack 集成方案。

同时你还需要跟紧社区的迭代，学习他人的优化方法，了解最新的 Webpack 特性和新涌现出的插件、Loader。

## 插件总结

| 配置 | 减少打包时间 | 减少打包体积 | 减少首屏加载时间 | 加快请求 |
| --- | --- | --- | --- | --- |
| 优化文件搜索范围 | √ |  |  |  |
| HappyPack | √ |  |  |  |
| DLLPlugin | √ |  |  |  |
| ParallelUglifyPlugin | √ | √ |  |  |
| Scope Hoisting |  | √ |  |  |
| Tree Shaking |  | √ |  |  |
| Prepack |  | √ | √ |  |
| 按需加载 |  |  | √ | √ |
| 压缩代码(JS,CSS) |  | √ | √ | √ |
| CDN 加速 |  |  | √ | √ |
| 提取公共代码 |  | √ |  | √ |

关于 browserslist

- 推荐用法：package.json 文件中的 browserslist 字段(查询细节：逗号`,`相当于`or`,也就是并集，想交集的话写成`and`)

  ```json
  //package.json
  "browserslist": [
      "defaults",
      "not IE 11",
      "maintained node versions"
  ]
  ```

- .browserslistrc 文件

  ```js
  //.browserslistrc
  # Browsers that we support

  defaults
  not IE 11
  maintained node versions
  ```

- autoprefixer 插件(一个自动补充 CSS 浏览器前缀的插件，隶属 postcss 工具包）的 overrideBrowserslist 字段

  ```js
  //postcss.config.js
  module.export = {
    plugin: [
      require('autoprefixer')({
        overrideBrowserslist: ['last 2 version', '>1%']
      })
    ]
  }
  ```

## 参考

> [webpack 深入浅出](https://webpack.wuhaolin.cn/)
