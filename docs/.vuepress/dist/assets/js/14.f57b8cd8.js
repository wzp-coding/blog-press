(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{383:function(t,o,v){"use strict";v.r(o);var e=v(45),_=Object(e.a)({},(function(){var t=this,o=t.$createElement,v=t._self._c||o;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("h2",{attrs:{id:"初次接手公司项目"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#初次接手公司项目"}},[t._v("#")]),t._v(" 初次接手公司项目")]),t._v(" "),v("ol",[v("li",[v("p",[t._v("在公司：连接"),v("strong",[t._v("公司内网")]),t._v("，才能访问内网项目")]),t._v(" "),v("p",[t._v("在家/其他地方：通过公司"),v("strong",[t._v("VPN工具")]),t._v("，连接公司内网")])]),t._v(" "),v("li",[v("p",[t._v("可能公司内部gitlab项目组会给每个人设置权限，你得让组长开权限给你访问")])]),t._v(" "),v("li",[v("p",[t._v("拉取项目到本地后："),v("strong",[t._v("安装依赖")]),t._v("，由于可能搭建了公司内网npm私服，也是得连接内网才能安装(npm install)")])]),t._v(" "),v("li",[v("p",[t._v("启动项目，访问本机端口(eg. "),v("code",[t._v("localhost:8080")]),t._v("),由于我们公司项目的token是"),v("strong",[t._v("存放在二级域名")]),t._v("下("),v("strong",[t._v("通过F12控制台->Application->查看Cookies的domain")]),t._v(")，此时登录会产生跨域问题，因此需要将"),v("code",[t._v("localhost")]),t._v("映射为项目对应的域名地址(eg."),v("code",[t._v("127.0.0.1 dev.bigda.com")]),t._v("，这里的dev是一级域名，可以随意取，二级域名对应token存放的domain，通过控制台可以查看)，然后访问"),v("code",[t._v("dev.bigda.com:8080")]),t._v("，这个东西搞不定直接问组长吧")])]),t._v(" "),v("li",[v("p",[t._v("映射域名有很多种方法，这里说其中两种")]),t._v(" "),v("ol",[v("li",[t._v("直接修改本地host文件(windows系统host文件位置"),v("code",[t._v("C:\\WINDOWS\\system32\\drivers\\etc")]),t._v(" )")]),t._v(" "),v("li",[t._v("下载"),v("a",{attrs:{href:"https://github.com/oldj/SwitchHosts/releases",target:"_blank",rel:"noopener noreferrer"}},[t._v("switchhost"),v("OutboundLink")],1),t._v(",设置域名映射，启动"),v("code",[t._v("switchhost")])])])]),t._v(" "),v("li",[v("p",[t._v("如果已经可以看到部分页面，但有些让你开发的页面你看不到，说明项目也有权限控制，同样也是需要组长开权限")])])])])}),[],!1,null,null,null);o.default=_.exports}}]);