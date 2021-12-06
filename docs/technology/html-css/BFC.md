---
title: BFC 
---

# 了解一下BFC？
[[toc]]

## 常见定位方案

讲 BFC 之前，我们先来了解一下常见的定位方案，定位方案是控制元素的布局，有三种常见方案:

### 普通流 (normal flow)

在普通流中，元素按照其在 HTML 中的先后位置**自上而下**布局

在这个过程中，**行内元素**水平排列，直到当行被占满然后换行，**块级元素**则会被渲染为完整的一个新行

除非另外指定，否则所有元素**默认都是普通流定位**，可以说，普通流中元素的位置**由该元素在 HTML 文档中的位置**决定

### 浮动 (float)

在浮动布局中，元素首先按照普通流的位置出现，然后**根据浮动的方向尽可能的向左边或右边偏移**，其效果与印刷排版中的文本环绕相似。

### 绝对定位 (absolute positioning)

在绝对定位布局中，元素会整体**脱离普通流**，因此绝对定位元素不会对其兄弟元素造成影响，而元素具体的位置由绝对定位的坐标决定。

## FC、BFC 概念

- Formatting context(**格式化上下文**) 是 W3C CSS2.1 规范中的一个概念。
  - FC是页面中的一块**渲染区域**，并且有一套**渲染规则**，**FC决定了其子元素将如何定位，以及和其他元素的关系和相互作用**。

- BFC 即 Block Formatting Contexts (**块级格式化上下文**)，它属于上述定位方案的**普通流**。
  - 具有 BFC 特性的元素可以看作是隔离了的**独立容器**，容器里面的元素**不会在布局上影响到外面的元素**，并且 BFC 具有普通容器所没有的一些**特性**。
  - 通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

## BFC 触发条件

只要元素满足下面任一条件即可触发 BFC 特性：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

## BFC 特性及应用

### 自动计算浮动元素

特性：如果一个元素是BFC，则元素内部会自动计算浮动元素

应用：默认普通元素不会计算浮动元素的高度，可以将该普通元素变为BFC，达到清除浮动的作用

```html
<style>
    .parent {
        border: 1px solid #000;
        overflow: hidden;// parent变为BFC
    }

    .child {
        width: 200px;
        height: 200px;
        float: left;
    }

    .child1 {
        background-color: red;
    }

    .child2 {
        background-color: greenyellow;
    }
</style>


<div class="parent">
    <div class="child child1">child1</div>
    <div class="child child2">child2</div>
</div>
```

效果图如下：

<img src="https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210901182429846.png" alt="image-20210901182429846" style="zoom:50%;" />

### 解决外边距合并问题

特性：如果两个元素都是BFC元素，则这两元素的外边距不会合并

应用：两个普通元素同时设置margin时会合并，如果将普通元素变为BFC，则可以实现不合并的效果

```html
<style>
    .parent {
        overflow: hidden;
    }

    .child {
        width: 200px;
        height: 200px;
        margin: 100px;
    }

    .child1 {
        background-color: red;
    }

    .child2 {
        background-color: greenyellow;
    }
</style>

<div class="child child1"></div>
<div class="parent">
    <div class="child child2"></div>
</div>
```

效果图如下：

<img src="https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210901182802108.png" alt="image-20210901182802108" style="zoom:50%;" />

### 浮动排列问题

特性：BFC元素之间排列是按**普通流**来排列的

应用：正常来说，普通流中**后面的元素**排列的时候会**看不到(忽略)**浮动元素，排列的时候会重叠，如果将**后面的元素**变成BFC，则可以正常排列

注意：重叠排列时，下方元素的**字体**不会上面的浮动元素覆盖

如图：

```html
<style>
    .child {
        width: 200px;
        height: 200px;
    }

    .child1 {
        float: left;// 红色方块实际也是BFC
        background-color: red;
    }

    .child2 {
        overflow: hidden;// 绿黄方块变为BFC
        background-color: greenyellow;
    }
</style>

<div class="child child1"></div>
<div class="child child2"></div>
```

效果图如下：

<img src="https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210901183517205.png" alt="image-20210901183517205" style="zoom:50%;" />



## 参考

> [10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

