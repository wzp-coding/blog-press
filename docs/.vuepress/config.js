const { genSidebar, nav } = require('./utils.js')


module.exports = {
  head: [
    [
      "link", // 设置 favicon.ico，注意图片放在 public 文件夹下
      { rel: "icon", href: "/images/logo.jpg" },
    ],
  ],

  lang: "zh-CN",
  title: "钱端客栈",
  description: "钱端客栈",
  base: "/",

  themeConfig: {
    displayAllHeaders: false,
    logo: "/images/logo.jpg",
    sidebarDepth: 2,
    nav,
    sidebar: genSidebar(nav),
  },

  markdown: {
    lineNumbers: true,
    
  },

  plugins: ["@vuepress/blog", "@vuepress/back-to-top"],
};
