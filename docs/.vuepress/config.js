const { genSidebar, nav } = require('./utils.js')
const moment = require('moment')

module.exports = {
  head: [
    [
      'link', // 设置 favicon.ico，注意图片放在 public 文件夹下
      { rel: 'icon', href: '/logo.png' }
    ]
  ],

  lang: 'zh-CN',
  title: '吳澤鵬',
  // description: "钱端客栈",
  base: '/blog-press/',
  extraWatchFiles: ['./config.js'],

  themeConfig: {
    displayAllHeaders: false,
    logo: '/logo.png',
    sidebarDepth: 2,
    nav,
    sidebar: genSidebar(nav),
    lastUpdated: '最近更新',
    smoothScroll: true
  },

  markdown: {
    lineNumbers: true,
    extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
    toc: { includeLevel: [2, 3, 4, 5, 6, 7] }
  },

  plugins: [
    // '@vuepress/blog',
    '@vuepress/back-to-top',
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          moment.locale('zh-cn')
          return moment(timestamp).fromNow()
        }
      }
    ],
    '@vuepress/active-header-links',
    '@vuepress/nprogress',
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      }
    ],
    [
      '@vuepress/google-analytics',
      {
        ga: '' // UA-00000000-0
      }
    ],
    [
      'vuepress-plugin-copyright',
      {
        noCopy: true, // the selected text will be uncopiable
        minLength: 100 // if its length is greater than 100
      }
    ],
    ['vuepress-plugin-code-copy', true],
    ['@vssue/vuepress-plugin-vssue',
      {
        // 设置平台，而不是 `api` 
        platform: 'github-v4',
        // 其他的 Vssue 配置
        owner: 'wzp-coding', // 仓库的拥有者的名称
        repo: 'blog-press', // 存储 Issue 和评论的仓库的名称
        clientId: '3a9127eee150c7ae4a1c', // 刚保存下来的  Client ID
        clientSecret: 'f65d2fbc8758baeaa485c8cbfb1162f25af62b49', //  刚才保存下来的 Client secrets
        autoCreateIssue: true,//自动创建评论
      }
    ],
  ]
}
