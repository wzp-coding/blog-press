---
title: 项目难点
---

# vue项目难点

[[toc]]

## gojs制作血缘图

在做项目的时候，遇到了一个需求，需要做类似下面原型图的效果

拿到图之后，经各方查找，最终决定用[gojs](https://gojs.net.cn/learn/index.html)来做

注意：学习gojs是有成本的，需要一定时间，我根据官方文档写了一篇简单的[gojs入门教程](/technology/extension/gojs入门.md )


![image-20211010221722952](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211010221722952.png)



## 获取异步挂载的DOM元素

做项目遇到一个布局，如下图，它放置在页面的左侧边栏作为筛选框，这里我们只关注具体实现

需求是这样的：

1. 每一行有很多`radio`也就是单选框，在一行放置不下的时候，显示`更多`这个按钮，否则不显示
2. 点击`更多`按钮展示所有的`radio`，并显示`收缩`按钮，按钮的位置始终在右侧
3. 每个`radio`从左到右顺序排列，长度不唯一，可长可短

![image-20211010223724510](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20211010223724510.png)

很容易想到，做一个通用组件，传入`label`和`options`，因为`options`是异步请求回来的数据，所以一开始`options`是为空的，当`options`为空数组的时候不显示该组件，通过`v-if`去控制显示整个组件，这样子该组件就变成一个异步组件了，如果你尝试在组件内部`mounted`生命周期函数中，通过`ref`或者其他获取`dom`元素的方式去获取是无法获取到的，因为**组件渲染挂载是异步的，而`mounted`等生命周期钩子执行是同步的**,所以问题就变成**如何获取异步挂载组件的dom元素**

先说为什么要解决上面这个问题，因为我们需要获取存放`radio`元素外面的DOM容器，然后每次加一个`radio`进去，判断是否超出存放所有`radio`元素+`更多`按钮的宽度，如果超出，则不再添加，这个操作我们是递归去实现的，执行递归的时机就是异步组件挂载后的时机，也只执行一次

解决方法：

1. 通过`watch`监听`options`的变化，当`options`从空数组变为非空数组的时候，这个时候`v-if`条件判断为`true`开始渲染子组件，这时候只需要通过`nextick`即可获取`dom`元素

   举例：在子组件中监听`options`的变化

   ```js
   watch: {
       options(val) {
           if (val.length != 0) {
               this.$nextTick(function () {console.log(this.$refs)});
           }
       }
   },
   ```

2. 通过自定义指令的生命周期函数`mounted`，它在绑定元素的父组件被挂载后调用

   举例：在子组件中自定义局部指令

   ```js
   directives: {
       realMounted: {
           <!-- vue2.x写法 -->
           inserted(el, binding, vnode, prevVnode) {
               binding.value()
           },

           <!-- vue3.x写法 -->
           mounted(el, binding, vnode, prevVnode) {
               binding.value()
           },
       }
   },
   ```

   在`v-if`的元素(或者内部任意元素)添加指令，绑定一个函数即可

   ```vue
   <div v-if="options.length!=0" v-realMounted="realMounted">
       <div v-for="i in options" :key="i">{{i}}</div>
       <div ref="child1"></div>
       <div ref="child2"></div>
   </div>
   ```

   这样绑定**指令**的元素真正挂载的时候就会调用绑定的`realMounted`函数

3. vue2.x通过hook:mounted,vue3.x通过vnode-mounted事件监听VNode挂载时机

- vue2.x写法
   ```vue
   <div v-if="options.length!=0" @hook:mounted="realMounted">
       <div v-for="i in options" :key="i">{{i}}</div>
       <div ref="child1"></div>
       <div ref="child2"></div>
   </div>
   ```
- vue3.x写法
   ```vue
   <div v-if="options.length!=0" @vnode-mounted="realMounted">
       <div v-for="i in options" :key="i">{{i}}</div>
       <div ref="child1"></div>
       <div ref="child2"></div>
   </div>
   ```

   这样绑定**事件**的元素真正挂载的时候就会调用绑定的`realMounted`函数

## 参考

[gojs中文文档](https://gojs.net.cn/api/index.html)

