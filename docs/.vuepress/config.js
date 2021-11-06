const { genSidebar, nav } = require("./utils.js");

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
  extraWatchFiles: ["./config.js"],

  themeConfig: {
    displayAllHeaders: false,
    logo: "/images/logo.jpg",
    sidebarDepth: 2,
    nav,
    sidebar: genSidebar(nav),
  },

  markdown: {
    lineNumbers: true,
    extractHeaders: ["h2", "h3", "h4", "h5", "h6", "h7"],
    toc: { includeLevel: [2, 3, 4, 5, 6, 7] },
  },

  plugins: [
    "@vuepress/blog",
    "@vuepress/back-to-top",
    "@vuepress/last-updated",
    "@vuepress/active-header-links",
    "@vuepress/nprogress",
    "@vuepress/pwa",
    [
      "@vuepress/google-analytics",
      {
        ga: "", // UA-00000000-0
      },
    ],
    [
      "vuepress-plugin-copyright",
      {
        noCopy: true, // the selected text will be uncopiable
        minLength: 100, // if its length is greater than 100
      },
    ],
    ['vuepress-plugin-code-copy', true]
  ],
};
