(window.webpackJsonp=window.webpackJsonp||[]).push([[62],{505:function(a,t,s){"use strict";s.r(t);var n=s(15),e=Object(n.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"了解一下-reduce"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#了解一下-reduce"}},[a._v("#")]),a._v(" 了解一下 reduce？")]),a._v(" "),s("p"),s("div",{staticClass:"table-of-contents"},[s("ul",[s("li",[s("a",{attrs:{href:"#作用"}},[a._v("作用")])]),s("li",[s("a",{attrs:{href:"#语法"}},[a._v("语法")])]),s("li",[s("a",{attrs:{href:"#参数"}},[a._v("参数")])]),s("li",[s("a",{attrs:{href:"#返回值"}},[a._v("返回值")])]),s("li",[s("a",{attrs:{href:"#描述"}},[a._v("描述")])]),s("li",[s("a",{attrs:{href:"#手写"}},[a._v("手写")])]),s("li",[s("a",{attrs:{href:"#参考"}},[a._v("参考")])])])]),s("p"),a._v(" "),s("h2",{attrs:{id:"作用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#作用"}},[a._v("#")]),a._v(" 作用")]),a._v(" "),s("p",[s("code",[a._v("reduce()")]),a._v(" 方法对数组中的每个元素执行一个由您提供的"),s("strong",[a._v("reducer")]),a._v("函数(升序执行)，将其结果汇总为单个返回值。")]),a._v(" "),s("h2",{attrs:{id:"语法"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#语法"}},[a._v("#")]),a._v(" 语法")]),a._v(" "),s("blockquote",[s("p",[s("code",[a._v("arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])")])])]),a._v(" "),s("h2",{attrs:{id:"参数"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参数"}},[a._v("#")]),a._v(" 参数")]),a._v(" "),s("ul",[s("li",[s("p",[s("code",[a._v("callback")])]),a._v(" "),s("p",[a._v("执行数组中每个值 (如果没有提供 "),s("code",[a._v("initialValue则第一个值除外")]),a._v(")的函数，包含四个参数：")]),a._v(" "),s("ol",[s("li",[s("p",[s("strong",[s("code",[a._v("accumulator")])])]),a._v(" "),s("p",[a._v("​ 累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或"),s("code",[a._v("initialValue")]),a._v("（见于下方）。")])]),a._v(" "),s("li",[s("p",[s("code",[a._v("currentValue")])]),a._v(" "),s("p",[a._v("​ 数组中正在处理的元素。")])]),a._v(" "),s("li",[s("p",[s("code",[a._v("index")]),a._v(" 可选")]),a._v(" "),s("p",[a._v("​ 数组中正在处理的当前元素的索引。 如果提供了"),s("code",[a._v("initialValue")]),a._v("，则起始索引号为 0，否则从索引 1 起始。")])]),a._v(" "),s("li",[s("p",[s("code",[a._v("array")]),a._v("可选")]),a._v(" "),s("p",[a._v("​ 调用"),s("code",[a._v("reduce()")]),a._v("的数组")])])])]),a._v(" "),s("li",[s("p",[s("code",[a._v("initialValue")]),a._v("可选")]),a._v(" "),s("p",[a._v("​ 作为第一次调用 "),s("code",[a._v("callback")]),a._v("函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。")])])]),a._v(" "),s("h2",{attrs:{id:"返回值"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#返回值"}},[a._v("#")]),a._v(" 返回值")]),a._v(" "),s("p",[a._v("函数累计处理的结果")]),a._v(" "),s("h2",{attrs:{id:"描述"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#描述"}},[a._v("#")]),a._v(" 描述")]),a._v(" "),s("p",[s("code",[a._v("reduce")]),a._v("为数组中的每一个元素依次执行"),s("code",[a._v("callback")]),a._v("函数，不包括数组中被删除或从未被赋值的元素，接受四个参数：")]),a._v(" "),s("ul",[s("li",[s("code",[a._v("accumulator 累计器")])]),a._v(" "),s("li",[s("code",[a._v("currentValue 当前值")])]),a._v(" "),s("li",[s("code",[a._v("currentIndex 当前索引")])]),a._v(" "),s("li",[s("code",[a._v("array 数组")])])]),a._v(" "),s("p",[a._v("回调函数第一次执行时，"),s("code",[a._v("accumulator")]),a._v(" 和"),s("code",[a._v("currentValue")]),a._v("的取值有两种情况：")]),a._v(" "),s("ul",[s("li",[a._v("如果调用"),s("code",[a._v("reduce()")]),a._v("时提供了"),s("code",[a._v("initialValue")]),a._v("，"),s("code",[a._v("accumulator")]),a._v("取值为"),s("code",[a._v("initialValue")]),a._v("，"),s("code",[a._v("currentValue")]),a._v("取数组中的第一个值；")]),a._v(" "),s("li",[a._v("如果没有提供 "),s("code",[a._v("initialValue")]),a._v("，那么"),s("code",[a._v("accumulator")]),a._v("取数组中的第一个值，"),s("code",[a._v("currentValue")]),a._v("取数组中的第二个值。")])]),a._v(" "),s("p",[s("strong",[a._v("注意：")])]),a._v(" "),s("ul",[s("li",[s("p",[a._v("如果没有提供"),s("code",[a._v("initialValue")]),a._v("，reduce 会从索引 1 的地方开始执行 callback 方法，跳过第一个索引。")])]),a._v(" "),s("li",[s("p",[a._v("如果提供"),s("code",[a._v("initialValue")]),a._v("，从索引 0 开始。")])]),a._v(" "),s("li",[s("p",[a._v("如果数组为空且没有提供"),s("code",[a._v("initialValue")]),a._v("，会抛出"),s("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError",target:"_blank",rel:"noopener noreferrer"}},[s("code",[a._v("TypeError")]),s("OutboundLink")],1),a._v("（无论位置如何）并且没有提供"),s("code",[a._v("initialValue")]),a._v("， 或者有提供"),s("code",[a._v("initialValue")]),a._v("但是数组为空，那么此唯一值将被返回并且"),s("code",[a._v("callback")]),a._v("不会被执行。")])])]),a._v(" "),s("h2",{attrs:{id:"手写"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#手写"}},[a._v("#")]),a._v(" 手写")]),a._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Array")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("prototype"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[a._v("_reduce")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("function")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[a._v("callback"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" initialValue")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("let")]),a._v(" first "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("true")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("let")]),a._v(" array "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("this")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("let")]),a._v(" accumulator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" currentValue"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" index\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("length "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("===")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("&&")]),a._v(" initialValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("===")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("void")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 数组为空且没有提供initialValue，会抛出TypeError")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("throw")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("new")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Error")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[a._v("'TypeError'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("length "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("===")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("&&")]),a._v(" initialValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("===")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("void")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 数组仅有一个元素（无论位置如何）并且没有提供initialValue")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("length "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("===")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("&&")]),a._v(" initialValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("!==")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("void")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 有提供initialValue但是数组为空")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" initialValue\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=>")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("for")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("let")]),a._v(" i "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" j "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("length"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v(" i "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v(" j"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v(" i"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("++")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n      "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("first"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 第一次执行")]),a._v("\n        first "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),a._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("initialValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("!==")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("void")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 如果调用reduce()时提供了initialValue，accumulator取值为initialValue，currentValue取数组中的第一个值")]),a._v("\n          accumulator "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" initialValue\n          currentValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 如果提供initialValue，从索引0开始。")]),a._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 注意：下一次索引应该是array[1]")]),a._v("\n          index "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),a._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("else")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 如果没有提供 initialValue，那么accumulator取数组中的第一个值，currentValue取数组中的第二个值")]),a._v("\n          accumulator "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n          currentValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引")]),a._v("\n          "),s("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 注意：下一次索引应该是array[2]")]),a._v("\n          index "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v("\n          i "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("+=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("else")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        currentValue "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("i"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v("\n        index "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" i\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n      accumulator "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("callback")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("accumulator"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" currentValue"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" index"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v(" array"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("return")]),a._v(" accumulator\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])]),a._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[a._v("1")]),s("br"),s("span",{staticClass:"line-number"},[a._v("2")]),s("br"),s("span",{staticClass:"line-number"},[a._v("3")]),s("br"),s("span",{staticClass:"line-number"},[a._v("4")]),s("br"),s("span",{staticClass:"line-number"},[a._v("5")]),s("br"),s("span",{staticClass:"line-number"},[a._v("6")]),s("br"),s("span",{staticClass:"line-number"},[a._v("7")]),s("br"),s("span",{staticClass:"line-number"},[a._v("8")]),s("br"),s("span",{staticClass:"line-number"},[a._v("9")]),s("br"),s("span",{staticClass:"line-number"},[a._v("10")]),s("br"),s("span",{staticClass:"line-number"},[a._v("11")]),s("br"),s("span",{staticClass:"line-number"},[a._v("12")]),s("br"),s("span",{staticClass:"line-number"},[a._v("13")]),s("br"),s("span",{staticClass:"line-number"},[a._v("14")]),s("br"),s("span",{staticClass:"line-number"},[a._v("15")]),s("br"),s("span",{staticClass:"line-number"},[a._v("16")]),s("br"),s("span",{staticClass:"line-number"},[a._v("17")]),s("br"),s("span",{staticClass:"line-number"},[a._v("18")]),s("br"),s("span",{staticClass:"line-number"},[a._v("19")]),s("br"),s("span",{staticClass:"line-number"},[a._v("20")]),s("br"),s("span",{staticClass:"line-number"},[a._v("21")]),s("br"),s("span",{staticClass:"line-number"},[a._v("22")]),s("br"),s("span",{staticClass:"line-number"},[a._v("23")]),s("br"),s("span",{staticClass:"line-number"},[a._v("24")]),s("br"),s("span",{staticClass:"line-number"},[a._v("25")]),s("br"),s("span",{staticClass:"line-number"},[a._v("26")]),s("br"),s("span",{staticClass:"line-number"},[a._v("27")]),s("br"),s("span",{staticClass:"line-number"},[a._v("28")]),s("br"),s("span",{staticClass:"line-number"},[a._v("29")]),s("br"),s("span",{staticClass:"line-number"},[a._v("30")]),s("br"),s("span",{staticClass:"line-number"},[a._v("31")]),s("br"),s("span",{staticClass:"line-number"},[a._v("32")]),s("br"),s("span",{staticClass:"line-number"},[a._v("33")]),s("br"),s("span",{staticClass:"line-number"},[a._v("34")]),s("br"),s("span",{staticClass:"line-number"},[a._v("35")]),s("br"),s("span",{staticClass:"line-number"},[a._v("36")]),s("br"),s("span",{staticClass:"line-number"},[a._v("37")]),s("br"),s("span",{staticClass:"line-number"},[a._v("38")]),s("br"),s("span",{staticClass:"line-number"},[a._v("39")]),s("br"),s("span",{staticClass:"line-number"},[a._v("40")]),s("br"),s("span",{staticClass:"line-number"},[a._v("41")]),s("br"),s("span",{staticClass:"line-number"},[a._v("42")]),s("br"),s("span",{staticClass:"line-number"},[a._v("43")]),s("br"),s("span",{staticClass:"line-number"},[a._v("44")]),s("br"),s("span",{staticClass:"line-number"},[a._v("45")]),s("br"),s("span",{staticClass:"line-number"},[a._v("46")]),s("br")])]),s("h2",{attrs:{id:"参考"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[a._v("#")]),a._v(" 参考")]),a._v(" "),s("blockquote",[s("p",[s("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce",target:"_blank",rel:"noopener noreferrer"}},[a._v("Reduce"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);t.default=e.exports}}]);