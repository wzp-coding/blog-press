---
title: vuepress踩坑
---

[[toc]]

## md 文件命名

我用 vuepress 建立该博客网站，在测试建立侧边栏的时候，一直遇到解析错误的 bug，结果发现是 md 文件命名问题

使用 vuepress 命名 md 文件时，**千万别命名为 index！**

## 图片命名

这个是我用到的一些图片，格式各种各样，如何正确都渲染出来呢？

![image-20210919012015024](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/image-20210919012015024.png)

引用图片的时候，我们可以直接`../.vuepress/public/images/`去引用图片，这样`npm run dev`和`npm run build`的时候都可以正常运行

但是上面这样引用的话，如果我们是在 typora 上编辑文章的话，是看不到图片的，怎么办呢，改成相对路径？

这样是可以的，但是有几个前提：

1. 图片命名不能为中文名
2. 图片命名必须是正常的`.png/.jpg/.jpeg`等正常后缀的图片
3. 图片命名不能有太多的特殊符号，比如`-、~、!、@、#、$`等等

否则的话统统都会编译失败

## 部署 github.io

如果你的博客是部署到 github page 的话，有时候 GitHub 会访问不上（提示 timeout 等），这个挺烦的，你可以开个 VPN，或者多 push 几次，直到成功

## 部署 gitee.io

假设你想部署到 gitee page 上，你可能会发现部署失败，因为有敏感字眼，这点 gitee 做的挺恶心的，也没说什么属于敏感字眼，如果想查出自己博客哪些是敏感字眼，只能逐行去检查，算了吧，还是不要部署到 gitee.io 上了
