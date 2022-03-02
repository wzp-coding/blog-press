---
title: Docker初探
---

# 了解一下docker？

[[toc]]

## docker安装

> [windows docker 安装](https://www.runoob.com/docker/windows-docker-install.html)

Docker 并非是一个通用的容器工具，它依赖于已存在并运行的 Linux 内核环境。

Docker 实质上是在已经运行的 Linux 下制造了一个隔离的文件环境，因此它执行的效率几乎等同于所部署的 Linux 主机。

因此，Docker 必须部署在 Linux 内核的系统上。如果其他系统想部署 Docker 就必须安装一个虚拟 Linux 环境。

<img src="https://gitee.com/wu_monkey/blog-images/raw/master/images/CV09QJMI2fb7L2k0.png" alt="img" style="zoom:50%;" />

在 Windows 上部署 Docker 的方法都是先安装一个虚拟机，并在安装 Linux 系统的的虚拟机中运行 Docker。

### Windows Docker Desktop

Docker Desktop 是 Docker 在 Windows 10 和 macOS 操作系统上的官方安装方式，这个方法依然属于先在虚拟机中安装 Linux 然后再安装 Docker 的方法。

Docker Desktop 官方下载地址： https://hub.docker.com/editions/community/docker-ce-desktop-windows

> 如果启动中遇到因 WSL 2 导致地错误，请安装 [WSL 2](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10)。

使用Windows Docker Desktop需要==开启Hyper-V==

### Hyper-V

Hyper-V 是微软开发的虚拟机，类似于 VMWare 或 VirtualBox，仅适用于 Windows 10。这是 Docker Desktop for Windows 所使用的虚拟机。但是，==这个虚拟机一旦启用，QEMU、VirtualBox 或 VMWare Workstation 15 及以下版本将无法使用==！如果你必须在电脑上使用其他虚拟机（例如开发 Android 应用必须使用的模拟器），请不要使用 Hyper-V！

#### 如何开启Hyper-V(默认就是开启状态)

使用==管理员==打开cmd，输入命令bcdedit，查看hypervisorlaunchtype的状态

```bash
bcdedit
```

#### 如何关闭Hyper-V(需要使用VirtualBox的话)

```bash
bcdedit /set hypervisorlaunchtype off
```

执行后==重启电脑==即可

### 测试

安装docker之后，可以打开 PowerShell 并运行以下命令检测是否运行成功：

```bash
docker --version
```

### 设置镜像加速

打开docker desktop,找到设置，在==registry-mirrors选项==输入==https://docker.mirrors.ustc.edu.cn/==之后点击 Apply 保存后 Docker 就会重启并应用配置的镜像地址了。

![image-20210725212548242](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210725212548242.png)

## Docker 安装 Nginx

> [Docker 安装 Nginx](https://www.runoob.com/docker/docker-install-nginx.html)

```bash
# 拉取官方的最新镜像
docker pull nginx:latest
# 查看本地镜像
docker images
```

安装完成后，我们可以使用以下命令来运行 nginx 容器：

```bash
docker run --name nginx-test -p 8080:80 -d nginx
```

参数说明：

- **--name nginx-test**：容器名称。
- **-p 8080:80**： 端口进行映射，将==本地 8080 端口==映射到==容器内部的 80 端口==。
- **-d nginx**： 设置容器在在后台一直运行。

最后我们可以通过浏览器可以直接访问 8080 端口的 nginx 服务：

## cmder

> [使用cmder替换cmd](https://www.jianshu.com/p/5b7c985240a7)

推荐一个特别好用的命令行窗口工具

安装地址：https://cmder.net/

### 配置

配置环境变量：在系统属性里面配置环境变量，==将`Cmder.exe`所在文件路径添加至`Path`里==

配置右键快捷启动：以管理员身份打开cmd

```js
// 设置任意地方鼠标右键启动Cmder
Cmder.exe /REGISTER ALL
```

设置语言

<img src="https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210725220426354.png" alt="image-20210725220426354" style="zoom:67%;" />

## VScode使用docker

> [Docker最全教程之使用 Visual Studio Code玩转Docker](https://www.cnblogs.com/codelove/p/10606434.html)
>
> [VSCode 支持Docker](https://geek-docs.com/vscode/vscode-tutorials/vscode-support-docker.html)

安装docker插件、dockerCompose插件

