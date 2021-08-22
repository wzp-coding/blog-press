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
    displayAllHeaders: true,
    logo: "/images/logo.jpg",
    nav: [
      // NavbarItem
      {
        text: "首页",
        link: "/",
      },
      {
        text: "生活",
        link: "/life/",
      },
      {
        text: "技术",
        // link: "/technology/",
        items: [
          {
            text: "HTML-CSS",
            link: "/technology/html-css/",
          },
          {
            text: "JavaScript",
            link: "/technology/javascript/",
          },
          {
            text: "Webpack",
            link: "/technology/webpack/",
          },
          {
            text: "计算机网络",
            link: "/technology/computer-network/",
          },
          {
            text: "踩坑日记",
            link: "/technology/bug/",
          },
        ],
      },
      {
        text: "Github",
        link: "https://github.com/wzp-coding/blog-press",
        target: "_blank",
      },
    ],
    sidebar: {
      "/technology/html-css/": ["", "one", "two", "three"],
      "/technology/javascript/": ["", "one", "two"],
      "/technology/webpack/": ["", "one"],
      "/technology/computer-network/": ["", "one"],
      "/technology/bug/": ["", "vuepress踩坑", "git踩坑"],
      "/technology/": [""],
      "/life/": ["", "one"],
      "/": [""],
    },
  },

  markdown: {
    lineNumbers: true,
  },

  plugins: ["@vuepress/blog", "@vuepress/back-to-top"],
};
