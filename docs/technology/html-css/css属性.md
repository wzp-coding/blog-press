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

![image-20210902190306600](https://gitee.com/wu_monkey/blog-images/raw/master/images/image-20210902190306600.png)

