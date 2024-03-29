---
title: DNS解析原理
---

# 了解一下 DNS 和 CDN

[[toc]]

## 什么是 DNS？

DNS( Domain Name System)是“域名系统”的英文缩写，是一种组织成域层次结构的计算机和网络服务命名系统，它用于 TCP/IP 网络，它所提供的服务是用来将<u>主机名和域名转换为 IP 地址</u>的工作。DNS 就是这样的一位“翻译官”，它的基本工作原理可用下图来表示

![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/e5143bc08d4ec9d7f210522c7e540f4d_hd.jpg)

<u>**DNS 是一种由分层的 DNS 服务器实现的分布式数据库，DNS 运行在 UDP 上，使用 53 端口**</u>

## DNS 的获取过程

- 用户主机上运行着 DNS 的客户端，就是我们的 PC 机或者手机客户端运行着<u>DNS 客户端</u>
- 浏览器将接收到的 url 中<u>抽取出域名字段</u>，就是访问的主机名，比如`http://www.baidu.com/`
- DNS 客户机端向 DNS 服务器端<u>发送一份查询报文</u>，报文中包含着要访问的<u>主机名字段</u>（中间<u>包括一些列缓存查询以及分布式 DNS 集群的工作</u>）
- 该 DNS 客户机最终会<u>收到一份回答报文</u>，其中包含有该主机名对应的<u>IP 地址</u>
- 一旦该浏览器收到来自 DNS 的 IP 地址，就可以向该 IP 地址定位的 HTTP 服务器<u>发起 TCP 连接</u>

## DNS 的解析过程

![image-20211112142137604](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/image-20211112142137604.png)

- DNS 查询是<u>**操作系统**</u>自己做的
- 浏览器输入`www.qq.com`域名，操作系统会先检查自己本地的<u>**hosts**文件</u>是否有这个网址映射关系，如果有，就先调用这个 IP 地址映射，完成域名解析
- 如果 hosts 里没有这个域名的映射，则查找<u>**本地 DNS 解析器缓存**</u>，是否有这个网址映射关系，如果有，直接返回，完成域名解析
- 如果 hosts 文件与本地 DNS 解析器缓存都没有相应的网址映射关系，首先会找<u>TCP/IP 参数中设置的首选 DNS 服务器</u>，在此我们叫它<u>**本地 DNS 服务器**</u>，此服务器收到查询时，如果要查询的域名包含在本地配置区域资源中，则返回解析结果给客户机，完成域名解析，此解析具有<u>**权威性**</u>
- 如果要查询的域名，不由本地 DNS 服务器区域解析，但该服务器已缓存了此网址映射关系，则调用这个 IP 地址映射，完成域名解析，此解析<u>**不具有权威性**</u>

- 如果本地 DNS 服务器本地区域文件与缓存解析都失效，则根据**本地 DNS 服务器**的设置（<u>是否设置转发器</u>）进行查询，如果**未用转发模式**（<u>迭代查询</u>），本地 DNS 就把请求发至**13 台根 DNS 服务器**，根 DNS 服务器收到请求后会判断这个域名（`.com`）是谁来授权管理，并会<u>返回</u>一个负责该<u>顶级域名服务器</u>的一个 IP，本地 DNS 服务器收到 IP 信息后，将会联系负责`.com`域的这台服务器。这台负责`.com`域的服务器收到请求后，如果自己无法解析，它就会找一个管理`.com`域的<u>下一级 DNS 服务器地址</u>（`http://qq.com`）给本地 DNS 服务器。当本地 DNS 服务器收到这个地址后，就会找`http://qq.com`域服务器，<u>重复上面的动作</u>，进行查询，直至找到`www.qq.com`主机
- 如果用的是**转发模式**（<u>递归查询</u>），此 DNS 服务器就会把请求转发至<u>上一级 DNS 服务器</u>，由上一级服务器进行解析，上一级服务器如果不能解析，<u>或找根 DNS 服务器</u>，<u>或把请求转至上上级</u>，以此循环，不管是本地 DNS 服务器用的是转发，还是根提示，最后都是<u>把结果返回给本地 DNS 服务器</u>，由此 DNS 服务器再返回给客户机
- 从<u>客户端</u>到<u>本地 DNS 服务器</u>是属于递归查询，而<u>DNS 服务器之间</u>的交互查询就是<u>迭代查询(未用转发模式)</u>或者<u>递归查询(转发模式)</u>
- 区别：

  - 递归查询是由客户端去做请求

  - 迭代查询是由系统配置的 DNS 服务器做请求，得到结果后将数据返回给客户端

    ![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/7fcd81756bdc8b52ade0531402c43e43_hd.jpg)

