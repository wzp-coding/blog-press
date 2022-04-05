---
title: 某些CSS属性
---
# 你可能需要注意的CSS属性

[[toc]]

## margin

### 基本知识

`margin` 属性接受 1~4 个值。每个值可以是[`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)，[`<percentage>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage)，[`<auto>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin#auto)。取值为负时元素会比原来更接近临近元素。

- 当只指定**一个**值时，该值会统一应用到**全部四个边**的外边距上。
- 指定**两个**值时，第一个值会应用于**上边和下边**的外边距，第二个值应用于**左边和右边**。
- 指定**三个**值时，第一个值应用于**上边**，第二个值应用于**右边和左边**，第三个则应用于**下边**的外边距。
- 指定**四个**值时，依次（顺时针方向）作为**上边**，**右边**，**下边**，和**左边**的外边距。

注意：指定三个值的时候分别表示上-左右-下，可能很多人(我是其中一个)常用到一，二，四个值，从而忽略了传三个值的用法

### 冷知识

`margin-left:100px;`和`margin-right:-100px;`有啥区别？

`margin-left:100px;`它会将**左边的元素**(或边界)推开，如果**左边的元素**还有**向左移动的空间**，它也会一起移动，最终两个元素距离为`100px`

`margin-right:-100px;`它会将**自己**往右移动`100px`，**无视边界和其它元素**，

个人理解：正值相当于两个元素之间相互推开，力的作用是相互的，如果另一方是元素，且该元素另一边有可移动的空间，则这两个元素会**同时移动`50px`**，如果是边界，边界不会移动，则自己移动`100px`；负值相当于两个元素之间相互拥抱，同样，如果另一方是元素，也会**同时移动一半距离**，如果是边界，则自己移动所有距离

例如：下面代码的表现形式

```html
<style>
    body{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    .right{
        height: 200px;
        width: 200px;
        background-color: aquamarine;
    }
    .left{
        height: 200px;
        width: 200px;
        margin-right: 0px;
        background-color: bisque;
    }
</style>
<body>
    <div class="left">left</div>
    <div class="right">right</div>
</body>
```





![margin](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/margin.gif)

> 注意：padding没有负值！！！

## box-sizing

### 基本知识

`box-sizing` 属性，值可取`border-box`,`content-box`

`content-box`

默认值，标准盒子模型。 [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 与 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 只包括内容的宽和高， 不包括边框（border），内边距（padding），外边距（margin）。注意: 内边距、边框和外边距都在这个盒子的外部。 比如说，`.box {width: 350px; border: 10px solid black;}` 在浏览器中的渲染的实际宽度将是 370px。

尺寸计算公式：

`width` = 内容的宽度

`height` = 内容的高度

宽度和高度的计算值都不包含内容的边框（border）和内边距（padding）。

`border-box`

 [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 属性包括内容，内边距和边框，但不包括外边距。这是当文档处于 Quirks模式 时Internet Explorer使用的[盒模型](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)。注意，填充和边框将在盒子内 , 例如, `.box {width: 350px; border: 10px solid black;}` 导致在浏览器中呈现的宽度为350px的盒子。内容框不能为负，并且被分配到0，使得不可能使用border-box使元素消失。

尺寸计算公式：

*`width` = border + padding + 内容的宽度*

*`height` = border + padding + 内容的高度*

```html
<style>
    .parent{
        margin: 100px;
        width: 200px;
        height: 200px;
        border: 1px solid #000;
    }
    .child{
        height: 100px;
        width: 100px;
        box-sizing: border-box;
        padding-left: 30px;
        padding-right: 30px;
        border: 10px solid;
        background-color: aqua;
    }
</style>

<body>
    <div class="parent">
        <div class="child"></div>
    </div>
</body>
```

效果如图：

![image-20210902190306600](https://blog-images-1302031947.cos.ap-guangzhou.myqcloud.com/images/image-20210902190306600.png)

## CSS度量单位

度量单位分**相对长度单位**、**绝对长度单位**、**百分比单位**

- 相对单位：px，em，rem，ch，ex
- 绝对单位：cm，mm，pt，in，pc，Q
  - in > cm > pc > mm > pt > Q
- 百分比单位：%，vmin，vmax，vh，vw，

- px：像素（Pixel）
  - 像素是相对于**显示器屏幕分辨率**而言的。
  - 例如，windows的用户所使用的分辨率一般是96像素/英寸。而Mac的用户所使用的分辨率一般是72像素/英寸。
- em：相对于父元素的`font-size`
- rem：相对于根元素（html）的`font-size`
- %：宽高随着浏览器的大小相应变化
  - 子元素的`height`或`width`中使用百分比, 是相对于子元素的直接父元素, `width`相对于父元素的`width`, `height`相对于父元素的`height`
  - 子元素的`top`和`bottom`如果设置百分比, 则相对于直接非`static`定位的父元素的高度, 同样子元素的`left`和`right`如果设置百分比, 则相对于直接非`static`定位父元素的宽度
  - 子元素的`padding`如果设置百分比, 不论是垂直方向或者是水平方向, 都相对于直接父亲元素的`width`, 而与父元素的`height`无关
  - 子元素的`margin`如果设置成百分比, 不论是垂直方向还是水平方向, 都相对于直接父元素的`width`
  - 设置`border-radius`为百分比, 则是相对于自身的宽度, 还有`translate`, `background-size`等都是相对于自身的
- vw：相对于视窗的宽度, `1vw`等于视窗宽度的`1%`
- vh：相对于视窗的高度, `1vh`等于视窗高度的`1%`
- vmin：`vw`和`vh`中的较小值
- vmax：`vw`和`vh`中的较大值
  - 例如，视窗高度900px，视窗宽度600px，`1vmin = 600px * 1% = 6px`，`1vmax = 900px * 1% = 9px`
- ex：`ex`是指所用字体中小写`x`的高度, 但不同字体`x`的高度可能不同, 对于很多字体来说`1ex = 0.5em`, 所以很多浏览器在实际应用中取`em`值一半作为`ex`值, `ex`单位在实际中常用于微调
- ch：`ch`与`ex`类似, 这一单位代表元素所用字体中`0`这一字形的宽度, 更准确地说是`0`这一字形的预测尺寸, 如果无法确定`0`字形的大小, 则必须假定其宽为`0.5em`高为`1em`, 也就是取`em`值的一半作为`ch` 值
- cm：厘米（centimeters）， `1cm = 10mm = 96px/2.54 = 37.8px`
- mm：毫米（millimeters），`1mm = 0.1cm = 3.78px`
- Q：四分之一毫米（quarter-millimeters），`1Q = 1/40cm = 0.945px`
- pt：点（points），`1pt = 1/72in = 0.0139in = 1/722.54cm = 1/7296px = 1.33px`
- in：英寸（inches），`1in = 2.54cm = 96px`
- pc：派卡（picas）， `1pc = 1/6in = 12pt = 1/6 * 96px = 16px`

> https://drafts.csswg.org/css-values-3/#em





