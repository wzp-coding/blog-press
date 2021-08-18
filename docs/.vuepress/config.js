module.exports = {
    lang: 'zh-CN',
    title: '',
    description: '这是我的第一个 VuePress 站点',

    themeConfig: {
        logo: '/images/logo.jpg',
        nav: [
            // NavbarItem
            {
                text: 'Github',
                link: 'https://github.com/wzp-coding/wzp-coding.github.com',
                target: '_blank'
            },
        ],
        sidebar: {
            '/': [
                {
                    title: 'JavaScript',   // 必要的
                    // path: '/javascript/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                    // collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 2,    // 可选的, 默认值是 1
                    children: [
                        '/javascript/index',
                        '/javascript/index2',
                    ]
                },
                {
                    title: 'HTML-CSS',
                    // path: '/html-css/',
                    // collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 2,
                    children: [
                        '/html-css/index'
                    ],
                }
            ]
        }

    },

    markdown: {
        lineNumbers: true
    },

    plugins: ['@vuepress/blog', '@vuepress/back-to-top']
}