## URL 的解析顺序

- 浏览器 DNS 缓存

  当用户通过浏览器访问某域名时，浏览器首先会在<u>自己的缓存中</u>查找是否有该域名对应的 IP 地址（若曾经访问过该域名且没有清空缓存便存在）；

  补充：如何清除浏览器的 DNS 缓存

  清除谷歌的 DNS 缓存 chrome://net-internals/#dns

  有时候不生效？？(https://www.cnblogs.com/davidkam/p/3500332.html)

- 系统缓存

  当浏览器缓存中无域名对应 IP 则会自动检查用户计算机系统<u>Hosts 文件</u>DNS 缓存是否有该域名对应 IP；

- 路由器缓存

  当浏览器及系统缓存中均无域名对应 IP 则进入<u>路由器缓存</u>中检查，以上三步均为客户端的 DNS 缓存；

- ISP（互联网服务提供商）DNS 缓存

  当在用户客服端查找不到域名对应 IP 地址，则将进入<u>ISP DNS 缓存</u>中进行查询。比如你用的是电信的网络，则会进入电信的 DNS 缓存服务器中进行查找；

- 根域名服务器

  当以上均未完成，则进入根服务器进行查询。全球仅有 13 台根域名服务器，1 个主根域名服务器，其余 12 为辅根域名服务器。根域名收到请求后会<u>查看区域文件记录</u>，若无则将其管辖范围内顶级域名（如.com）服务器 IP 告诉本地 DNS 服务器；

- 顶级域名服务器

  顶级域名服务器收到请求后<u>查看区域文件记录</u>，若无则将其管辖范围内主域名服务器的 IP 地址告诉本地 DNS 服务器；

- 主域名服务器

  主域名服务器接受到请求后<u>查询自己的缓存</u>，如果没有则进入下一级域名服务器进行查找，并重复该步骤直至找到正确记录；

- 保存结果至缓存

  本地域名服务器把返回的结果保存到缓存，以备下一次使用，同时将该结果<u>反馈给客户端</u>，客户端通过这个 IP 地址与 web 服务器建立链接。

## 配置 CDN 后的 DNS 解析

- 当用户点击网站页面上的内容 URL，先经过本地 DNS 系统解析，如果本地 DNS 服务器没有相应域名的缓存，则本地 DNS 系统会将域名的解析权交给 CNAME 指向的 CDN 专用 DNS 服务器。
- CDN 的 DNS 服务器将 CDN 的全局负载均衡设备 IP 地址返回给用户。
- 用户向 CDN 的全局负载均衡设备发起 URL 访问请求。
- CDN 全局负载均衡设备根据**用户 IP 地址**，以及**用户请求的 URL**，选择一台用户所属区域的区域负载均衡设备，并将请求转发到此区域负载均衡设备上。
- 基于以下这些条件的综合分析之后，区域负载均衡设备会选择一个最优的缓存服务器节点，并从缓存服务器节点处得到缓存服务器的 IP 地址，最终将得到的 IP 地址返回给全局负载均衡设备：
  - 根据用户 IP 地址，判断哪一个边缘节点**距用户最近**；
  - 根据用户所请求的 URL 中携带的内容名称，判断哪一个边缘节点上有用户**所需内容**；
  - 查询各个边缘节点当前的负载情况，判断哪一个边缘节点尚有**服务能力**。
- 全局负载均衡设备把服务器的 IP 地址返回给用户。
- 用户向缓存服务器发起请求，缓存服务器响应用户请求，将用户所需内容传送到用户终端。如果这台缓存服务器上并没有用户想要的内容，而区域均衡设备依然将它分配给了用户，那么这台服务器就要向它的上一级缓存服务器请求内容，直至追溯到网站的源服务器将内容拉到本地。

![img](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/16c5f7c73af1a83f~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

## CDN 组成和相关技术

CDN 网络主要由中心节点和边缘节点构成

- 中心节点：包括 CDN 网管中心和全局负载均衡 DNS 重定向解析系统，负责整个 CDN 网络的分发和管理
- 边缘节点：主要指异地分发节点，由负载均衡设备、高速缓存服务器两部分组成
  - 负载均衡设备负责每个节点中各个 Cache 的负载均衡，保证节点的工作效率；同时还负责收集节点与周围环境的信息，保持与全局负载均衡 DNS 的通信，实现整个系统的负载均衡。
  - 高速缓存服务器（Cache）负责存储客户网站的大量信息，就像一个靠近用户的网站服务器一样响应本地用户的访问请求。通过全局负载均衡 DNS 的控制，用户的请求被透明地指向离他最近的节点，节点中 Cache 服务器就像网站的原始服务器一样，响应终端用户的请求。因其距离用户更近，故其响应时间才更快。

CDN 四大技术有内容发布、内容存储、内容路由以及内容管理

- 内容发布：它借助于建立索引、缓存、流分裂、组播（Multicast）等技术，将内容发布或投递到距离用户最近的远程服务点（POP）处。
- 内容存储：对于 CDN 系统而言，需要考虑两个方面的内容存储问题。一个是内容源的存储，一个是内容在 Cache 节点中的存储。
- 内容路由：它是整体性的网络负载均衡技术，通过内容路由器中的重定向（DNS）机制，在多个远程 POP 上均衡用户的请求，以使用户请求得到最近内容源的响应
- 内容管理：它通过内部和外部监控系统，获取网络部件的状况信息，测量内容发布的端到端性能（如包丢失、延时、平均带宽、启动时间、帧速率等），保证网络处于最佳的运行状态。

## 边缘计算(ER)

EdgeRoutine(ER) 是阿里云 CDN 团队开发的边缘 Serverless 计算环境，支持在 CDN 边缘执行客户编写/编译的 JavaScript 或者 WebAssembly 代码（未来会推出）。客户无需关心实际机器、部署 region、调度和伸缩性。一经上传，全球部署，全球执行！

### 技术原理

CDN 是一个多级缓存的架构，CDN 加速静态资源时，将源站上的资源缓存到距离客户端最近的 CDN 节点上。当您访问该静态资源时，直接从缓存中获取，避免通过较长的链路回源，提高访问效率。且阿里云 CDN 支持多级缓存架构（默认为两级），可以有效提高资源命中率，大大减少回源请求数量。

EdgeRoutine(ER) 是依托阿里云 CDN 这套多级缓存架构，处在边缘节点这样一个位置，和边缘网关、边缘缓存都处在同一层，它是一个**独立的组件**，提供了一个独立的`JS runtime`。

当边缘环境、边缘网关**收到客户请求**之后，它可以**智能识别**，如果客户配置了边缘代码，边缘网关会将这个请求直接透明**代理**到 EdgeRoutine(ER)。EdgeRoutine(ER)完全接管这个请求去**执行客户部署的边缘代码**，实际上是客户用边缘代码去直接接管了请求的生命周期。

在请求的生命周期里面，支持去执行一些轻量级的计算，同时依然可以使用 CDN 相关的业务功能，在函数中利用 cdnproxy:true 这样的参数去将请求代理给边缘网关，然后再走 CDN 多级缓存架构，同样可以利用到 CDN 高命中率的这个特点。

EdgeRoutine(ER)其实也是支持 Serverless 或者再重新发起一个 fetch 请求，这个 fetch 请求和主请求无关，完全是在代码里由客户生成的子请求，子请求可以直接访问其它任意互联网域名，也可以继续使用 cdnproxy 代理到阿里云 CDN。如果中小站长，仅仅是简单的静态页面的话，完全可以直接托管在边缘，不再需要购买额外云服务，既可以享受 Serverless 的便利，也可以享受 CDN 的边缘内容分发优势。

### 适用场景

**第一个场景是针对 CDN 本身提供的一些功能**：包括拦截请求、限流限速、内容生成、多源合并、异步鉴权等等，这些完全是可以通过 EdgeRoutine(ER) 自主编程实现，代码基本上可以随时随地的去进行更改测试、灰度发布、上线，EdgeRoutine(ER)将 CDN 相关功能可编程化，无论大型企业还是中小企业，都可以自由定制组合，无需提工单提需求，作为开发者帮助业务快速实现落地；

**第二个场景针对前端网页这一块**，支持 web API、网页加速、HTML 解析、ESI、边缘渲染、边缘 SSR 等，然后当然也可以实现一个简单的边缘 API 网关去实现业务中转。前端是 EdgeRoutine(ER)一个非常创新的场景，前端同学往往非常关注网页如何优化渲染和提高终端客户体验，前端技术也是近些年变革最快创新不断的领域，CDN 的静态内容分发技术针对 css、js、图片、视频等各类静态资源的加速也正是基于前端体验不断的追求而持续迭代的。EdgeRoutine(ER)为前端优化在端和云之间开辟了一个新的方向-“边”（边缘），云边端协同，为浏览器/APP 客户端减压，在边缘上实现部分前端业务和轻量计算，可以是“微前端”概念的一个探索方向；

**第三个场景**，当在写代码或者发版的时候，可以通过一个 AB 测试的这样的功能灰度发布灰度上线，增加稳定性的同时也可以逐步的去观察自己新功能的受众率和期望转化率，实现逐步优化或及时调头。比如：通过代码中使用 Geo 地域信息，CDN 完全支持在国家/省市/区县等更细粒度如浙江区域或者广东区域去灰度不同的功能；

**第四个场景，IoT**的设备网关在进行数据生成之后，期望把这些数据分析后记录到中心，可能需要一些简单的边缘合并、分析，再把汇总好的数据，回传回中心，边缘可以在端的基础上再加一层收集分析汇总，将海量数据的流式/离线计算压力分散到边缘节点，保障低时延的同时可以有效减轻端和源站压力。

除此之外还有网站托管、小程序等

![屏幕快照 2020-04-27 下午10.51.59.png](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/1298749a8e75407b98f1b6671b69070b.png)

## Chrome 如何获取 DNS 服务器(linux 系统)

- Chrome 是调[res_ninit](http://man7.org/linux/man-pages/man3/resolver.3.html)这个系统函数(Linux)去获取系统的 DNS 服务器，这个函数是通过读取`/etc/resolver.conf`这个文件获取 DNS

- Chrome 在启动的时候根据不同的操作系统去获取 DNS 服务器配置，然后将它放到 DNSConfig 里面的 nameservers(Chrome 还会监听网络变化同步改变配置)，然后用这个 nameservers 列表初始化一个 socket pool(套接字池)

- 套接字是用来发请求的，在需要做域名解析的时候会从套接字池里面取出一个 socket，并传递想要用的 server_index，初始化的时候是 0，即取第一个 DNS 服务 IP 地址，一旦解析请求两次都失败了，则 server_index + 1 使用下一个 DNS 服务

- Chrome 在启动的时候除了会读取 DNS server 之外，还会去取读取和解析 hosts 文件，放到 DNSConfig 的 hosts 属性里面，它是一个哈希 map(hosts 文件在 linux 系统上是在/etc/hosts)

- 这样 DNSConfig 里面就有两个配置了，一个是 hosts，另一个是 nameservers，DNSConfig 是组合到 DNSSession，它们的组合关系如下图所示

  ![image-20211112142146194](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/image-20211112142146194.png)

- resolver 是负责解析的驱动类，它组合了一个 client，client 创建一个 session，session 层有一个很大的作用是用来管理 server_index 和 socket pool 如分配 socket 等，session 初始化 config，config 用来读取本地绑的 hosts 和 nameservers 两个配置

- resolver 有一个重要的功能，它组合了一个 job，用来创建任务队列。resolver 还组合了一个 Hostcache，它是放解析结果的缓存，如果缓存命中的话，就不用去解析了

- 这个过程是这样的，外部调 rosolver 提供的 HostResolverImpl::Resolve 接口，这个接口会先判断在本地是否能处理，即先调 serveFromCache 去 cache 里面看有没有

  - 如果 cache 命中的话则返回

  - 否则看 hosts 是否命中

    - 如果返回值不等于 CACHE_MISS，则直接返回。

    - 如果都不命中则返回 CACHE_MISS 的标志位，接着创建一个 job，并看是否能立刻执行，如果 job 队列太多了，则添加到 job 队列后面，并传递一个成功的回调处理函数

- 所以这里和我们的认知基本上是一样的，先看下 cache 有没有，然后再看 hosts 有没有，如果没有的话再进行查询。在 cache 查询的时候如果这个 cache 已经过时了即 staled，也会返回 null

- 如果域名在本地不能解析的话，Chrome 就会去发请求了。操作系统提供了一个叫 getaddrinfo 的系统函数用来做域名解析，但是 Chrome 并没有使用，而是自己实现了一个 DNS 客户端，包括封装 DNS request 报文以及解析 DNS response 报文。这样可能是因为灵活度会更大一点，例如 Chrome 可以自行决定怎么用 nameservers，顺序以及失败尝试的次数等

- 在 resolver 的 startJob 里面启动解析。取到下一个 queryId，然后构建一个 query，再构建一个 DnsUDPAttempt(因为 DNS 客户端查询使用的是 UDP 报文，辅域名服务器向主域名服务器查询是用的 TCP)，再执行它的 start，然后开始解析，最后解析成功之后，会把结果放到 cache 里面，然后生成一个 addressList，传递给相应的 callback，因为 DNS 解析可能会返回多个结果

## DNS 安全问题

### DNS 欺骗

DNS 欺骗即**<u>域名信息欺骗</u>**，是最常见的 DNS 安全问题。

当一个 DNS 服务器掉入陷阱，使用了来自一个恶意 DNS 服务器的错误信息，那么该 DNS 服务器就被欺骗了。

DNS 欺骗会使那些易受攻击的 DNS 服务器产生许多安全问题，例如：将用户引导到错误的互联网站点，或者发送一个电子邮件到一个未经授权的邮件服务器。

网络攻击者通常通过**三种方法**进行 DNS 欺骗。

1. **缓存感染**：黑客会熟练的使用 DNS 请求，<u>将数据放入一个没有设防的 DNS 服务器的缓存</u>当中。这些缓存信息会在客户进行 DNS 访问时返回给客户，从而<u>将客户引导到</u>入侵者所设置的<u>运行木马的 Web 服务器或邮件服务器上</u>，然后黑客从这些服务器上获取用户信息。

2. **DNS 信息劫持**：入侵者通过<u>监听客户端和 DNS 服务器的对话</u>，通过<u>猜测</u>服务器响应给客户端的<u>DNS 查询 ID</u>。每个 DNS 报文包括一个相关联的 16 位 ID 号，DNS 服务器根据这个 ID 号获取请求源位置。黑客在 DNS 服务器之前<u>将虚假的响应交给用户</u>，从而欺骗客户端去访问恶意的网站。

3. **（DNS 劫持）DNS 重定向**：攻击者能够将 DNS 名称查询**<u>重定向到恶意 DNS 服务器</u>**。这样攻击者可以获得**<u>DNS 服务器的写权限</u>**

   DNS 劫持的四种基本类型:

   - **本地 DNS 劫持**：攻击者在用户计算机上**<u>安装木马</u>**恶意软件，并**<u>更改本地 DNS 设置</u>**以将用户重定向到恶意站点。

   - **路由器 DNS 劫持**：许多路由器都有默认密码或固件漏洞，攻击者可以<u>**接管路由器并覆盖 DNS 设置**</u>，从而影响连接到该路由器的所有用户。

   - **中间 DNS 攻击**：攻击者**<u>拦截用户和 DNS 服务器之间的通信</u>**，并提供指向恶意站点的不同目标 IP 地址。

   - **流氓 DNS 服务器**：攻击者<u>**攻击 DNS 服务器**</u>，并**<u>更改 DNS 记录</u>**以将 DNS 请求重定向到恶意站点。

### 拒绝服务攻击

黑客主要利用一些 DNS 软件的漏洞，如在 BIND(Berkeley Internet Name Domain，BIND 是最常用的 DNS 服务软件) 9 版本（版本 9.2.0 以前的 9 系列）如果有人向运行 BIND 的设备<u>发送特定的 DNS 数据包请求，BIND 就会自动关闭</u>。攻击者只能使 BIND 关闭，而无法在服务器上执行任意命令。如果<u>得不到 DNS 服务</u>，那么就会产生一场灾难：由于网址不能解析为 IP 地址，用户将<u>无法访问互联网</u>。这样，DNS 产生的问题就好像是互联网本身所产生的问题，这将导致大量的混乱。

### 分布式拒绝服务攻击（Distribute Denial of Service）　

DDOS 攻击通过使用攻击者控制的几十台或几百台计算机攻击一台主机，使得服务拒绝攻击更难以防范，更难以通过阻塞单一攻击源主机的数据流，来防范服务拒绝攻击。

### 缓冲区漏洞溢出攻击

黑客利用<u>DNS 服务器软件存在漏洞</u>，比如对特定的输入没有进行严格检查，那么有可能被攻击者利用，攻击者构造特殊的<u>畸形数据包</u>来对 DNS 服务器进行<u>缓冲区溢出攻击</u>。如果这一攻击成功，就会造成<u>DNS 服务停止</u>，或者攻击者能够在 DNS 服务器上<u>执行其设定的任意代码</u>。

## DNS 其他应用

- 智能 DNS，根据用户 IP 来就近访问服务器
- DNS 轮询，水平扩展反向代理层
- 利用 DNS 实施负载均衡

## 参考

> [从 Chrome 源码看 DNS 解析过程](https://juejin.cn/post/6844903543673978893)
>
> [一文入门 DNS](https://juejin.cn/post/6854573215843352583#heading-5)
>
> [DNS 原理及其解析过程](https://www.cnblogs.com/gopark/p/8430916.html)
>
> [为什么域名根服务器只能有 13 台呢？](https://www.zhihu.com/question/22587247/answer/66417484)
>
> [DNS 解析](https://imweb.io/topic/55e3ba46771670e207a16bc8)
>
> [除了解析域名，DNS 还能干吗](https://blog.csdn.net/shenjian58/article/details/107273629/)
>
> [CDN 与 DNS 知识汇总](http://hpoenixf.com/DNS%E4%B8%8ECDN%E7%9F%A5%E8%AF%86%E6%B1%87%E6%80%BB.html#comments)
