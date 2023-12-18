(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{489:function(e,r,t){"use strict";t.r(r);var a=t(15),o=Object(a.a)({},(function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h2",{attrs:{id:"eslint"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#eslint"}},[e._v("#")]),e._v(" ESLint")]),e._v(" "),t("p",[e._v("1.审查代码是否符合编码规范和统一的代码风格；")]),e._v(" "),t("p",[e._v("2.审查代码是否存在语法错误；")]),e._v(" "),t("h3",{attrs:{id:"基本实现原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#基本实现原理"}},[e._v("#")]),e._v(" 基本实现原理")]),e._v(" "),t("p",[e._v("ESLint 核心实现类是 Linter,主要分为以下步骤处理")]),e._v(" "),t("ul",[t("li",[t("p",[e._v("预处理钩子 preprocess，把非 js 文本处理成 js 文本，使得 Eslint 可以处理非 JS 文件的 lint")])]),e._v(" "),t("li",[t("p",[e._v("确认解析器，默认是 Eslint 自带的 espree，也可以通过配置来切换成别的 parser，比如 @eslint/babel-parser、@typescript/eslint-parser 等")])]),e._v(" "),t("li",[t("p",[e._v("将源码解析成 AST，eslint 内部是通过 SourceCode 来封装 AST 的，后面看到 SourceCode 就是指 AST")])]),e._v(" "),t("li",[t("p",[e._v("parse 之后，会调用 runRules 方法对 AST 进行检查，返回结果就是 problems，包含错误和修复信息")]),e._v(" "),t("blockquote",[t("p",[e._v("runRules 会遍历 AST，先根据 rule 规则去注册检查事件，在遍历的过程中再去触发事件")])])]),e._v(" "),t("li",[t("p",[e._v("通过注释指令来过滤掉一些不需要显示的 problems")]),e._v(" "),t("blockquote",[t("p",[e._v("因为 eslint 支持通过注释来配置，比如 "),t("code",[e._v("/* eslint-disable */")]),e._v(" "),t("code",[e._v("/*eslint-enable*/")]),e._v(" 这种。")])])]),e._v(" "),t("li",[t("p",[e._v("后处理钩子 postprocess,可以对 problems 做最终处理")])])]),e._v(" "),t("p",[e._v("fix 修复代码实际就是通过简单的字符串替换，替换的具体内容和位置在 problems 中有记录")]),e._v(" "),t("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/19cfb0d671a94b005987aa4c266d6004.png",alt:"19cfb0d671a94b005987aa4c266d6004.png"}}),e._v(" "),t("h2",{attrs:{id:"docker-与-k8s"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker-与-k8s"}},[e._v("#")]),e._v(" docker 与 K8s")]),e._v(" "),t("p",[e._v("Docker 本身并不是容器，它是创建容器的工具，是应用容器引擎。")]),e._v(" "),t("p",[e._v("Docker 技术的三大核心概念，分别是：镜像（Image）容器（Container）仓库（Repository）")]),e._v(" "),t("p",[e._v("镜像（Image）是一个特殊的文件系统。它除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（例如环境变量）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。")]),e._v(" "),t("p",[e._v("容器（Container）是应用程序运行的地方，容器之间完全使用"),t("a",{attrs:{href:"https://baike.baidu.com/item/%E6%B2%99%E7%AE%B1/393318",target:"_blank",rel:"noopener noreferrer"}},[e._v("沙箱"),t("OutboundLink")],1),e._v("机制，相互之间不会有任何接口")]),e._v(" "),t("blockquote",[t("p",[e._v("Sandboxie(又叫沙箱、沙盘)即是一个虚拟系统程序，允许你在沙盘环境中运行浏览器或其他程序，因此运行所产生的变化可以随后删除。它创造了一个类似沙盒的独立作业环境，在其内部运行的程序并不能对硬盘产生永久性的影响。 在网络安全中，沙箱指在隔离环境中，用以测试不受信任的文件或应用程序等行为的工具。")])]),e._v(" "),t("p",[e._v("仓库（Repository）是集中存放镜像的地方。它负责对 Docker 镜像进行管理，，最常使用的 Registry 公开服务，是官方的 Docker Hub，这也是默认的 Registry，并拥有大量的高质量的官方镜像。")]),e._v(" "),t("p",[e._v("K8S，就是基于容器的集群管理平台，它的全称，是 kubernetes。它主要用于 容器编排 启动容器、自动化部署、扩展和管理容器应用和回收容器。")]),e._v(" "),t("p",[e._v("k8s 的目标是让部署容器化的应用简单并且高效，k8s 提供了应用部署、规划、更新、维护的一种机制！")]),e._v(" "),t("h3",{attrs:{id:"dockerfile"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#dockerfile"}},[e._v("#")]),e._v(" dockerfile")]),e._v(" "),t("p",[e._v("用户通过客户端将命令写入 Dockfile 文件，通过 dockerfile 文件 build（创建）镜像（imagine）")]),e._v(" "),t("h3",{attrs:{id:"docker-整体架构运行的原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker-整体架构运行的原理"}},[e._v("#")]),e._v(" docker 整体架构运行的原理")]),e._v(" "),t("p",[e._v("通过客户端输入命令与后台的 daemon（守护进程）交互，进行各种操作，如 build imagine，commit imagine，push 等")]),e._v(" "),t("h3",{attrs:{id:"docker-与虚拟机的区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#docker-与虚拟机的区别"}},[e._v("#")]),e._v(" Docker 与虚拟机的区别")]),e._v(" "),t("p",[e._v("虚拟机通过 hypervisor 层直接模拟了硬件的各种资源环境，包括内存，cpu，io 等资源，然后上面再装操作系统，这些操作系统有自己的内核，而 docker 直接依赖于本机的操作系统，通过本机的操作系统提供的一些系统调用对进程资源，io 资源，文件资源进行了包装，使得看上去在一个容器里面只有自己创建的文件和进程，看不到容器外面的文件和其他资源。")]),e._v(" "),t("h3",{attrs:{id:"namespace-隔离系统资源"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#namespace-隔离系统资源"}},[e._v("#")]),e._v(" Namespace（隔离系统资源）")]),e._v(" "),t("p",[e._v("当 Docker 创建一个容器时，它会创建新的六种 namespace 的实例（包括网络资源，进程间通信(IPC)等），然后把容器中的所有进程放到这些 namespace 之中，使得 Docker 容器中的进程只能看到隔离的系统资源。")]),e._v(" "),t("h3",{attrs:{id:"cgroup-作用"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#cgroup-作用"}},[e._v("#")]),e._v(" Cgroup 作用")]),e._v(" "),t("ul",[t("li",[t("strong",[e._v("资源限制")]),e._v("：限制任务使用的资源总额")]),e._v(" "),t("li",[t("strong",[e._v("优先级分配")]),e._v("：通过 CPU 时间片与磁盘 IO 大小，控制任务执行优先级")]),e._v(" "),t("li",[t("strong",[e._v("资源统计")]),e._v(": 统计资源使用量")]),e._v(" "),t("li",[t("strong",[e._v("任务控制")]),e._v("：对任务执行挂起、恢复等操作")])]),e._v(" "),t("h3",{attrs:{id:"daemon-功能"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#daemon-功能"}},[e._v("#")]),e._v(" Daemon 功能")]),e._v(" "),t("p",[e._v("Docker Daemon 是 Docker 架构中一个常驻在后台的系统进程。所谓的“运行 Docker”，即代表运行 Docker Daemon。总之，DockerDaemon 的作用主要有以下两方面：")]),e._v(" "),t("ol",[t("li",[t("strong",[e._v("接收并处理 Docker Client 发送的请求。")])]),e._v(" "),t("li",[t("strong",[e._v("管理所有的 Docker 容器。")])])]),e._v(" "),t("p",[t("strong",[e._v("Daemon 接受时具体过程：")])]),e._v(" "),t("p",[e._v("Docker Daemon 运行时，会在后台启动一个 Server，Server 负责接收 Docker Client 发送的请求；接收请求后，Server 通过路由与分发调度，找到相应的 Handler 来处理请求。")]),e._v(" "),t("p",[e._v("启动 Docker Daemon 所使用的可执行文件同样是 docker，与 Docker Client 启动所使用的可执行文件 docker 相同。既然 Docker Client 与 Docker Daemon 都可以通过 docker 二进制文件创建，那么如何辨别两者就变得非常重要。实际上，执行 docker 命令时，通过传入的参数可以辨别 Docker Daemon 与 Docker Client，如 docker –d 代表 Docker Daemon 的启动，docker ps 则代表创建 Docker Client，并发送 ps 请求。")]),e._v(" "),t("h2",{attrs:{id:"扫一扫登录流程的原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#扫一扫登录流程的原理"}},[e._v("#")]),e._v(" 扫一扫登录流程的原理")]),e._v(" "),t("p",[e._v("扫一扫登录的原理基于 OAuth2.0 协议的授权登录方式。在这种方式下，应用程序不需要获取用户的用户名和密码，只需要获取用户的授权即可。")]),e._v(" "),t("p",[e._v("扫一扫登录的流程主要分为以下几个步骤：")]),e._v(" "),t("ul",[t("li",[e._v("用户发起二维码登录：此时网站会先生成一个二维码，同时把这个二维码对应的标识保存起来，以便跟踪二维码的扫码状态，然后将二维码页面返回到浏览器中。")]),e._v(" "),t("li",[e._v("浏览器先展示这个二维码，再按照 Javascript 脚本的指示发起扫码状态的轮询。所谓轮询就是浏览器每隔几秒调用网站的 API 查询二维码的扫码登录结果，查询时携带二维码的标识。")]),e._v(" "),t("li",[e._v("用户扫码确认登录：用户打开手机 App，使用 App 自带的扫码功能，扫描浏览器中展现的二维码，然后 App 提取出二维码中的登录信息，显示登录确认的页面。这个页面可以是 App 的 Native 页面，也可以是远程 H5 页面，这里采用 Native 页面。用户点击确认或者同意按钮后，App 将二维码信息和当前用户的 Token 一起提交到网站 API。")]),e._v(" "),t("li",[e._v("网站 API 确认用户 Token 有效后，更新在步骤 1 中创建的二维码标识的状态为“确认登录”，同时绑定当前用户。")])]),e._v(" "),t("p",[e._v("通过以上步骤，扫一扫登录可以实现用户的快速登录，并保证了用户的安全性和隐私性。")])])}),[],!1,null,null,null);r.default=o.exports}}]);