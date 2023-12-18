---
title: 某些CSS属性
---

# 你可能需要注意的 CSS 属性

[[toc]]

## margin

`margin` 属性接受 1~4 个值。每个值可以是[`<length>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)，[`<percentage>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/percentage)，[`<auto>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin#auto)。取值为负时元素会比原来更接近临近元素。

- 当只指定**一个**值时，该值会统一应用到**全部四个边**的外边距上。
- 指定**两个**值时，第一个值会应用于**上边和下边**的外边距，第二个值应用于**左边和右边**。
- 指定**三个**值时，第一个值应用于**上边**，第二个值应用于**右边和左边**，第三个则应用于**下边**的外边距。
- 指定**四个**值时，依次（顺时针方向）作为**上边**，**右边**，**下边**，和**左边**的外边距。

注意：指定三个值的时候分别表示上-左右-下，可能很多人(我是其中一个)常用到一，二，四个值，从而忽略了传三个值的用法

`margin-left:100px;`和`margin-right:-100px;`有啥区别？

`margin-left:100px;`它会将**左边的元素**(或边界)推开，如果**左边的元素**还有**向左移动的空间**，它也会一起移动，最终两个元素距离为`100px`

`margin-right:-100px;`它会将**自己**往右移动`100px`，**无视边界和其它元素**，

个人理解：正值相当于两个元素之间相互推开，力的作用是相互的，如果另一方是元素，且该元素另一边有可移动的空间，则这两个元素会**同时移动`50px`**，如果是边界，边界不会移动，则自己移动`100px`；负值相当于两个元素之间相互拥抱，同样，如果另一方是元素，也会**同时移动一半距离**，如果是边界，则自己移动所有距离

例如：下面代码的表现形式

```html
<style>
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  .right {
    height: 200px;
    width: 200px;
    background-color: aquamarine;
  }
  .left {
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

> 注意：padding 没有负值！！！

## box-sizing

`box-sizing` 属性，值可取`border-box`,`content-box`

`content-box`

默认值，标准盒子模型。 [`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 与 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 只包括内容的宽和高， 不包括边框（border），内边距（padding），外边距（margin）。注意: 内边距、边框和外边距都在这个盒子的外部。 比如说，`.box {width: 350px; border: 10px solid black;}` 在浏览器中的渲染的实际宽度将是 370px。

尺寸计算公式：

`width` = 内容的宽度

`height` = 内容的高度

宽度和高度的计算值都不包含内容的边框（border）和内边距（padding）。

`border-box`

[`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 和 [`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height) 属性包括内容，内边距和边框，但不包括外边距。这是当文档处于 Quirks 模式 时 Internet Explorer 使用的[盒模型](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)。注意，填充和边框将在盒子内 , 例如, `.box {width: 350px; border: 10px solid black;}` 导致在浏览器中呈现的宽度为 350px 的盒子。内容框不能为负，并且被分配到 0，使得不可能使用 border-box 使元素消失。

尺寸计算公式：

_`width` = border + padding + 内容的宽度_

_`height` = border + padding + 内容的高度_

```html
<style>
  .parent {
    margin: 100px;
    width: 200px;
    height: 200px;
    border: 1px solid #000;
  }
  .child {
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

## CSS 度量单位

度量单位分**相对长度单位**、**绝对长度单位**、**百分比单位**

- 相对单位：px，em，rem，ch，ex
- 绝对单位：cm，mm，pt，in，pc，Q
  - in > cm > pc > mm > pt > Q
- 百分比单位：%，vmin，vmax，vh，vw，

- px：像素（Pixel）
  - 像素是相对于**显示器屏幕分辨率**而言的。
  - 例如，windows 的用户所使用的分辨率一般是 96 像素/英寸。而 Mac 的用户所使用的分辨率一般是 72 像素/英寸。
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
  - 例如，视窗高度 900px，视窗宽度 600px，`1vmin = 600px * 1% = 6px`，`1vmax = 900px * 1% = 9px`
- ex：`ex`是指所用字体中小写`x`的高度, 但不同字体`x`的高度可能不同, 对于很多字体来说`1ex = 0.5em`, 所以很多浏览器在实际应用中取`em`值一半作为`ex`值, `ex`单位在实际中常用于微调
- ch：`ch`与`ex`类似, 这一单位代表元素所用字体中`0`这一字形的宽度, 更准确地说是`0`这一字形的预测尺寸, 如果无法确定`0`字形的大小, 则必须假定其宽为`0.5em`高为`1em`, 也就是取`em`值的一半作为`ch` 值
- cm：厘米（centimeters）， `1cm = 10mm = 96px/2.54 = 37.8px`
- mm：毫米（millimeters），`1mm = 0.1cm = 3.78px`
- Q：四分之一毫米（quarter-millimeters），`1Q = 1/40cm = 0.945px`
- pt：点（points），`1pt = 1/72in = 0.0139in = 1/722.54cm = 1/7296px = 1.33px`
- in：英寸（inches），`1in = 2.54cm = 96px`
- pc：派卡（picas）， `1pc = 1/6in = 12pt = 1/6 * 96px = 16px`

> https://drafts.csswg.org/css-values-3/#em

## width:auto 和 width:100%的区别

一般而言

width:100%会使元素 box 的宽度等于父元素的 content box 的宽度。

width:auto 会使元素撑满整个父元素，margin、border、padding、content 区域会自动分配水平空间。

## 'display'、'position'和'float'的相互关系？

（1）首先我们判断 display 属性是否为 none，如果为 none，则 position 和 float 属性的值不影响元素最后的表现。

（2）然后判断 position 的值是否为 absolute 或者 fixed，如果是，则 float 属性失效，并且 display 的值应该被设置为 table 或者 block，具体转换需要看初始转换值。

（3）如果 position 的值不为 absolute 或者 fixed，则判断 float 属性的值是否为 none，如果不是，则 display 的值则按上面的规则转换。注意，如果 position 的值为 relative 并且 float 属性的值存在，则 relative 相对于浮动后的最终位置定位。

（4）如果 float 的值为 none，则判断元素是否为根元素，如果是根元素则 display 属性按照上面的规则转换，如果不是，则保持指定的 display 属性值不变。

总的来说，可以把它看作是一个类似优先级的机制，`"position:absolute"`和`"position:fixed"`优先级最高，有它存在的时候，浮动不起作用，`'display'`的值也需要调整；其次，元素的`'float'`特性的值不是`"none"`的时候或者它是根元素的时候，调整`'display'`的值；最后，非根元素，并且非浮动元素，并且非绝对定位的元素，`'display'`特性值同设置值。

## margin 重叠问题的理解。

块级元素的上外边距（margin-top）与下外边距（margin-bottom）有时会合并为单个外边距，这样的现象称为“margin 合并”。

产生折叠的必备条件：margin 必须是邻接的!

而根据 w3c 规范，两个 margin 是邻接的必须满足以下条件：

- 必须是处于**常规文档流**（非 float 和绝对定位）的块级盒子，并且处于同一个 BFC 当中。
- 没有线盒，没有空隙，**没有 padding 和 border**将他们分隔开
- 都属于垂直方向上相邻的外边距，可以是下面任意一种情况
- 元素的 margin-top 与其第一个常规文档流的子元素的 margin-top
- 元素的 margin-bottom 与其下一个常规文档流的兄弟元素的 margin-top
- height 为 auto 的元素的 margin-bottom 与其最后一个常规文档流的子元素的 margin-bottom
- 高度为 0 并且最小高度也为 0，不包含常规文档流的子元素，并且自身没有建立新的 BFC 的元素的 margin-top 和 margin-bottom

margin 合并的 3 种场景：

（1）相邻兄弟元素 margin 合并。

解决办法：

- 设置块状格式化上下文元素（BFC）

（2）父级和第一个/最后一个子元素的 margin 合并。

解决办法：

对于 margin-top 合并，可以进行如下操作（满足一个条件即可）：

- 父元素设置为块状格式化上下文元素；
- 父元素设置 border-top 值；
- 父元素设置 padding-top 值；
- 父元素和第一个子元素之间添加内联元素进行分隔。

对于 margin-bottom 合并，可以进行如下操作（满足一个条件即可）：

- 父元素设置为块状格式化上下文元素；
- 父元素设置 border-bottom 值；
- 父元素设置 padding-bottom 值；
- 父元素和最后一个子元素之间添加内联元素进行分隔；
- 父元素设置 height、min-height 或 max-height。

（3）空块级元素的 margin 合并。

解决办法：

- 设置垂直方向的 border；
- 设置垂直方向的 padding；
- 里面添加内联元素（直接 Space 键空格是没用的）；
- 设置 height 或者 min-height。

**回答：**

margin 重叠指的是在垂直方向上，两个相邻元素的 margin 发生重叠的情况。

一般来说可以分为四种情形：

第一种是相邻兄弟元素的 marin-bottom 和 margin-top 的值发生重叠。这种情况下我们可以通过设置其中一个元素为 BFC 来解决。

第二种是父元素的 margin-top 和子元素的 margin-top 发生重叠。它们发生重叠是因为它们是相邻的，所以我们可以通过这一点来解决这个问题。我们可以为父元素设置 border-top、padding-top 值来分隔它们，当然我们也可以将父元素设置为 BFC 来解决。

第三种是高度为 auto 的父元素的 margin-bottom 和子元素的 margin-bottom 发生重叠。它们发生重叠一个是因为它们相邻，一个是因为父元素的高度不固定。因此我们可以为父元素设置 border-bottom、padding-bottom 来分隔它们，也可以为父元素设置一个高度，max-height 和 min-height 也能解决这个问题。当然将父元素设置为 BFC 是最简单的方法。

第四种情况，是没有内容的元素，自身的 margin-top 和 margin-bottom 发生的重叠。我们可以通过为其设置 border、padding 或者高度来解决这个问题。

## 使用 clear 属性清除浮动的原理？

使用 clear 属性清除浮动，其语法如下：

```css
clear: none|left|right|both;
```

如果单看字面意思，clear:left 应该是“清除左浮动”，clear:right 应该是“清除右浮动”的意思，实际上，这种解释是有问题的，因为浮动一直还在，并没有清除。

官方对 clear 属性的解释是：“元素盒子的边不能和前面的浮动元素相邻。”，我们对元素设置 clear 属性是为了避免浮动元素对该元素的影响，而不是清除掉浮动。

还需要注意的一点是 clear 属性指的是元素盒子的边不能和前面的浮动元素相邻，注意这里“前面的”3 个字，也就是 clear 属性对“后面的”浮动元素是不闻不问的。考虑到 float 属性要么是 left，要么是 right，不可能同时存在，同时由于 clear 属性对“后面的”浮动元素不闻不问，因此，当 clear:left 有效的时候，clear:right 必定无效，也就是此时 clear:left 等同于设置 clear:both；同样地，clear:right 如果有效也是等同于设置 clear:both。由此可见，clear:left 和 clear:right 这两个声明就没有任何使用的价值，至少在 CSS 世界中是如此，直接使用 clear:both 吧。

一般使用伪元素的方式清除浮动

```css
.clear::after {
  content: '';
  display: table; //也可以是'block'，或者是'list-item'
  clear: both;
}
```

clear 属性只有块级元素才有效的，而::after 等伪元素默认都是内联水平，这就是借助伪元素清除浮动影响时需要设置 display 属性值的原因。

## zoom:1 的清除浮动原理?

清除浮动，触发 hasLayout； zoom 属性是 IE 浏览器的专有属性，它可以设置或检索对象的缩放比例。解决 ie 下比较奇葩的 bug。譬如外边距（margin）的重叠，浮动清除，触发 ie 的 haslayout 属性等。

来龙去脉大概如下：

当设置了 zoom 的值之后，所设置的元素就会就会扩大或者缩小，高度宽度就会重新计算了，这里一旦改变 zoom 值时其实也会发生重新渲染，运用这个原理，也就解决了 ie 下子元素浮动时候父元素不随着自动扩大的问题。

zoom 属性是 IE 浏览器的专有属性，火狐和老版本的 webkit 核心的浏览器都不支持这个属性。然而，zoom 现在已经被逐步标准化，出现在 CSS3.0 规范草案中。

目前非 ie 由于不支持这个属性，它们又是通过什么属性来实现元素的缩放呢？可以通过 css3 里面的动画属性 scale 进行缩放。

## 如何让去除 inline-block 元素间间距？

移除空格、使用 margin 负值、使用 font-size:0、letter-spacing、word-spacing

## overflow:scroll 时不能平滑滚动的问题怎么处理？

以下代码可解决这种卡顿的问题：`-webkit-overflow-scrolling:touch;`是因为这行代码启用了硬件加速特性，所以滑动很流畅。

## transition 和 animation 的区别

transition 关注的是 CSS property 的变化，property 值和时间的关系是一个三次贝塞尔曲线。

animation 作用于元素本身而不是样式属性，可以使用关键帧的概念，应该说可以实现更自由的动画效果。

## 为什么 height:100%会无效？

对于普通文档流中的元素，百分比高度值要想起作用，其父级必须有一个可以生效的高度值。

原因是如果包含块的高度没有显式指定（即高度由内容决定），并且该元素不是绝对定位，则计算值为 auto，因为解释成了 auto，所以无法参与计算。

使用绝对定位的元素会有计算值，即使祖先元素的 height 计算为 auto 也是如此。

## min-width/max-width 和 min-height/max-height 属性间的覆盖规则？

（1）max-width 会覆盖 width，即使 width 是行类样式或者设置了!important。

（2）min-width 会覆盖 max-width，此规则发生在 min-width 和 max-width 冲突的时候。

## margin:auto 的填充规则？

margin 的'auto'可不是摆设，是具有强烈的计算意味的关键字，用来计算元素对应方向应该获得的剩余间距大小。但是触发 margin:auto 计算有一个前提条件，就是 width 或 height 为 auto 时，元素是具有对应方向的自动填充特性的。

（1）如果一侧定值，一侧 auto，则 auto 为剩余空间大小。（2）如果两侧均是 auto，则平分剩余空间。

## margin 无效的情形

（1）display 计算值 inline 的非替换元素的垂直 margin 是无效的。对于内联替换元素，垂直 margin 有效，并且没有 margin 合并的问题。

（2）表格中的`<tr>`和`<td>`元素或者设置 display 计算值是 table-cell 或 table-row 的元素的 margin 都是无效的。

（3）绝对定位元素非定位方位的 margin 值“无效”。

（4）定高容器的子元素的 margin-bottom 或者宽度定死的子元素的 margin-right 的定位“失效”。

## border 的特殊性？

（1）border-width 却不支持百分比。

（2）border-style 的默认值是 none，有一部分人可能会误以为是 solid。这也是单纯设置 border-width 或 border-color 没有边框显示的原因。

（3）border-style:double 的表现规则：双线宽度永远相等，中间间隔 ±1。

（4）border-color 默认颜色就是 color 色值。

（5）默认 background 背景图片是相对于 padding box 定位的。

## 什么是基线和 x-height？

字母 x 的下边缘（线）就是我们的基线。

x-height 指的就是小写字母 x 的高度，术语描述就是基线和等分线（meanline）（也称作中线，midline）之间的距离。在 CSS 世界中，middle 指的是基线往上 1/2x-height 高度。我们可以近似理解为字母 x 交叉点那个位置。

ex 是 CSS 中的一个相对单位，指的是小写字母 x 的高度，没错，就是指 x-height。ex 的价值就在其副业上不受字体和字号影响的内联元素的垂直居中对齐效果。内联元素默认是基线对齐的，而基线就是 x 的底部，而 1ex 就是一个 x 的高度。

## line-height 的特殊性？

（1）对于非替换元素的纯内联元素，其可视高度完全由 line-height 决定。对于文本这样的纯内联元素，line-height 就是高度计算的基石，用专业说法就是指定了用来计算行框盒子高度的基础高度。

（2）内联元素的高度由固定高度和不固定高度组成，这个不固定的部分就是这里的“行距”。换句话说，line-height 之所以起作用，就是通过改变“行距”来实现的。在 CSS 中，“行距”分散在当前文字的上方和下方，也就是即使是第一行文字，其上方也是有“行距”的，只不过这个“行距”的高度仅仅是完整“行距”高度的一半，因此，也被称为“半行距”。

（3）行距=line-height-font-size。

（4）border 以及 line-height 等传统 CSS 属性并没有小数像素的概念。如果标注的是文字上边距，则向下取整；如果是文字下边距，则向上取整。

（5）对于纯文本元素，line-height 直接决定了最终的高度。但是，如果同时有替换元素，则 line-height 只能决定最小高度。

（6）对于块级元素，line-height 对其本身是没有任何作用的，我们平时改变 line-height，块级元素的高度跟着变化实际上是通过改变块级元素里面内联级别元素占据的高度实现的。

（7）line-height 的默认值是 normal，还支持数值、百分比值以及长度值。为数值类型时，其最终的计算值是和当前 font-size 相乘后的值。为百分比值时，其最终的计算值是和当前 font-size 相乘后的值。为长度值时原意不变。

（8）如果使用数值作为 line-height 的属性值，那么所有的子元素继承的都是这个值；但是，如果使用百分比值或者长度值作为属性值，那么所有的子元素继承的是最终的计算值。

（9）无论内联元素 line-height 如何设置，最终父级元素的高度都是由数值大的那个 line-height 决定的。

（10）只要有“内联盒子”在，就一定会有“行框盒子”，就是每一行内联元素外面包裹的一层看不见的盒子。然后，重点来了，在每个“行框盒子”前面有一个宽度为 0 的具有该元素的字体和行高属性的看不见的“幽灵空白节点”。

## vertical-align 的特殊性？

（1）vertical-align 的默认值是 baseline，即基线对齐，而基线的定义是字母 x 的下边缘。因此，内联元素默认都是沿着字母 x 的下边缘对齐的。对于图片等替换元素，往往使用元素本身的下边缘作为基线。一个 inline-block 元素，如果里面没有内联元素，或者 overflow 不是 visible，则该元素的基线就是其 margin 底边缘；否则其基线就是元素里面最后一行内联元素的基线。

（2）vertical-align:top 就是垂直上边缘对齐，如果是内联元素，则和这一行位置最高的内联元素的顶部对齐；如果 display 计算值是 table-cell 的元素，我们不妨脑补成`<td>`元素，则和`<tr>`元素上边缘对齐。

（3）vertical-align:middle 是中间对齐，对于内联元素，元素的垂直中心点和行框盒子基线往上 1/2x-height 处对齐。对于 table-cell 元素，单元格填充盒子相对于外面的表格行居中对齐。

（4）vertical-align 支持数值属性，根据数值的不同，相对于基线往上或往下偏移，如果是负值，往下偏移，如果是正值，往上偏移。

（5）vertical-align 属性的百分比值则是相对于 line-height 的计算值计算的。

（6）vertical-align 起作用是有前提条件的，这个前提条件就是：只能应用于内联元素以及 display 值为 table-cell 的元素。

（7）table-cell 元素设置 vertical-align 垂直对齐的是子元素，但是其作用的并不是子元素，而是 table-cell 元素自身。

## overflow 的特殊性？

（1）一个设置了 overflow:hidden 声明的元素，假设同时存在 border 属性和 padding 属性，则当子元素内容超出容器宽度高度限制的时候，剪裁的边界是 border box 的内边缘，而非 padding box 的内边缘。

（2）HTML 中有两个标签是默认可以产生滚动条的，一个是根元素`<html>`，另一个是文本域`<textarea>`。

（3）滚动条会占用容器的可用宽度或高度。

（4）元素设置了 overflow:hidden 声明，里面内容高度溢出的时候，滚动依然存在，仅仅滚动条不存在！

## absolute 与 overflow 的关系？

（1）如果 overflow 不是定位元素，同时绝对定位元素和 overflow 容器之间也没有定位元素，则 overflow 无法对 absolute 元素进行剪裁。

（2）如果 overflow 的属性值不是 hidden 而是 auto 或者 scroll，即使绝对定位元素高宽比 overflow 元素高宽还要大，也都不会出现滚动条。

（3）overflow 元素自身 transform 的时候，Chrome 和 Opera 浏览器下的 overflow 剪裁是无效的。

## clip 裁剪是什么？

所谓“可访问性隐藏”，指的是虽然内容肉眼看不见，但是其他辅助设备却能够进行识别和访问的隐藏。

clip 剪裁被我称为“最佳可访问性隐藏”的另外一个原因就是，它具有更强的普遍适应性，任何元素、任何场景都可以无障碍使用。

## relative 的特殊性？

（1）相对定位元素的 left/top/right/bottom 的百分比值是相对于包含块计算的，而不是自身。注意，虽然定位位移是相对自身，但是百分比值的计算值不是。

（2）top 和 bottom 这两个垂直方向的百分比值计算跟 height 的百分比值是一样的，都是相对高度计算的。同时，如果包含块的高度是 auto，那么计算值是 0，偏移无效，也就是说，如果父元素没有设定高度或者不是“格式化高度”，那么 relative 类似 top:20%的代码等同于 top:0。

（3）当相对定位元素同时应用对立方向定位值的时候，也就是 top/bottom 和 left/right 同时使用的时候，只有一个方向的定位属性会起作用。而谁起作用则是与文档流的顺序有关的，默认的文档流是自上而下、从左往右，因此 top/bottom 同时使用的时候，bottom 失效；left/right 同时使用的时候，right 失效。

## font-weight 的特殊性？

如果使用数值作为 font-weight 属性值，必须是 100 ～ 900 的整百数。因为这里的数值仅仅是外表长得像数值，实际上是一个具有特定含义的关键字，并且这里的数值关键字和字母关键字之间是有对应关系的。

## text-indent 的特殊性？

（1）text-indent 仅对第一行内联盒子内容有效。

（2）非替换元素以外的 display 计算值为 inline 的内联元素设置 text-indent 值无效，如果计算值 inline-block/inline-table 则会生效。

（3）`<input>`标签按钮 text-indent 值无效。

（4）`<button>`标签按钮 text-indent 值有效。

（5）text-indent 的百分比值是相对于当前元素的“包含块”计算的，而不是当前元素。

## letter-spacing 与字符间距？

letter-spacing 可以用来控制字符之间的间距，这里说的“字符”包括英文字母、汉字以及空格等。

letter-spacing 具有以下一些特性。

（1）继承性。

（2）默认值是 normal 而不是 0。虽然说正常情况下，normal 的计算值就是 0，但两者还是有差别的，在有些场景下，letter-spacing 会调整 normal 的计算值以实现更好的版面布局。

（3）支持负值，且值足够大的时候，会让字符形成重叠，甚至反向排列。

（4）和 text-indent 属性一样，无论值多大或多小，第一行一定会保留至少一个字符。

（5）支持小数值，即使 0.1px 也是支持的。

（6）暂不支持百分比值。

## word-spacing 与单词间距？

letter-spacing 作用于所有字符，但 word-spacing 仅作用于空格字符。换句话说，word-spacing 的作用就是增加空格的间隙宽度。

## white-space 与换行和空格的控制？

white-space 属性声明了如何处理元素内的空白字符，这类空白字符包括 Space（空格）键、Enter（回车）键、Tab（制表符）键产生的空白。因此，white-space 可以决定图文内容是否在一行显示（回车空格是否生效），是否显示大段连续空白（空格是否生效）等。

其属性值包括下面这些。

- normal：合并空白字符和换行符。
- pre：空白字符不合并，并且内容只在有换行符的地方换行。
- nowrap：该值和 normal 一样会合并空白字符，但不允许文本环绕。
- pre-wrap：空白字符不合并，并且内容只在有换行符的地方换行，同时允许文本环绕。
- pre-line：合并空白字符，但只在有换行符的地方换行，允许文本环绕。

## 隐藏元素的 background-image 到底加不加载？

根据测试，一个元素如果 display 计算值为 none，在 IE 浏览器下（IE8 ～ IE11，更高版本不确定）依然会发送图片请求，Firefox 浏览器不会，至于 Chrome 和 Safari 浏览器则似乎更加智能一点：如果隐藏元素同时又设置了 background-image，则图片依然会去加载；如果是父元素的 display 计算值为 none，则背景图不会请求，此时浏览器或许放心地认为这个背景图暂时是不会使用的。

如果不是 background-image，而是`<img>`元素，则设置 display:none 在所有浏览器下依旧都会请求图片资源。

还需要注意的是如果设置的样式没有对应的元素，则 background-image 也不会加载。hover 情况下的 background-image，在触发时加载。

回答：

（1）元素的背景图片

- 元素本身设置 display:none，会请求图片

- 父级元素设置 display:none，不会请求图片
- 样式没有元素使用，不会请求
- hover 样式下，触发时请求

（2）img 标签图片任何情况下都会请求图片

## 你知道 CSS 中不同属性设置为百分比%时对应的计算基准？

公式：当前元素某 CSS 属性值 = 基准 \* 对应的百分比

元素的 position 为 relative 和 absolute 时，top 和 bottom、left 和 right 基准分别为包含块的 height、width

元素的 position 为 fixed 时，top 和 bottom、left 和 right 基准分别为初始包含块（也就是视口）的 height、width，移动设备较为复杂，基准为 Layout viewport 的 height、width

元素的 height 和 width 设置为百分比时，基准分别为包含块的 height 和 width

元素的 margin 和 padding 设置为百分比时，基准为包含块的 width（易错）

元素的 border-width，不支持百分比

元素的 text-indent，基准为包含块的 width

元素的 border-radius，基准为分别为自身的 height、width

元素的 background-size，基准为分别为自身的 height、width

元素的 translateX、translateY，基准为分别为自身的 height、width

元素的 line-height，基准为自身的 font-size

元素的 font-size，基准为父元素字体
