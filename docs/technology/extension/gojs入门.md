---
title: gojs入门教程
---

# gojs

[[toc]]

## 快速入门
GoJS是一个用于实现交互图的JavaScript库。

这个页面将向你展示使用GoJS的要点。

因为GoJS是一个依赖于HTML5特性的JavaScript库，所以你需要确保你的页面声明它是一个HTML5文档。当然，你需要加载库

```html
<!DOCTYPE html>  <!-- 指定文档类型为 HTML5  -->
<html>
<head>
<!-- 开发时请使用 go-debug.js，最终部署用 go.js -->
<script src="go-debug.js"></script>
```

您可以到 [下载页面](https://gojs.net.cn/download.html) 下载最新版 GoJS（包含所有例子），或者直接引用 [CDN](https://cdnjs.com/libraries/gojs) 文件：

```html
<script src="https://unpkg.com/gojs/release/go-debug.js"></script>
```

每个 **GoJS** 图形实例都需要一个 HTML 容器 `<div>` 并明确指定其大小：

```html
<!-- 图形的容器 div 需要明确指定大小，否则无法显示，本例子中我们还给该 DIV 添加了一个背景颜色，可以很方便的查看其大小。 -->
<div id="myDiagramDiv"
  style="width:400px; height:150px; background-color: #DAE4E4;"></div>
```

在 JS 代码中，需要将 `<div>` 的 `id` 作为参数来创建图形。


```js
var $ = go.GraphObject.make;
var myDiagram = $(go.Diagram, "myDiagramDiv");
```

以上的代码最终结果是创建了一个空的图形，效果如下：

![image-20211018150749834](../../.vuepress/public../.vuepress/public/images/image-20211018150749834.png)

请注意，go 是所有 GoJS 类型所在的“命名空间”。 所有使用 GoJS 类的代码，例如 **Diagram 或 Node 或 Panel 或 Shape 或 TextBlock 都将以“go.”为前缀**。

本文将通过示例向您展示如何使用 `go.GraphObject.make` 构建 GoJS 对象。 有关更多详细信息，请阅读[在 GoJS 中构建对象](https://gojs.net.cn/intro/buildingObjects.html)。 使用 `$` 作为 `go.GraphObject.make` 的缩写非常方便，我们将从现在开始假设它的使用。 如果您在代码中将 `$` 用于其他内容，您始终可以选择不同的短变量名称，例如 `$$` 或 `MAKE` 或 `GO`。

图表(Diagram)的节点(Nodes)和链接(Links)是由模型(Model)管理的数据的可视化。 

GoJS 具有模型视图(model-view)架构，其中模型(Models)保存描述节点和链接的数据（JavaScript 对象数组），而图表(Diagrams)充当视图，使用实际的 Node 和 Link 对象可视化此数据。 

模型(Models)是您加载并在编辑后保存的内容，而不是图表(Diagrams)。 您可以在模型(model)中的数据对象上添加应用程序所需的任何属性； 您无需向 `Diagram` 和 `GraphObject` 类添加属性或修改其原型。

这是一个模型(Model)和图表(Diagram)的示例，然后是它生成的实际图表：

```js
var $ = go.GraphObject.make;
var myDiagram =
  $(go.Diagram, "myDiagramDiv",
    {
      "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
    });

var myModel = $(go.Model);
// in the model data, each node is represented by a JavaScript object:
myModel.nodeDataArray = [
  { key: "Alpha" },
  { key: "Beta" },
  { key: "Gamma" }
];
myDiagram.model = myModel;
```

![image-20211018151855508](../../.vuepress/public../.vuepress/public/images/image-20211018151855508.png)

该图显示了模型中的三个节点。 一些交互已经是可能的：

- 单击并拖动上图中的背景以平移视图。
- 单击一个节点以选择它，或按下并拖动一个节点来移动它。
- 要创建选择框，请单击并按住背景，然后开始拖动。
- 使用 `CTRL-C` 和 `CTRL-V` 或控制拖放来制作选择的副本。
- 按 Delete 键删除选定的节点。 （阅读更多[键盘命令](https://gojs.net.cn/intro/commands.html)。）
- 由于撤消管理器已启用，CTRL-Z 和 CTRL-Y 将撤消和重做移动以及复制和删除。

### 给节点添加样式

通过创建由 `GraphObjects` 组成的模板并在这些对象上设置属性来设置节点的样式。 要创建节点，我们有几个构建块类可供使用：

- [Shape](https://gojs.net.cn/intro/shapes.html)，显示带有颜色的预定义或自定义几何图形
- [TextBlock](https://gojs.net.cn/intro/textblocks.html)，以各种字体显示（可能可编辑）文本
- [Picture](https://gojs.net.cn/intro/pictures.html)，显示图像
- [Panel](https://gojs.net.cn/intro/panels.html)，用于容纳其他对象的集合的容器，这些对象可以根据面板的类型（如表格、垂直堆叠和拉伸容器）以不同方式定位和调整大小

所有这些构建块都派生自 [GraphObject](https://gojs.net.cn/api/symbols/GraphObject.html) 抽象类，因此我们随便将它们称为 GraphObjects 或对象或元素。 请注意，GraphObject 不是 HTML DOM 元素，因此在创建或修改此类对象时没有那么多开销。

我们希望模型数据属性影响我们的节点，这是通过数据绑定来完成的。 数据绑定允许我们通过自动将这些 GraphObject 的属性设置为从模型数据中获取的值来更改节点中 GraphObject 的外观和行为。 模型数据对象是纯 JavaScript 对象。 您可以选择在模型中的节点数据上使用您喜欢的任何属性名称。

默认的 Node 模板很简单：一个包含一个 TextBlock 的 Node。 TextBlock 的 text 属性和模型数据的 key 属性之间存在数据绑定。 在代码中，模板看起来像这样：

```js
myDiagram.nodeTemplate =
  $(go.Node,
    $(go.TextBlock,
      // TextBlock.text is bound to Node.data.key
      new go.Binding("text", "key"))
  );
```

TextBlocks、Shapes 和 Pictures 是 GoJS 的原始构建块。 TextBlocks 不能包含图像； Shapes不能包含文本。 如果您希望节点显示一些文本，则必须使用 TextBlock。 如果要绘制或填充一些几何图形，则必须使用 Shape。

更一般地说，Node 模板的骨架看起来像这样：

```js
myDiagram.nodeTemplate =
$(go.Node, "Vertical", // Node/Panel的第二个参数可以是Panel类型
/* 在这里设置Node的属性 */
{ // 节点的位置点将会定位在每个节点的中心点
locationSpot: go.Spot.Center
},
/* 添加一些数据绑定 */
// 将节点的location属性绑定为Node.data(指nodeDataArray中的data)中的loc属性
// 实际上loc是自动生成的
new go.Binding("location", "loc"),

/* 在节点内部添加一些GrapObjects(图表对象) */
// 这个Shape将在TextBlock的垂直上方  
$(go.Shape,
"RoundedRectangle", // 字符串参数可以命名预定义的图形
{ /* 在这里设置Shape的属性 */ },
// 将Shape的figure属性绑定为Node.data(指nodeDataArray中的data)中的fig属性
new go.Binding("figure", "fig")),
  
$(go.TextBlock,
"default text",  // 参数可以是初始文本字符串
{ /* 在这里设置TextBlock的属性 */ },
// 将TextBlock的text属性绑定为Node.data(指nodeDataArray中的data)中的key属性
new go.Binding("text", "key"))
);
```

图形对象(GraphObjects)在面板(Panels)中的嵌套可以任意深度，每个类都有自己独特的一组属性可供探索，上面例子只是显示了总体思路。

现在我们已经了解了如何制作 Node 模板，让我们看一个活生生的例子。 我们将制作一个在组织图中常见的简单模板：图片+名字。 考虑以下节点模板：

- “Horizontal(水平)”面板(Panel)类型的节点(Node)，这意味着其元素将水平并排布置。 它有两个要素：

  - 图片的URL，与图像源数据绑定

  - 名称的 TextBlock，绑定文本数据

```js
var $ = go.GraphObject.make;
var myDiagram =
    $(go.Diagram, "myDiagramDiv",
      {
        "undoManager.isEnabled": true // 启用Ctrl-Z撤消和Ctrl-Y重做
    });
// 定义一个简单的节点模板
myDiagram.nodeTemplate =
    $(go.Node, "Horizontal",
      // 整个节点将有一个浅蓝色的背景
      { background: "#44CCFF" },
      $(go.Picture,
        // 图片通常应该有明确的宽度和高度。
        // 此图为红色背景，仅在没有url时可见
        // 或者当图像部分透明时
        { margin: 10, width: 50, height: 50, background: "red" },
        // 将Picture的source绑定为Node.data(指nodeDataArray中的data)中的source属性
        new go.Binding("source")),
      $(go.TextBlock,
        "Default Text",  // TextBlock.text的初始值
        // 在文本周围留出一些空间，使用更大的字体和白色的笔画:
        { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
        // 将TextBlock的text绑定为Node.data(指nodeDataArray中的data)中的name属性.
        new go.Binding("text", "name"))
     );
var model = $(go.Model);
// 实际传入的数据
model.nodeDataArray =
    [ // note that each node data object holds whatever properties it needs;
    // for this app we add the "name" and "source" properties
    { name: "Don Meow", source: "../.vuepress/public/images/learn/cat1.png" },
    { name: "Copricat", source: "../.vuepress/public/images/learn/cat2.png" },
    { name: "Demeter",  source: "../.vuepress/public/images/learn/cat3.png" },
    { /* Empty node data */  }
];
myDiagram.model = model;
```

该代码生成了这个图

![image-20211018152706346](../../.vuepress/public../.vuepress/public/images/image-20211018152706346.png)

当不显示所有信息时，我们可能想显示一些“默认”状态，例如当图像未加载或名称未知时。本例中的“空”节点数据用于说明节点模板在没有绑定数据上的任何属性的情况下也可以很好地工作。

### 各种模型

使用自定义节点模板，我们的图表变得非常漂亮，但也许我们想展示更多。 也许我们想要一个组织结构图来表明 Don Meow 确实是一个猫卡特尔的老板。 所以我们将通过添加一些Links来显示各个节点之间的关系和一个Layout来自动定位节点来创建一个完整的组织结构图。

为了将链接添加到我们的图表中，基础模型(Model)满足不了。 我们将不得不在 GoJS 中选择另外两个模型之一，这两个模型都支持 Links。 它们是 GraphLinksModel 和 TreeModel。 （在[此处](https://gojs.net.cn/intro/usingModels.html)阅读有关模型的更多信息。）

在 GraphLinksModel 中，除了 `model.nodeDataArray` 之外，我们还有 `model.linkDataArray`。 它包含一个 JavaScript 对象数组，每个对象通过指定`“to”`和`“from”`节点键来描述一个链接。 下面是一个示例，其中节点 A 链接到节点 B，节点 B 链接到节点 C：

```js
var model = $(go.GraphLinksModel);
model.nodeDataArray =
[
{ key: "A" },
{ key: "B" },
{ key: "C" }
];
model.linkDataArray =
[
{ from: "A", to: "B" },
{ from: "B", to: "C" }
];
myDiagram.model = model;
```

GraphLinksModel 允许您在节点之间拥有任意数量的链接，向任何方向前进。 从 A 到 B 可能有 10 个链接，另外还有 3 个从 B 到 A 以相反的方式运行。

TreeModel 的工作方式略有不同。 不是维护单独的链接数据数组，而是通过为节点数据指定“父”来创建树模型中的链接。 然后从此关联创建链接。 这是与 TreeModel 相同的示例，节点 A 链接到节点 B，节点 B 链接到节点 C：

```js
var model = $(go.TreeModel);
model.nodeDataArray =
[
{ key: "A" },
{ key: "B", parent: "A" },
{ key: "C", parent: "B" }
];
myDiagram.model = model;
```

TreeModel 比 GraphLinksModel 简单，但它不能做出任意的链接关系，例如相同的两个节点之间有多个链接，或者有多个父节点。 我们的组织图是一个简单的分层树状结构，因此我们将在此示例中选择 TreeModel。

首先，我们将通过添加更多节点、使用 TreeModel 并在数据中指定键和父项来完成数据。

```js
var $ = go.GraphObject.make;
var myDiagram =
$(go.Diagram, "myDiagramDiv",
{
"undoManager.isEnabled": true // 启用Ctrl-Z撤消和Ctrl-Y重做
});
// 我们早先定义的模板
myDiagram.nodeTemplate =
$(go.Node, "Horizontal",
{ background: "#44CCFF" },
$(go.Picture,
{ margin: 10, width: 50, height: 50, background: "red" },
new go.Binding("source")),
$(go.TextBlock, "Default Text",
{ margin: 12, stroke: "white", font: "bold 16px sans-serif" },
new go.Binding("text", "name"))
);
var model = $(go.TreeModel);
model.nodeDataArray =
[ // "key" 和 "parent" 属性是必须的,
// 另外你可以为应用添加任何你需要的数据属性
{ key: "1",              name: "Don Meow",   source: "../.vuepress/public/images/learn/cat1.png" },
{ key: "2", parent: "1", name: "Demeter",    source: "../.vuepress/public/images/learn/cat2.png" },
{ key: "3", parent: "1", name: "Copricat",   source: "../.vuepress/public/images/learn/cat3.png" },
{ key: "4", parent: "3", name: "Jellylorum", source: "../.vuepress/public/images/learn/cat4.png" },
{ key: "5", parent: "3", name: "Alonzo",     source: "../.vuepress/public/images/learn/cat5.png" },
{ key: "6", parent: "2", name: "Munkustrap", source: "../.vuepress/public/images/learn/cat6.png" }
];
myDiagram.model = model;
```

![image-20211018161041239](../../.vuepress/public../.vuepress/public/images/image-20211018161041239.png)

### 图形布局

正如您所看到的，TreeModel 会自动创建必要的链接来关联节点，但很难分辨谁是父节点。

图表有一个默认布局，它采用所有没有位置的节点并为它们提供位置，将它们排列在网格中。 我们可以明确地给我们的每个节点一个位置来整理这个组织混乱，但作为在我们的例子中更简单的解决方案，我们将使用一个自动为我们提供好的位置的布局。

我们要显示层次结构，并且已经在使用 TreeModel，因此最自然的布局选择是 TreeLayout。 TreeLayout 默认从左到右流动，所以为了让它从上到下流动（在组织图中很常见），我们将`angle`属性设置为 90。

在 GoJS 中使用布局通常很简单。 每种布局都有许多影响结果的属性。 每个布局（如 [TreeLayout Demo](https://gojs.net.cn/samples/tLayout.html)）都有展示其属性的示例。

```js
// 定义一个从上到下的TreeLayout
myDiagram.layout =
$(go.TreeLayout,
{ angle: 90, layerSpacing: 35 });
```

GoJS还有其他一些布局，你可以在[这里](https://gojs.net.cn/intro/layouts.html)阅读。将布局添加到目前为止的图表和模型中，我们可以看到我们的结果

```js
var $ = go.GraphObject.make;
var myDiagram =
$(go.Diagram, "myDiagramDiv",
{
"undoManager.isEnabled": true, // 启用Ctrl-Z撤消和Ctrl-Y重做
layout: $(go.TreeLayout, // 指定一个Diagram.layout的布局去排列
{ angle: 90, layerSpacing: 35 })
});
// 我们早先定义的模板
myDiagram.nodeTemplate =
$(go.Node, "Horizontal",
{ background: "#44CCFF" },
$(go.Picture,
{ margin: 10, width: 50, height: 50, background: "red" },
new go.Binding("source")),
$(go.TextBlock, "Default Text",
{ margin: 12, stroke: "white", font: "bold 16px sans-serif" },
new go.Binding("text", "name"))
);
var model = $(go.TreeModel);
model.nodeDataArray =
[
{ key: "1",              name: "Don Meow",   source: "../.vuepress/public/images/learn/cat1.png" },
{ key: "2", parent: "1", name: "Demeter",    source: "../.vuepress/public/images/learn/cat2.png" },
{ key: "3", parent: "1", name: "Copricat",   source: "../.vuepress/public/images/learn/cat3.png" },
{ key: "4", parent: "3", name: "Jellylorum", source: "../.vuepress/public/images/learn/cat4.png" },
{ key: "5", parent: "3", name: "Alonzo",     source: "../.vuepress/public/images/learn/cat5.png" },
{ key: "6", parent: "2", name: "Munkustrap", source: "../.vuepress/public/images/learn/cat6.png" }
];
myDiagram.model = model;
```

![image-20211018161127896](../../.vuepress/public../.vuepress/public/images/image-20211018161127896.png)

我们的图表开始看起来像一个合适的组织结构图，但我们可以通过链接做得更好。

### 连线模板

我们将构建一个新的 Link 模板，它更适合我们宽大的四四方方的节点。 链接([Link](https://gojs.net.cn/intro/links.html))是一种不同的部件，不像节点。 Link 的主要元素是 Link 的形状，并且必须是一个形状，其几何形状将由 GoJS 动态计算。 我们的链接将仅由这种形状组成，其笔触比正常粗一点，深灰色而不是黑色。 与默认链接模板不同，我们没有箭头。 并且我们将 Link 的`routing`属性从 `Normal` 更改为 `Orthogonal`，并为其指定一个`corner`，以便使直角转弯变得圆润。

```js
// 定义一个不带箭头的正交路由的Link模板
myDiagram.linkTemplate =
$(go.Link,
// 默认routing是go.Link.Normal
// 默认corner是0
{ routing: go.Link.Orthogonal, corner: 5 },
$(go.Shape, { strokeWidth: 3, stroke: "#555" }) // the link shape
// 如果我们想要一个箭头，我们也可以添加另一个Shape去定义toArrow:
// $(go.Shape, { toArrow: "Standard", stroke: null }
);
```

将我们的 Link 模板与我们的 Node 模板、TreeModel 和 TreeLayout 结合起来，我们终于有了一个完整的组织图。 完整代码重复如下，结果图如下：

```js
var $ = go.GraphObject.make;
var myDiagram =
$(go.Diagram, "myDiagramDiv",
{
"undoManager.isEnabled": true, // 启用Ctrl-Z撤消和Ctrl-Y重做
layout: $(go.TreeLayout, // 指定一个Diagram.layout的布局去排列
{ angle: 90, layerSpacing: 35 })
});
// 我们早先定义的模板
myDiagram.nodeTemplate =
$(go.Node, "Horizontal",
{ background: "#44CCFF" },
$(go.Picture,
{ margin: 10, width: 50, height: 50, background: "red" },
new go.Binding("source")),
$(go.TextBlock, "Default Text",
{ margin: 12, stroke: "white", font: "bold 16px sans-serif" },
new go.Binding("text", "name"))
);
// 定义一个不带箭头的正交路由的Link模板
myDiagram.linkTemplate =
$(go.Link,
{ routing: go.Link.Orthogonal, corner: 5 },
$(go.Shape, { strokeWidth: 3, stroke: "#555" })); // 线的样式
var model = $(go.TreeModel);
model.nodeDataArray =
[
{ key: "1",              name: "Don Meow",   source: "../.vuepress/public/images/learn/cat1.png" },
{ key: "2", parent: "1", name: "Demeter",    source: "../.vuepress/public/images/learn/cat2.png" },
{ key: "3", parent: "1", name: "Copricat",   source: "../.vuepress/public/images/learn/cat3.png" },
{ key: "4", parent: "3", name: "Jellylorum", source: "../.vuepress/public/images/learn/cat4.png" },
{ key: "5", parent: "3", name: "Alonzo",     source: "../.vuepress/public/images/learn/cat5.png" },
{ key: "6", parent: "2", name: "Munkustrap", source: "../.vuepress/public/images/learn/cat6.png" }
];
myDiagram.model = model;
```

![image-20211018161620975](../../.vuepress/public../.vuepress/public/images/image-20211018161620975.png)

## 参考

> [快速上手 GoJS](https://gojs.net.cn/learn/index.html)

