module.exports = {
    lang: 'zh-CN',
    title: '',
    description: '这是我的第一个 VuePress 站点',
    base: '/',

    themeConfig: {
        logo: '/images/logo.jpg',
        nav: [
            // NavbarItem
            {
                text: '生活',
                link: '/life/'
            },
            {
                text: '技术',
                items: [
                    {
                        text: 'html-css',
                        link: '/technology/html-css/'
                    },
                    {
                        text: 'javascript',
                        link: '/technology/javascript/'
                    }
                ]
            },
            {
                text: 'Github',
                link: 'https://github.com/wzp-coding/wzp-coding.github.com',
                target: '_blank'
            }
        ],
        sidebar: {
            '/technology/html-css/': [
                {
                    title:'html-css入门',
                    children:['index']
                },
                {
                    title:'html-css进阶',
                    children:['index2']
                }
            ],
            '/technology/javascript/': [
                {
                    title:'javascript入门',
                    children:['index']
                },
                {
                    title:'javascript进阶',
                    children:['index2']
                },
            ],
            '/life/':['','index'],
            '/':['']
        }

    },

    markdown: {
        lineNumbers: true
    },

    plugins: ['@vuepress/blog', '@vuepress/back-to-top']
}