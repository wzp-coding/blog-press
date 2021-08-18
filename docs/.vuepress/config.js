module.exports = {
    lang: 'zh-CN',
    title: '',
    description: '这是我的第一个 VuePress 站点',
    base: '/',

    themeConfig: {
        displayAllHeaders: true,
        logo: '/images/logo.jpg',
        nav: [
            // NavbarItem
            {
                text: '概述',
                link: '/'
            },
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
                    children:[
                        {title:'文章3',path:'/technology/html-css/index3'},
                    ]
                },
                {
                    title:'html-css进阶',
                    children:[
                        {title:'文章1',path:'/technology/html-css/index'},
                        {title:'文章2',path:'/technology/html-css/index2'},
                    ]
                }
            ],
            // '/technology/html-css/':['index','index2','index3'],
            '/technology/javascript/': [
                {
                    title:'javascript入门',
                    children:[
                        {title:'文章3',path:'/technology/javascript/index3'},
                    ]
                },
                {
                    title:'javascript进阶',
                    children:[
                        {title:'文章1',path:'/technology/javascript/index'},
                        {title:'文章2',path:'/technology/javascript/index2'},
                    ]
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